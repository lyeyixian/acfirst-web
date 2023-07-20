import { Carousel, useAnimationOffsetEffect } from '@mantine/carousel'
import {
  createStyles,
  SimpleGrid,
  Card,
  Image,
  Text,
  AspectRatio,
  getStylesRef,
  rem,
  Group,
} from '@mantine/core'
import { modals } from '@mantine/modals'
import { useState } from 'react'

const useStyles = createStyles((theme) => ({
  carousel: {
    '&:hover': {
      [`& .${getStylesRef('carouselControls')}`]: {
        opacity: 1,
      },
    },
  },

  carouselControls: {
    ref: getStylesRef('carouselControls'),
    transition: 'opacity 150ms ease',
    opacity: 0,
  },

  carouselIndicator: {
    width: rem(4),
    height: rem(4),
    transition: 'width 250ms ease',

    '&[data-active]': {
      width: rem(16),
    },
  },

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

function ProjectCard({ title, description, projectImgUrls }) {
  const { classes } = useStyles()
  // TODO: need to check if image fits in the carousel
  const slides = projectImgUrls.map((image) => (
    <Carousel.Slide key={image}>
      <Image src={image} height={220} />
    </Carousel.Slide>
  ))

  const [embla, setEmbla] = useState(null)
  useAnimationOffsetEffect(embla, 200)

  return (
    <Card radius="md" padding="xl">
      <Card.Section>
        <Carousel
          withIndicators
          loop
          classNames={{
            root: classes.carousel,
            controls: classes.carouselControls,
            indicator: classes.carouselIndicator,
          }}
          getEmblaApi={setEmbla}
        >
          {slides}
        </Carousel>
      </Card.Section>

      <Group position="apart" mt="lg">
        <Text fw={500} fz="lg">
          {title}
        </Text>
      </Group>

      <Text fz="sm" c="dimmed" mt="sm">
        {description}
      </Text>
    </Card>
  )
}

export default function ProjectsGrid({ projects }) {
  // TODO: when mobile, make the modal full screen (with close button likely)
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
