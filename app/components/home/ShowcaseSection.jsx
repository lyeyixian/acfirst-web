import { Text, Title, createStyles, rem } from '@mantine/core'
import CardsCarousel from './CardsCarousel'
import SectionContainer from './SectionContainer'

export default function ShowcaseSection({ title, subtitle, products }) {
  return (
    <SectionContainer title={title} subtitle={subtitle}>
      <CardsCarousel products={products} />
    </SectionContainer>
  )
}
