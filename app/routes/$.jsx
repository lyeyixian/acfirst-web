import { json } from '@remix-run/node'

// This route is to fixed root loader data not runned on 404 page
export function loader() {
  throw json(null, { status: 404, statusText: 'Not found' })
}

export default function NotFound() {
  return null
}
