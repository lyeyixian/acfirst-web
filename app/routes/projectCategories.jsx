import { useLoaderData, useSearchParams } from '@remix-run/react'
import { createStyles, Card, Pagination, Stack, Image, SimpleGrid, Text,
    AspectRatio,
    Skeleton } from '@mantine/core'
import { useEffect, useState, useRef } from 'react'
import { getCategories } from '../models/category.server'
import { getStrapiMedia, getStrapiMedias } from '../utils/apiHelper'
import { modals } from '@mantine/modals'
import ProjectModal from '../components/projects/ProjectModal'
import { useSkeletonLoading } from '../components/hooks/skeleton'

const useStyles = createStyles((theme) => ({
    card: {
      transition: 'transform 150ms ease, box-shadow 150ms ease',
  
      '&:hover': {
        transform: 'scale(1.01)',
        boxShadow: theme.shadows.md,
      },
    },
  
    title: {
      fontFamily: `Greycliff CF, ${theme.fontFamily}`,
      fontWeight: 600,
    },
  }))
  
export async function loader() {
    const categories = await getCategories()
    const prunedCategories = categories.data.map((category) => {
      const { name, slug, description, coverImg, projects } = category.attributes
      return {
        name,
        slug,
        description,
        coverImgUrl: getStrapiMedia(coverImg.data),
        projects: projects.attributes,
        projectsCoverImgUrls: getStrapiMedias(projects.data.map(project => project.attributes.coverImg.data))
      }
    })
  
    return { categories: prunedCategories }
}

function CategoryCard({ category }) {
    const { classes } = useStyles()
    const imageRef = useRef(null)
    const { loading, handleOnLoad } = useSkeletonLoading(imageRef)

    console.log(category)
    return (
      <Card
        p="md"
        radius="md"
        onClick={() => {
          modals.open({
            children: <ProjectModal title={category.name} description={category.description} projectImgUrls={category.projectsCoverImgUrls} />,
            centered: true,
            withCloseButton: false,
            padding: 0,
            radius: 'md',
            trapFocus: false,
          })
        }}
        className={classes.card}
      >
        <Skeleton visible={loading}>
          <AspectRatio ratio={1920 / 1080}>
            <Image
              imageRef={imageRef}
              src={category.coverImgUrl}
              onLoad={handleOnLoad}
            />
          </AspectRatio>
        </Skeleton>
        <Text className={classes.title} mt={5}>
          {category.name}
        </Text>
      </Card>
    )
}

export function CategoriesGrid({ categories }) {
    const cards = categories.map((category) => (
      <CategoryCard key={category.slug} category={category} />
    ))
  
    return (
      <SimpleGrid cols={2} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
        {cards}
      </SimpleGrid>
    )
  }
  
  
export default function ProjectsRoute() {
  const [page, setPage] = useState(1)
  const [_, setSearchParams] = useSearchParams()

  useEffect(() => {
    setSearchParams({ p: page })
  }, [page])

  const loaderData = useLoaderData()
  const { categories } = loaderData
  console.log(categories)

  return (
    <div>
      <h1>Projects</h1>
      <Stack justify="space-between" mih={730}>
      <CategoriesGrid categories={categories} />
        <Pagination
          value={page}
          onChange={setPage}
          total={1}
          position="center"
          withEdges
          mt="md"
        />
      </Stack>
    </div>
  )
}
