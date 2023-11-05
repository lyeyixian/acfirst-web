import { json } from '@remix-run/node'
import { useLoaderData, useSearchParams, Link } from '@remix-run/react'
import { Anchor, Pagination, Stack, Text } from '@mantine/core'
import { useEffect, useState } from 'react'
import { getProjects } from '../../models/project.server'
import {
  formatDate,
  getStrapiMedia,
  getStrapiMedias,
} from '../../utils/api/helper'
import ProjectsGrid from '../../components/projects/ProjectsGrid'
import { IconFileX } from '@tabler/icons-react'

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
        <Stack justify="center" align="center" mih={730} spacing="xs">
          <IconFileX size="2rem" />
          <Text size="lg" weight={500}>
            No projects found
          </Text>
          <Anchor component={Link} to="/projects">
            Browse other categories
          </Anchor>
        </Stack>
      )}
    </div>
  )
}
