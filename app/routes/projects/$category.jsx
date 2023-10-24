import { json } from '@remix-run/node'
import { useLoaderData, useSearchParams, useParams } from '@remix-run/react'
import {
  Anchor,
  Breadcrumbs,
  Container,
  Pagination,
  Stack,
} from '@mantine/core'
import { useEffect, useState } from 'react'
import { getProjects } from '../../models/project.server'
import {
  formatDate,
  getStrapiMedia,
  getStrapiMedias,
} from '../../utils/apiHelper'
import ProjectsGrid from '../../components/projects/ProjectsGrid'

export async function loader({ request, params }) {
  const url = new URL(request.url)
  const page = url.searchParams.get('p') || 1

  const { category } = params
  const projects = await getProjects(page, category)
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
  const [_, setSearchParams] = useSearchParams()
  const params = useParams()
  useEffect(() => {
    setSearchParams({ p: page })
  }, [page])

  const loaderData = useLoaderData()
  const { projects, pageCount } = loaderData

  const breadcrumbs = [
    { title: 'Home', href: '/' },
    { title: 'Projects', href: '/projects' },
    { title: params.category, href: '/projectsCategory/' + params.category },
  ].map((item, index) => (
    <Anchor href={item.href} key={index}>
      {item.title}
    </Anchor>
  ))

  return (
    <div>
      {/* <h1>{params.category} Projects</h1>
      <Container my="xs">
        <Breadcrumbs>{breadcrumbs}</Breadcrumbs>
      </Container> */}
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
