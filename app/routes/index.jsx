import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

import { Container } from '@mantine/core'

import { getPageBySlug } from '../api/page'
import { sectionRenderer } from '../utils/sectionRenderer'
import { getStrapiMedia } from '../utils/apiHelper'

export async function loader() {
  const pageData = await getPageBySlug('home')
  const sections = pageData.attributes.contentSection.map((section) => {
    switch (section.__component) {
      case 'sections.hero':
        const { title, description, button, picture } = section
        return {
          type: 'hero',
          title,
          description,
          button,
          imgUrl: getStrapiMedia(picture.data),
        }
      case 'sections.showcase':
        const { heading: showcaseHeading, products } = section
        const prunedProducts = products.data.map((product) => {
          const {
            name,
            code,
            size,
            surface,
            type,
            description,
            viewCount,
            productImg,
            category,
            coverImg,
          } = product.attributes

          return {
            code,
            category: category.data.attributes.name,
            name,
            viewCount,
            imgUrl: getStrapiMedia(coverImg.data),
          }
        })
        return {
          type: 'showcase',
          title: showcaseHeading.title,
          subtitle: showcaseHeading.subtitle,
          products: prunedProducts,
        }
      case 'sections.product-categories':
        const { heading: categoriesHeading, categories } = section
        const prunedCategories = categories.data.map((category) => {
          const { name, slug, coverImg } = category.attributes
          return {
            name,
            slug,
            imgUrl: getStrapiMedia(coverImg.data),
          }
        })

        return {
          type: 'product-categories',
          title: categoriesHeading.title,
          subtitle: categoriesHeading.subtitle,
          categories: prunedCategories,
        }
      default:
        return null
    }
  })

  return json(sections)
}

export default function Index() {
  const data = useLoaderData()
  const sections = data.map((section, index) => sectionRenderer(section, index))
  return (
    <div>
      {sections[0]}
      <Container>{sections.slice(1)}</Container>
    </div>
  )
}
