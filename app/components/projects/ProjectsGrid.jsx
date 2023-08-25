import {
  createStyles,
  SimpleGrid,
  Card,
  Image,
  Text,
  AspectRatio,
  Skeleton,
} from '@mantine/core'
import { modals } from '@mantine/modals'
import ProjectModal from './ProjectModal'
import { useRef } from 'react'
import { useSkeletonLoading } from '../hooks/skeleton'

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

function ProjectCard({ project }) {
  const { classes } = useStyles()
  const imageRef = useRef(null)
  const { loading, handleOnLoad } = useSkeletonLoading(
    imageRef.current?.complete
  )

  return (
    <Card
      p="md"
      radius="md"
      onClick={() => {
        modals.open({
          children: <ProjectModal {...project} />,
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
            src={project.coverImgUrl}
            onLoad={handleOnLoad}
          />
        </AspectRatio>
      </Skeleton>
      <Text color="dimmed" size="xs" transform="uppercase" weight={700} mt="md">
        {project.date}
      </Text>
      <Text className={classes.title} mt={5}>
        {project.title}
      </Text>
    </Card>
  )
}

export default function ProjectsGrid({ projects }) {
  const cards = projects.map((project) => (
    <ProjectCard key={project.id} project={project} />
  ))

  return (
    <SimpleGrid cols={2} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
      {cards}
    </SimpleGrid>
  )
}
