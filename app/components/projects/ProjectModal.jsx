import { Carousel, useAnimationOffsetEffect } from '@mantine/carousel'
import { Card, Group, Image, Skeleton, Text } from '@mantine/core'
import { useRef, useState } from 'react'
import { useSkeletonLoading } from '../hooks/skeleton'
import AcfirstCarousel from '../common/AcfirstCarousel'

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
  const slides = projectImgUrls.map((image) => (
    <ImageSlide key={image} image={image} />
  ))

  // Fix for carousel in modal offset issue
  const [embla, setEmbla] = useState(null)
  useAnimationOffsetEffect(embla, 300)

  return (
    <Card radius="md" padding="xl">
      <Card.Section>
        <AcfirstCarousel withIndicators loop getEmblaApi={setEmbla}>
          {slides}
        </AcfirstCarousel>
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
