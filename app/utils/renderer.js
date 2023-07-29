import {
  IconBath,
  IconCar,
  IconSofa,
  IconToolsKitchen2,
} from '@tabler/icons-react'
import HeroBanner from '../components/home/HeroBanner'
import ProductsSection from '../components/home/ProductsSection'
import ShowcaseSection from '../components/home/ShowcaseSection'

export function renderSection(section, index) {
  if (!section) {
    return null
  }

  switch (section.type) {
    case 'elements.text':
    case 'hero':
      const { title: heroTitle, description, button, imgUrl } = section

      return (
        <HeroBanner
          key={index}
          title={heroTitle}
          description={description}
          buttonProps={button}
          imgUrl={imgUrl}
        />
      )
    case 'showcase':
      const {
        title: showcaseTitle,
        subtitle: showcaseSubtitle,
        products,
      } = section

      return (
        <ShowcaseSection
          key={index}
          title={showcaseTitle}
          subtitle={showcaseSubtitle}
          products={products}
        />
      )
    case 'product-categories':
      const {
        title: categoriesTitle,
        subtitle: categoriesSubtitle,
        categories,
      } = section

      return (
        <ProductsSection
          key={index}
          title={categoriesTitle}
          subtitle={categoriesSubtitle}
          categories={categories}
        />
      )
    default:
      return null
  }
}

export function renderCategoryIcon(category) {
  if (!category) {
    return null
  }

  switch (category.slug) {
    case 'kitchen':
      return IconToolsKitchen2
    case 'bathroom':
      return IconBath
    case 'living-room':
      return IconSofa
    case 'car-poch':
      return IconCar
    default:
      return null
  }
}
