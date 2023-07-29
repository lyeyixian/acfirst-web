import {
  createStyles,
  SimpleGrid,
  Card,
  Image,
  Text,
  AspectRatio,
} from '@mantine/core'
import { modals } from '@mantine/modals'
import ProjectCard from './ProjectCard'

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

export default function ProjectsGrid({ projects }) {
  // TODO: when mobile, make the modal full screen (with close button likely)
  // TODO: add skeleton to cover image and project images
  const { classes } = useStyles()
  const cards = projects.map((project) => (
    <Card
      key={project.id}
      p="md"
      radius="md"
      onClick={() => {
        modals.open({
          children: <ProjectCard {...project} />,
          centered: true,
          withCloseButton: false,
          padding: 0,
          radius: 'md',
          trapFocus: false,
        })
      }}
      className={classes.card}
    >
      <AspectRatio ratio={1920 / 1080}>
        <Image src={project.coverImgUrl} />
      </AspectRatio>
      <Text color="dimmed" size="xs" transform="uppercase" weight={700} mt="md">
        {project.date}
      </Text>
      <Text className={classes.title} mt={5}>
        {project.title}
      </Text>
    </Card>
  ))

  return (
    <SimpleGrid cols={2} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
      {cards}
    </SimpleGrid>
  )
}
