import { Outlet } from '@remix-run/react'

export default function PrivacyRoute() {
  return (
    <div>
      <h1>Privacy Policy</h1>
      <Outlet />
    </div>
  )
}
