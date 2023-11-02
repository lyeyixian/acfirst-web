import { Carousel } from '@mantine/carousel'
import SectionContainer from './SectionContainer'
import ProductImageCard from '../common/ProductImageCard'
import AcfirstCarousel from '../common/AcfirstCarousel'

function CardsCarousel({ products }) {
  const slides = products.map((product, index) => (
    <Carousel.Slide key={index}>
      <ProductImageCard product={product} height={280} />
    </Carousel.Slide>
  ))

  return (
    <AcfirstCarousel
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
    </AcfirstCarousel>
  )
}

export default function ShowcaseSection({ title, subtitle, products }) {
  return (
    <SectionContainer title={title} subtitle={subtitle}>
      <CardsCarousel products={products} />
    </SectionContainer>
  )
}
