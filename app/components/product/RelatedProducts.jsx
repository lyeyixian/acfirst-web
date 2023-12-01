import { Title } from '@mantine/core'
import AcfirstCarousel from '../common/AcfirstCarousel'
import { Carousel } from '@mantine/carousel'
import ProductImageCard from '../common/ProductImageCard'

export default function RelatedProducts({ products }) {
  const relatedProductsCarousel = products.map((relatedProduct, index) => (
    <Carousel.Slide key={index}>
      <ProductImageCard product={relatedProduct} height={225} />
    </Carousel.Slide>
  ))
  return (
    <>
      <Title mt={32} order={3}>
        Related Products
      </Title>
      <AcfirstCarousel
        mt="md"
        loop
        slideSize="25%"
        slidesToScroll="auto"
        slideGap="md"
        align="start"
        breakpoints={[
          { maxWidth: 'sm', slideSize: '33.333333%' },
          { maxWidth: 'xs', slideSize: '50%' },
        ]}
      >
        {relatedProductsCarousel}
      </AcfirstCarousel>
    </>
  )
}
