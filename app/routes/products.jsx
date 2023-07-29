import { Divider, Grid, NavLink, Select, ThemeIcon } from '@mantine/core'
import { Outlet, useParams, Link, useLoaderData } from '@remix-run/react'
import { useEffect, useState } from 'react'
import FiltersGroup from '../components/FiltersGroup'
import {
  IconCategory,
  IconChevronDown,
  IconRuler,
  IconSquaresFilled,
} from '@tabler/icons-react'
import { getCategories } from '../models/category.server'
import { renderCategoryIcon } from '../utils/renderer'

const sortData = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Best Rating' },
  { value: 'newest', label: 'Newest' },
  { value: 'low', label: 'Price: Low to High' },
  { value: 'high', label: 'Price: High to Low' },
]
const filterData = [
  {
    label: 'Surface',
    slug: 'surface',
    icon: IconSquaresFilled,
    links: [
      { label: 'Matt', slug: 'matt' },
      { label: 'Satin', slug: 'satin' },
      { label: 'Gloss', slug: 'gloss' },
      { label: 'Polished', slug: 'polished' },
      { label: 'Rough', slug: 'rough' },
      { label: 'Honed', slug: 'honed' },
      { label: 'Lappato', slug: 'lappato' },
      { label: 'Structured Surface', slug: 'structuredSurface' },
    ],
  },
  {
    label: 'Type',
    slug: 'type',
    icon: IconCategory,
    links: [
      { label: 'Wall Tiles', slug: 'wall' },
      { label: 'Floor Tiles', slug: 'floor' },
      { label: 'Outdoor Tiles', slug: 'outdoor' },
    ],
  },
  {
    label: 'Size',
    slug: 'size',
    icon: IconRuler,
    links: [
      { label: '300x300', slug: 'mm-300x300' },
      { label: '600x600', slug: 'mm-600x600' },
    ],
  },
]

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

  return { categories: prunedCategories }
}

export default function ProductsRoute() {
  const [value, setValue] = useState(null)
  const specificationFilters = filterData.map((item) => (
    <FiltersGroup {...item} key={item.label} />
  ))

  const { category } = useParams()
  const [active, setActive] = useState(category)
  useEffect(() => {
    setActive(category)
  }, [category])

  const { categories } = useLoaderData()
  const categoryFilters = categories.map((category, index) => {
    const CategoryIcon = renderCategoryIcon(category)
    // TODO: preserve the search params when clicking on the category, except the page
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
          to={
            active === category.slug
              ? '/products/all'
              : `/products/${category.slug}`
          }
        />
      </div>
    )
  })

  return (
    <div>
      <h1>Products</h1>
      <Grid>
        <Grid.Col span={3}>
          <Select
            value={value}
            onChange={setValue}
            label="Sort by:"
            placeholder="Pick one"
            size="xs"
            rightSection={value ? null : <IconChevronDown size="1rem" />}
            data={sortData}
            clearable
          />
          <Divider my="md" />
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
