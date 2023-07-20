import { Outlet } from '@remix-run/react'

export default function ProjectsRoute() {
  return (
    <div>
      <h1>Projects</h1>
      <Outlet />
    </div>
  )
}
