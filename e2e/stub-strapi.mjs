// SKETCH — written by `border-collie init` (v0.6.0-sketch).
//
// This app has no data of its own: every route loads from Strapi. To boot it
// for an end-to-end check, something must answer on :1337. This is that
// something — a canned Strapi, served out of e2e/fixtures/.
//
// It logs every path it has no fixture for. That log IS the cost estimate for
// this repo's e2e rung: each MISS is a fixture a human has to record from the
// real Strapi before an agent can verify a change by running the app.

import { createServer } from 'node:http'
import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const PORT = 1337

// path prefix -> fixture file. Deliberately tiny: enough for the smoke spec,
// nowhere near enough for the whole app.
const ROUTES = [
  ['/api/pages', 'pages.json'],
  ['/api/global', 'global.json'],
  ['/api/testimonials', 'testimonials.json'],
]

const misses = new Set()

createServer((req, res) => {
  const path = req.url.split('?')[0]
  const hit = ROUTES.find(([prefix]) => path.startsWith(prefix))

  if (!hit) {
    misses.add(path)
    console.log(`[stub-strapi] MISS ${path} — no fixture recorded`)
    res.writeHead(404, { 'content-type': 'application/json' })
    res.end(JSON.stringify({ data: null, error: { message: 'no fixture' } }))
    return
  }

  const file = join(here, 'fixtures', hit[1])
  if (!existsSync(file)) {
    misses.add(path)
    console.log(`[stub-strapi] MISS ${path} — fixtures/${hit[1]} not recorded`)
    res.writeHead(404, { 'content-type': 'application/json' })
    res.end(JSON.stringify({ data: null }))
    return
  }

  res.writeHead(200, { 'content-type': 'application/json' })
  res.end(readFileSync(file, 'utf8'))
}).listen(PORT, () => console.log(`[stub-strapi] listening on :${PORT}`))

process.on('SIGTERM', () => {
  console.log(`[stub-strapi] ${misses.size} distinct paths had no fixture`)
  process.exit(0)
})
