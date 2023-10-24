import { Stack } from '@mantine/core'
import { CategoriesGrid } from '../projects'
import { useLoaderData } from '@remix-run/react'
import { getCategories } from '../../models/category.server'
import { getStrapiMedia } from '../../utils/apiHelper'

export async function loader() {
  const categories = await getCategories()
  const prunedCategories = categories.data.map((category) => {
    const { name, slug, description, coverImg } = category.attributes
    return {
      name,
      slug,
      description,
      coverImgUrl: getStrapiMedia(coverImg.data),
    }
  })

  return { categories: prunedCategories }
}

export default function () {
  const loaderData = useLoaderData()
  const { categories } = loaderData
  return (
    <Stack justify="space-between" mih={730}>
      <CategoriesGrid categories={categories} />
    </Stack>
  )
}
