import {
  AspectRatio,
  Card,
  Image,
  Pagination,
  SimpleGrid,
  Text,
  Title,
  createStyles,
} from '@mantine/core'
import { useEffect, useState } from 'react'
import { getProducts } from '../../api/products'
import { json } from '@remix-run/node'
import { getStrapiMedia } from '../../utils/apiHelper'
import {
  Link,
  useLoaderData,
  useParams,
  useSearchParams,
} from '@remix-run/react'

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
  const products = await getProducts(page, category)
  const prunedProducts = products.data.map((product) => {
    const {
      name,
      code,
      size,
      surface,
      type,
      description,
      viewCount,
      category,
      coverImg,
    } = product.attributes

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

  return <SimpleGrid cols={3}>{cards}</SimpleGrid>
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
        {category === 'all' ? 'All products' : category}
      </Title>
      <ProductsGrid products={products} />
      <Pagination
        value={page}
        onChange={(value) => {
          setPage(value)
          setSearchParams({ p: value })
        }}
        total={pageCount}
        position="center"
        mt="lg"
        withEdges
      />
    </div>
  )
}
