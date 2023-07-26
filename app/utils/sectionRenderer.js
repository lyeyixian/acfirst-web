import HeroBanner from '../components/HeroBanner'
import ProductsSection from '../components/ProductsSection'
import ShowcaseSection from '../components/ShowcaseSection'

export function sectionRenderer(section, index) {
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
