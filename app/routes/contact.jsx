import { Outlet } from '@remix-run/react'

export default function ContactRoute() {
  return (
    <div>
      <h1>Contact Us</h1>
      <Outlet />
    </div>
  )
}
