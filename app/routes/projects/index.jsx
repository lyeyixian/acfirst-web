import { json } from '@remix-run/node'
import { useLoaderData, useSearchParams } from '@remix-run/react'
import { Pagination } from '@mantine/core'
import { useEffect, useState } from 'react'
import ProjectsGrid from '../../components/ProjectsGrid'
import { getAllProjects } from '../../models/project.server'
import {
  formatDate,
  getStrapiMedia,
  getStrapiMedias,
} from '../../utils/apiHelper'

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

export default function ProjectsIndexRoute() {
  const [page, setPage] = useState(1)
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    setSearchParams({ p: page })
  }, [page, setSearchParams])

  const loaderData = useLoaderData()
  const { projects, pageCount } = loaderData

  return (
    <div>
      <ProjectsGrid projects={projects} />
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
