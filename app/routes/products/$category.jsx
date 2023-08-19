import {
  AspectRatio,
  Card,
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
import { getStrapiMedia } from '../../utils/apiHelper'
import {
  Link,
  useLoaderData,
  useParams,
  useSearchParams,
} from '@remix-run/react'

// TODO: responsive
const useStyle = createStyles((theme) => ({
  card: {
    transition: 'transform 150ms ease, box-shadow 150ms ease',

    '&:hover': {
      transform: 'scale(1.01)',
      boxShadow: theme.shadows.md,
    },
  },
}))

export async function loader({ request, params }) {
  const { category } = params
  const url = new URL(request.url)
  const page = url.searchParams.get('p') || 1
  const surface = url.searchParams.get('surface')
  const type = url.searchParams.get('type')
  const size = url.searchParams.get('size')
  const products = await getProducts(page, category, { surface, type, size })
  const prunedProducts = products.data.map((product) => {
    const { name, code, viewCount, category, coverImg } = product.attributes

    return {
      id: product.id,
      name,
      code,
      viewCount,
      category: category.data.attributes.name,
      imageUrl: getStrapiMedia(coverImg.data),
    }
  })

  return json({
    products: prunedProducts,
    pageCount: products.meta.pagination.pageCount,
  })
}

// TODO: put viewCount to the bottom right of the card
function ProductsGrid({ products }) {
  const { classes } = useStyle()
  const cards = products.map((product) => (
    <Card
      key={product.id}
      className={classes.card}
      radius="md"
      withBorder
      component={Link}
      to={`/product/${product.code}`}
    >
      {/* TODO: add to cart btn on hover */}
      <AspectRatio ratio={1}>
        <Image src={product.imageUrl} />
      </AspectRatio>
      <Text mt="xs" fw={500}>
        {product.name}
      </Text>
      <Text color="dimmed" size="sm">
        {product.category}
      </Text>
    </Card>
  ))
  // TODO: show something when products is empty
  return <SimpleGrid cols={3}>{cards}</SimpleGrid>
}

// TODO: pagination bug. when on page 2 then switch filter, will stay on page 2 even if there isn't anything there
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
        {category === 'all' ? 'All products' : category}
      </Title>
      <Stack justify="space-between" mih={650}>
        <ProductsGrid products={products} />
        <Pagination
          value={page}
          onChange={(value) => {
            setPage(value)
            setSearchParams((prev) => {
              // TODO: refactor this into a hook tgt with filters group
              const params = new URLSearchParams(prev)
              params.set('p', value)
              return params
            })
          }}
          total={pageCount}
          position="center"
          mt="lg"
          withEdges
        />
      </Stack>
    </div>
  )
}
