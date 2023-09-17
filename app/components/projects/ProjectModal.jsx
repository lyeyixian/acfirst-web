import { Carousel, useAnimationOffsetEffect } from '@mantine/carousel'
import {
  Card,
  Group,
  Image,
  Skeleton,
  Text,
  createStyles,
  getStylesRef,
  rem,
} from '@mantine/core'
import { useRef, useState } from 'react'
import { useSkeletonLoading } from '../hooks/skeleton'

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

function ImageSlide({ image }) {
  const imageRef = useRef(null)
  const { loading, handleOnLoad } = useSkeletonLoading(imageRef)

  return (
    <Carousel.Slide>
      <Skeleton visible={loading}>
        <Image
          imageRef={imageRef}
          src={image}
          height={220}
          onLoad={handleOnLoad}
        />
      </Skeleton>
    </Carousel.Slide>
  )
}

export default function ProjectModal({ title, description, projectImgUrls }) {
  const { classes } = useStyles()
  const slides = projectImgUrls.map((image) => (
    <ImageSlide key={image} image={image} />
  ))

  // Fix for carousel in modal offset issue
  const [embla, setEmbla] = useState(null)
  useAnimationOffsetEffect(embla, 300)

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