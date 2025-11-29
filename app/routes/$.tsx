import { json } from '@remix-run/node'

// This route is to fixed root loader data not runned on 404 page
export function loader() {
  const status = 404
  const statusText = 'Nothing to See Here'

  throw json(null, { status, statusText })
}

export default function NotFound() {
  return null
}
