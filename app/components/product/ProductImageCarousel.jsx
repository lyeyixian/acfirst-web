import { Carousel } from '@mantine/carousel'
import { Image } from '@mantine/core'
import AcfirstCarousel from '../common/AcfirstCarousel'
import { useEffect, useState } from 'react'

export default function ProductImageCarousel({ productImages }) {
  const [imageShown, setImageShown] = useState(0)
  const [embla, setEmbla] = useState(null)
  const [emblaForSubCarousel, setEmblaForSubCarousel] = useState(null)

  useEffect(() => {
    if (embla && emblaForSubCarousel) {
      embla.scrollTo(imageShown)
      emblaForSubCarousel.scrollTo(imageShown)
    }
  }, [embla, emblaForSubCarousel, imageShown])

  const bigSlides = productImages.map((image, index) => {
    return (
      <Carousel.Slide key={index}>
        <Image src={image} fit="contain" />
      </Carousel.Slide>
    )
  })

  const smallSlides = productImages.map((image, index) => {
    const isCurrentImageShown = imageShown === index

    return (
      <Carousel.Slide key={index}>
        <Image
          sx={(theme) => ({
            borderStyle: isCurrentImageShown ? 'solid' : null,
            borderColor: isCurrentImageShown
              ? theme.colors[theme.primaryColor][6]
              : null,
            borderRadius: isCurrentImageShown ? theme.radius.sm : 0,
          })}
          src={image}
          fit="contain"
          onClick={() => setImageShown(index)}
        />
      </Carousel.Slide>
    )
  })

  return (
    <>
      <AcfirstCarousel
        onSlideChange={(index) => setImageShown(index)}
        withIndicators
        loop
        getEmblaApi={setEmbla}
        slideGap="sm"
      >
        {bigSlides}
      </AcfirstCarousel>
      <AcfirstCarousel
        mt="xs"
        onSlideChange={(index) => setImageShown(index)}
        loop
        withControls={false}
        slideSize="25%"
        slideGap="md"
        align="start"
        slidesToScroll={productImages.length >= 4 ? 1 : 4}
        getEmblaApi={setEmblaForSubCarousel}
      >
        {smallSlides}
      </AcfirstCarousel>
    </>
  )
}
