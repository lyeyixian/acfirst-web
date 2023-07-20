import { Outlet } from '@remix-run/react'

export default function TermsRoute() {
  return (
    <div>
      <h1>Terms & Conditions</h1>
      <Outlet />
    </div>
  )
}
