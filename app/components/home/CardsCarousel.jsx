import { Carousel } from '@mantine/carousel'
import { createStyles, Paper, Text, Title, Button, rem } from '@mantine/core'
import { ImageCard } from './ImageCard'

const useStyles = createStyles((theme) => ({
  card: {
    height: rem(325),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontWeight: 900,
    color: theme.white,
    lineHeight: 1.2,
    fontSize: rem(32),
    marginTop: theme.spacing.xs,
  },

  category: {
    color: theme.white,
    opacity: 0.7,
    fontWeight: 700,
    textTransform: 'uppercase',
  },
}))

// TODO: refactor to ShowcaseSection
export default function CardsCarousel({ products }) {
  const slides = products.map((product, index) => (
    <Carousel.Slide key={index}>
      <ImageCard {...product} />
    </Carousel.Slide>
  ))

  return (
    <Carousel
      slideSize="33.333333%"
      breakpoints={[
        { maxWidth: 'sm', slideSize: '50%' },
        { maxWidth: 'xs', slideSize: '100%' },
      ]}
      slideGap="lg"
      align="start"
      slidesToScroll="auto"
      loop
    >
      {slides}
    </Carousel>
  )
}
