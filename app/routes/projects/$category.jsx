import { json } from '@remix-run/node'
import { useLoaderData, useSearchParams, Link } from '@remix-run/react'
import { Button, Pagination, Stack } from '@mantine/core'
import { useEffect, useState } from 'react'
import { getProjects } from '../../models/project.server'
import {
  formatDate,
  getStrapiMedia,
  getStrapiMedias,
} from '../../utils/api/helper'
import ProjectsGrid from '../../components/projects/ProjectsGrid'
import EmptyState from '../../components/common/EmptyState'

export async function loader({ request, params }) {
  const url = new URL(request.url)
  const page = url.searchParams.get('p') || 1

  const { category } = params
  const projects = await getProjects(page, category)
  const prunedProjects = projects.data.map((project) => {
    const { title, date, coverImg, projectImg } = project.attributes

    return {
      id: project.id,
      title,
      date: formatDate(date),
      coverImgUrl: getStrapiMedia(coverImg.data),
      projectImgUrls: getStrapiMedias(projectImg.data),
    }
  })

  return json({
    projects: prunedProjects,
    pageCount: projects.meta.pagination.pageCount,
  })
}

export function shouldRevalidate({
  currentParams,
  nextParams,
  defaultShouldRevalidate,
}) {
  if (currentParams.category === nextParams.category) {
    return false
  }

  return defaultShouldRevalidate
}

export default function ProjectsIndexRoute() {
  const [searchParams, setSearchParams] = useSearchParams()
  const searchParamsPage = searchParams.get('p') || 1
  const [page, setPage] = useState(searchParamsPage)
  const loaderData = useLoaderData()
  const { projects, pageCount } = loaderData

  useEffect(() => {
    setPage(parseInt(searchParamsPage))
  }, [searchParamsPage])

  return (
    <div>
      {projects.length ? (
        <Stack justify="space-between" mih={730}>
          <ProjectsGrid projects={projects} />
          <Pagination
            value={page}
            onChange={(value) => {
              setPage(value)
              setSearchParams((params) => {
                params.set('p', value)
                return params
              })
            }}
            total={pageCount}
            position="center"
            mt="lg"
            withEdges
          />
        </Stack>
      ) : (
        <EmptyState title="No projects found" mih={730}>
          <Button variant="subtle" component={Link} to="/products">
            Browse other categories
          </Button>
        </EmptyState>
      )}
    </div>
  )
}
