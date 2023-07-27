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
import { getCategories } from '../api/category'
import { renderCategoryIcon } from '../utils/renderer'

const sortData = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Best Rating' },
  { value: 'newest', label: 'Newest' },
  { value: 'low', label: 'Price: Low to High' },
  { value: 'high', label: 'Price: High to Low' },
]
const linkData1 = [
  {
    label: 'Surface',
    icon: IconSquaresFilled,
    initiallyOpened: true,
    links: [
      { label: 'Matt', link: '/' },
      { label: 'Satin', link: '/' },
      { label: 'Gloss', link: '/' },
      { label: 'Polished', link: '/' },
      { label: 'Rough', link: '/' },
      { label: 'Honed', link: '/' },
      { label: 'Lappato', link: '/' },
      { label: 'Structured Surface', link: '/' },
    ],
  },
  {
    label: 'Category',
    icon: IconCategory,
    initiallyOpened: true,
    links: [
      { label: 'Wall Tiles', link: '/' },
      { label: 'Floor Tiles', link: '/' },
      { label: 'Outdoor Tiles', link: '/' },
    ],
  },
  {
    label: 'Size',
    icon: IconRuler,
    initiallyOpened: true,
    links: [
      { label: '300x300', link: '/' },
      { label: '600x600', link: '/' },
    ],
  },
]

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
  const links1 = linkData1.map((item) => (
    <FiltersGroup {...item} key={item.label} />
  ))

  const { category } = useParams()
  const [active, setActive] = useState(category)
  useEffect(() => {
    setActive(category)
  }, [category])

  const { categories } = useLoaderData()
  const categoryLinks = categories.map((category, index) => {
    const CategoryIcon = renderCategoryIcon(category)

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
              ? '/products'
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
          {categoryLinks}
          <Divider my="md" />
          {links1}
        </Grid.Col>
        <Grid.Col span="auto">
          <Outlet />
        </Grid.Col>
      </Grid>
    </div>
  )
}
