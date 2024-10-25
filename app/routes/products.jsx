import {
  Button,
  Divider,
  Drawer,
  Grid,
  Group,
  MultiSelect,
  NavLink,
  Text,
  ThemeIcon,
  createStyles,
} from '@mantine/core'
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
import { useDisclosure } from '@mantine/hooks'
import { IconPlus } from '@tabler/icons-react'
import { useDebounceSearchParams } from '../components/hooks/helper'
import { getProductCodes } from '../models/product.server'
import { useProductCodeSearcher } from '../components/hooks/productCodeSearcher'

const useStyles = createStyles((theme) => ({
  sidebar: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  filterBurger: {
    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  link: {
    fontWeight: 500,
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[0]
        : theme.colors.gray[7],

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[7]
          : theme.colors.gray[0],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    },
  },
}))

export async function loader({ params }) {
  const categories = await getCategories()
  const prunedCategories = categories.map((category) => {
    const { name, slug } = category.attributes
    return {
      name,
      slug,
    }
  })
  const productSchema = await getProductSchema()
  const filterData = ['type', 'surface', 'size'].map((key) => {
    const filterEnum = productSchema?.[key]?.enum || []

    return {
      label: _.startCase(key),
      slug: key,
      filters: filterEnum.map((item) => {
        return {
          label: key == 'size' ? formatSize(item) : _.startCase(item),
          slug: item,
        }
      }),
    }
  })
  const { category } = params
  const productCodes = await getProductCodes(category)
  const transformedCodes = productCodes.map((productCode) => {
    const { code } = productCode.attributes
    return {
      value: code,
      label: code,
    }
  })

  return { categories: prunedCategories, filterData, codes: transformedCodes }
}

export const shouldRevalidate = ({ currentParams, nextParams }) => {
  if (currentParams.category !== nextParams.category) {
    return true
  }

  return false
}

export default function ProductsRoute() {
  const { classes } = useStyles()
  const [opened, { toggle, close }] = useDisclosure(false)

  const { category } = useParams()
  const [active, setActive] = useState(category)
  useEffect(() => {
    setActive(category)
  }, [category])

  const { categories, filterData, codes } = useLoaderData()

  const [search, setSearch] = useDebounceSearchParams(500)
  const handleFiltersChange = (obj) => {
    delete obj['codes']
    setSelectedCodes([])
    setSearch(obj)
  }
  const specificationFilters = filterData.map((item) => (
    <FiltersGroup
      {...item}
      icon={renderFilterIcon(item.slug)}
      key={item.label}
      onClick={close}
      search={search}
      setSearch={handleFiltersChange}
    />
  ))

  const { selectedCodes, setSelectedCodes } = useProductCodeSearcher()
  const handleSelectedCodesChange = (codes) => {
    setSelectedCodes(codes)
    setSearch({ codes })
  }

  const [searchParams] = useSearchParams()
  const categoryFilters = categories.map((category, index) => {
    const CategoryIcon = renderCategoryIcon(category)
    const preserveSearchParams = (str) => {
      const searchParamsEntries = [...searchParams.entries()]
      const newSearchParams = new URLSearchParams(
        Object.fromEntries(
          searchParamsEntries.filter(([key]) => key !== 'p' && key !== 'codes')
        )
      )

      return str + `?${newSearchParams.toString()}`
    }
    return (
      <div key={index}>
        {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
        <NavLink
          className={classes.link}
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
          onClick={close}
        />
      </div>
    )
  })

  return (
    <div>
      <h1>Products</h1>
      <Button
        className={classes.filterBurger}
        variant="subtle"
        onClick={toggle}
        color="gray"
      >
        <Group align="center" spacing="0.5rem">
          <Text fw={500}>Filters</Text>
          <IconPlus size="1.2rem" />
        </Group>
      </Button>
      <Grid>
        <Grid.Col className={classes.sidebar} span={3}>
          {categoryFilters}
          <MultiSelect
            searchable
            label="Search for product code"
            data={codes}
            value={selectedCodes}
            onChange={handleSelectedCodesChange}
            limit={5}
          />
          <Divider my="md" />
          {specificationFilters}
        </Grid.Col>
        <Grid.Col span="auto">
          <Outlet />
        </Grid.Col>
      </Grid>
      <Drawer opened={opened} onClose={toggle} title="Filters">
        {categoryFilters}
        <Divider my="md" />
        {specificationFilters}
      </Drawer>
    </div>
  )
}
