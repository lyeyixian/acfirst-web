import { Divider, Grid, Select } from '@mantine/core'
import { Outlet } from '@remix-run/react'
import { useState } from 'react'
import FiltersGroup from '../components/FiltersGroup'
import {
  IconCategory,
  IconChevronDown,
  IconRuler,
  IconSquaresFilled,
} from '@tabler/icons-react'

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
const linkData2 = [
  { label: 'Kitchen' },
  { label: 'Bathroom' },
  { label: 'Living Room' },
  { label: 'Car Poch' },
]

export default function ProductsRoute() {
  const [value, setValue] = useState(null)
  const links1 = linkData1.map((item) => (
    <FiltersGroup {...item} key={item.label} />
  ))
  const links2 = linkData2.map((item) => (
    <FiltersGroup {...item} key={item.label} />
  ))

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
          {links2}
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
