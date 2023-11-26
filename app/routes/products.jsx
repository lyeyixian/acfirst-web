import { Divider, Grid, NavLink, ThemeIcon } from '@mantine/core'
import {
  Outlet,
  useParams,
  Link,
  useLoaderData,
  useSearchParams,
} from '@remix-run/react'
import { useEffect, useState } from 'react'
import FiltersGroup from '../components/FiltersGroup'
import { getCategories } from '../models/category.server'
import { renderCategoryIcon, renderFilterIcon } from '../utils/renderer'
import { getProductSchema } from '../models/contentType.server'
import { formatSize } from '../utils/formatter'
import { _ } from 'lodash'

// TODO: dont make the loader run when search params changed
export async function loader() {
  const categories = await getCategories()
  const prunedCategories = categories.data.map((category) => {
    const { name, slug } = category.attributes
    return {
      name,
      slug,
    }
  })
  const productSchema = await getProductSchema()
  const filterData = ['type', 'surface', 'size'].map((key) => {
    return {
      label: _.startCase(key),
      slug: key,
      filters: productSchema.data.schema.attributes[key].enum.map((item) => {
        return {
          label: key == 'size' ? formatSize(item) : _.startCase(item),
          slug: item,
        }
      }),
    }
  })

  return { categories: prunedCategories, filterData }
}

export default function ProductsRoute() {
  const { category } = useParams()
  const [active, setActive] = useState(category)
  useEffect(() => {
    setActive(category)
  }, [category])

  const { categories, filterData } = useLoaderData()

  const specificationFilters = filterData.map((item) => (
    <FiltersGroup
      {...item}
      icon={renderFilterIcon(item.slug)}
      key={item.label}
    />
  ))

  const [searchParams] = useSearchParams()
  const categoryFilters = categories.map((category, index) => {
    const CategoryIcon = renderCategoryIcon(category)
    const preserveSearchParams = (str) => {
      const searchParamsEntries = [...searchParams.entries()]
      const newSearchParams = new URLSearchParams(
        Object.fromEntries(searchParamsEntries.filter(([key]) => key !== 'p'))
      )

      return str + `?${newSearchParams.toString()}`
    }
    return (
      <div key={index}>
        {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
        <NavLink
          fw={500}
          label={category.name}
          icon={
            <ThemeIcon variant="outline" size={30}>
              <CategoryIcon size="1.1rem" />
            </ThemeIcon>
          }
          active={active === category.slug}
          component={Link}
          to={preserveSearchParams(
            active === category.slug
              ? '/products/all'
              : `/products/${category.slug}`
          )}
        />
      </div>
    )
  })

  return (
    <div>
      <h1>Products</h1>
      <Grid>
        <Grid.Col span={3}>
          {categoryFilters}
          <Divider my="md" />
          {specificationFilters}
        </Grid.Col>
        <Grid.Col span="auto">
          <Outlet />
        </Grid.Col>
      </Grid>
    </div>
  )
}
