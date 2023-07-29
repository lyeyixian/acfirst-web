import { Carousel, useAnimationOffsetEffect } from '@mantine/carousel'
import {
  Card,
  Group,
  Image,
  Text,
  createStyles,
  getStylesRef,
  rem,
} from '@mantine/core'
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
}))

export default function ProjectCard({ title, description, projectImgUrls }) {
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
