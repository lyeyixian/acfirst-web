import { json } from '@remix-run/node'
import { useLoaderData, useSearchParams } from '@remix-run/react'
import { Pagination, Stack } from '@mantine/core'
import { useEffect, useState } from 'react'
import { getProjects } from '../models/project.server'
import {
  formatDate,
  getStrapiMedia,
  getStrapiMedias,
} from '../utils/api/helper'
import ProjectsGrid from '../components/projects/ProjectsGrid'

export async function loader({ request }) {
  const url = new URL(request.url)
  const page = url.searchParams.get('p') || 1
  const projects = await getProjects(page)
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
  const [_, setSearchParams] = useSearchParams()

  useEffect(() => {
    setSearchParams({ p: page })
  }, [page])

  const loaderData = useLoaderData()
  const { projects, pageCount } = loaderData

  return (
    <div>
      <h1>Projects</h1>
      <Stack justify="space-between" mih={730}>
        <ProjectsGrid projects={projects} />
        <Pagination
          value={page}
          onChange={setPage}
          total={pageCount}
          position="center"
          withEdges
          mt="md"
        />
      </Stack>
    </div>
  )
}
