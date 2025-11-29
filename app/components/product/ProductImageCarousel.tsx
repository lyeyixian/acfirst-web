import { Carousel } from '@mantine/carousel'
import { Image } from '@mantine/core'
import AcfirstCarousel from '../common/AcfirstCarousel'
import { useEffect, useState } from 'react'
import AcfirstSkeleton from '../common/AcfirstSkeleton'

function BigSlide({ imageUrl }) {
  return (
    <Carousel.Slide>
      <AcfirstSkeleton>
        {(handleOnLoad, imageRef) => (
          <Image
            imageRef={imageRef}
            src={imageUrl}
            fit="contain"
            onLoad={handleOnLoad}
          />
        )}
      </AcfirstSkeleton>
    </Carousel.Slide>
  )
}

function SmallSlide({ imageUrl, isCurrentImageShown, ...props }) {
  return (
    <Carousel.Slide>
      <AcfirstSkeleton>
        {(handleOnLoad, imageRef) => (
          <Image
            sx={(theme) => ({
              borderStyle: isCurrentImageShown ? 'solid' : null,
              borderColor: isCurrentImageShown
                ? theme.colors[theme.primaryColor][6]
                : null,
              borderRadius: isCurrentImageShown ? theme.radius.sm : 0,
            })}
            src={imageUrl}
            fit="contain"
            onLoad={handleOnLoad}
            imageRef={imageRef}
            {...props}
          />
        )}
      </AcfirstSkeleton>
    </Carousel.Slide>
  )
}

export default function ProductImageCarousel({ productImages }) {
  const [imageShown, setImageShown] = useState(0)
  const [emblaBig, setEmblaBig] = useState(null)
  const [emblaSmall, setEmblaSmall] = useState(null)

  useEffect(() => {
    if (emblaBig && emblaSmall) {
      emblaBig.scrollTo(imageShown)
      emblaSmall.scrollTo(imageShown)
    }
  }, [emblaBig, emblaSmall, imageShown])

  const bigSlides = productImages.map((image, index) => (
    <BigSlide key={index} imageUrl={image} />
  ))

  const smallSlides = productImages.map((image, index) => (
    <SmallSlide
      key={index}
      imageUrl={image}
      isCurrentImageShown={imageShown === index}
      onClick={() => setImageShown(index)}
    />
  ))

  return (
    <>
      <AcfirstCarousel
        onSlideChange={(index) => setImageShown(index)}
        withIndicators
        loop
        getEmblaApi={setEmblaBig}
        slideGap="sm"
      >
        {bigSlides}
      </AcfirstCarousel>
      <AcfirstCarousel
        mt="xs"
        onSlideChange={(index) => setImageShown(index)}
        withControls={false}
        slideSize="25%"
        slideGap="md"
        align="start"
        slidesToScroll={productImages.length >= 4 ? 1 : 4}
        getEmblaApi={setEmblaSmall}
        skipSnaps={true}
        containScroll="keepSnaps"
      >
        {smallSlides}
      </AcfirstCarousel>
    </>
  )
}
