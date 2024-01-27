import {
  Anchor,
  AspectRatio,
  Card,
  Center,
  Group,
  Image,
  Pagination,
  SimpleGrid,
  Stack,
  Text,
  Title,
  createStyles,
} from '@mantine/core'
import { useEffect, useState } from 'react'
import { getProducts } from '../../models/product.server'
import { json } from '@remix-run/node'
import { getStrapiMedia } from '../../utils/api/helper'
import {
  Link,
  useLoaderData,
  useParams,
  useSearchParams,
} from '@remix-run/react'
import { IconEye, IconFileX } from '@tabler/icons-react'
import AcfirstSkeleton from '../../components/common/AcfirstSkeleton'

// TODO: responsive
const useStyles = createStyles((theme) => ({
  card: {
    transition: 'transform 150ms ease, box-shadow 150ms ease',

    '&:hover': {
      transform: 'scale(1.01)',
      boxShadow: theme.shadows.md,
    },
  },

  dropdown: {
    padding: 0,
    backgroundColor: 'transparent',
    border: 'none',
  },

  button: {
    '&:hover': {
      backgroundColor: theme.colors[theme.primaryColor][1],
    },
  },
}))

export async function loader({ request, params }) {
  const url = new URL(request.url)
  const page = url.searchParams.get('p') || 1
  const surface = url.searchParams.get('surface')
  const type = url.searchParams.get('type')
  const size = url.searchParams.get('size')

  const { category } = params
  const products = await getProducts(page, category, { surface, type, size })
  const prunedProducts = products.data.map((product) => {
    const { name, code, viewCount, category, coverImg } = product.attributes

    return {
      id: product.id,
      name,
      code,
      viewCount: viewCount || 0,
      category: category.data?.attributes.name || '',
      imageUrl: getStrapiMedia(coverImg.data),
    }
  })

  return json({
    products: prunedProducts,
    pageCount: products.meta.pagination.pageCount,
  })
}

function ProductCard({ product }) {
  const { classes, theme } = useStyles()

  return (
    <Card
      key={product.id}
      className={classes.card}
      radius="md"
      component={Link}
      to={`/products/c/${product.code}`}
    >
      <AcfirstSkeleton>
        {(handleOnLoad, imageRef) => (
          <AspectRatio ratio={1}>
            <Image
              src={product.imageUrl}
              radius="sm"
              imageRef={imageRef}
              onLoad={handleOnLoad}
            />
          </AspectRatio>
        )}
      </AcfirstSkeleton>
      <Text mt="xs" fw={500}>
        {product.name}
      </Text>
      <Group position="apart">
        <Text color="dimmed" size="sm">
          {product.category}
        </Text>
        <Group>
          <Center>
            <IconEye size="1rem" stroke={2} color={theme.colors.dark[1]} />
            <Text color="dimmed" size="sm" ml={4}>
              {product.viewCount}
            </Text>
          </Center>
        </Group>
      </Group>
    </Card>
  )
}

function ProductsGrid({ products }) {
  const cards = products.map((product) => (
    <ProductCard key={product.id} product={product} />
  ))

  return cards.length ? (
    <SimpleGrid
      cols={3}
      breakpoints={[
        { maxWidth: 'xs', cols: 1 },
        { maxWidth: 'sm', cols: 2 },
      ]}
    >
      {cards}
    </SimpleGrid>
  ) : (
    <Stack justify="center" align="center" mih={600} spacing="xs">
      <IconFileX size="2rem" />
      <Text size="lg" weight={500}>
        No products found
      </Text>
      <Anchor component={Link} to="/products">
        Browse other products
      </Anchor>
    </Stack>
  )
}

export default function ProductsIndexRoute() {
  const { category } = useParams()
  const { products, pageCount } = useLoaderData()
  const [searchParams, setSearchParams] = useSearchParams()
  const searchParamsPage = searchParams.get('p') || 1
  const [page, setPage] = useState(searchParamsPage)

  useEffect(() => {
    setPage(parseInt(searchParamsPage))
  }, [searchParamsPage])

  return (
    <div>
      <Title order={2} ta="center" mb="md" transform="capitalize">
        {category === 'all' ? 'All Products' : category.split('-').join(' ')}
      </Title>
      <Stack justify="space-between" mih={650}>
        <ProductsGrid products={products} />
        {products.length ? (
          <Pagination
            value={page}
            onChange={(value) => {
              setPage(value)
              setSearchParams((params) => {
                params.set('p', value)
                return params
              })
            }}
            total={pageCount}
            position="center"
            mt="lg"
          />
        ) : null}
      </Stack>
    </div>
  )
}
