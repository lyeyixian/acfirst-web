import { Link, Outlet, useParams } from '@remix-run/react'
import {
  createStyles,
  rem,
  Card,
  Image,
  SimpleGrid,
  Text,
  AspectRatio,
  Skeleton,
} from '@mantine/core'
import { useRef } from 'react'
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

  link: {
    display: 'block',
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[1]
        : theme.colors.gray[6],
    fontSize: theme.fontSizes.sm,
    paddingTop: rem(3),
    paddingBottom: rem(3),
    textDecoration: 'none',

    '&:hover': {
      textDecoration: 'underline',
    },
  },
}))

function CategoryCard({ category }) {
  const { classes } = useStyles()
  const imageRef = useRef(null)
  const { loading, handleOnLoad } = useSkeletonLoading(imageRef)

  return (
    <Card
      p="md"
      radius="md"
      className={classes.card}
      component={Link}
      to={`/projects/${category.name}`}
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
  const params = useParams()

  return (
    <div>
      <h1>{params.category} Projects</h1>
      <Outlet />
    </div>
  )
}
