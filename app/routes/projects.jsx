import { json } from '@remix-run/node'
import { useLoaderData, useSearchParams } from '@remix-run/react'
import { Pagination } from '@mantine/core'
import { useEffect, useState } from 'react'
import { getAllProjects } from '../models/project.server'
import { formatDate, getStrapiMedia, getStrapiMedias } from '../utils/apiHelper'
import ProjectsGrid from '../components/projects/ProjectsGrid'

export async function loader({ request }) {
  const url = new URL(request.url)
  const page = url.searchParams.get('p') || 1
  const projects = await getAllProjects(page)
  const prunedProjects = projects.data.map((project) => {
    const { title, date, coverImg, description, projectImg } =
      project.attributes

    return {
      id: project.id,
      title,
      date: formatDate(date),
      coverImgUrl: getStrapiMedia(coverImg.data),
      description,
      projectImgUrls: getStrapiMedias(projectImg.data),
    }
  })

  return json({
    projects: prunedProjects,
    pageCount: projects.meta.pagination.pageCount,
  })
}

export default function ProjectsRoute() {
  const [page, setPage] = useState(1)
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    setSearchParams({ p: page })
  }, [page])

  const loaderData = useLoaderData()
  const { projects, pageCount } = loaderData

  return (
    <div>
      <h1>Projects</h1>
      <ProjectsGrid projects={projects} />
      {/* TODO: fix pagination to the bottom */}
      <Pagination
        value={page}
        onChange={setPage}
        total={pageCount}
        position="center"
        withEdges
        mt="md"
      />
    </div>
  )
}
