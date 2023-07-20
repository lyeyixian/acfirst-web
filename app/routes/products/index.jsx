import {
  Button,
  Divider,
  Flex,
  Grid,
  Pagination,
  Select,
  Title,
} from '@mantine/core'
import {
  IconCategory,
  IconChevronDown,
  IconRuler,
  IconSquaresFilled,
} from '@tabler/icons-react'
import { useState } from 'react'
import FiltersGroup from '../../components/FiltersGroup'
import ProjectsGrid from '../../components/ProjectsGrid'

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

export default function ProductsIndexRoute() {
  const [value, setValue] = useState(null)
  const links1 = linkData1.map((item) => (
    <FiltersGroup {...item} key={item.label} />
  ))
  const links2 = linkData2.map((item) => (
    <FiltersGroup {...item} key={item.label} />
  ))

  return (
    <div>
      <Title order={2}>Kitchen</Title>
      <Divider my="md" />
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
          {/* <ProjectsGrid page={1} /> */}
          <Pagination
            // value={page}
            // onChange={setPage}
            total={3}
            position="center"
            withEdges
          />
        </Grid.Col>
      </Grid>
    </div>
  )
}
