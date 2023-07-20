import { Outlet } from '@remix-run/react'

export default function ProductsRoute() {
  return (
    <div>
      <h1>Products</h1>
      <Outlet />
    </div>
  )
}
