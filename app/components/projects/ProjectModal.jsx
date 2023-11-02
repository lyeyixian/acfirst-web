import { Carousel, useAnimationOffsetEffect } from '@mantine/carousel'
import { Card, Image, Text } from '@mantine/core'
import { useRef, useState } from 'react'
import AcfirstCarousel from '../common/AcfirstCarousel'
import AcfirstSkeleton from '../common/AcfirstSkeleton'

function ImageSlide({ image }) {
  const imageRef = useRef(null)

  return (
    <Carousel.Slide>
      <AcfirstSkeleton imageRef={imageRef}>
        {(handleOnLoad) => (
          <Image
            imageRef={imageRef}
            src={image}
            height={220}
            onLoad={handleOnLoad}
          />
        )}
      </AcfirstSkeleton>
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
