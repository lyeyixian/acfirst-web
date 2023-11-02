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

export default function ProjectModal({ title, projectImgUrls }) {
  const slides = projectImgUrls.map((image) => (
    <ImageSlide key={image} image={image} />
  ))

  // Fix for carousel in modal offset issue
  const [embla, setEmbla] = useState(null)
  useAnimationOffsetEffect(embla, 300)

  return (
    <Card radius="md" padding="md">
      <Card.Section>
        <AcfirstCarousel withIndicators loop getEmblaApi={setEmbla}>
          {slides}
        </AcfirstCarousel>
      </Card.Section>

      <Text fw={500} mt="md" fz="lg">
        {title}
      </Text>
    </Card>
  )
}
