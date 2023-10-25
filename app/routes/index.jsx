import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

import { Container } from '@mantine/core'

import { getPage } from '../models/page.server'
import { renderSection } from '../utils/renderer'
import { getStrapiMedia } from '../utils/api/helper'

export async function loader() {
  const pageData = await getPage('home')
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
          const { name, code, viewCount, category, coverImg } =
            product.attributes

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
  const sections = data.map((section, index) => renderSection(section, index))
  return (
    <div>
      {sections[0]}
      <Container>{sections.slice(1)}</Container>
    </div>
  )
}
