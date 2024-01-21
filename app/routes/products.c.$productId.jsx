import {
  Accordion,
  Anchor,
  Box,
  Breadcrumbs,
  Card,
  Center,
  Divider,
  Grid,
  Image,
  List,
  MediaQuery,
  Text,
  Title,
  createStyles,
} from '@mantine/core'
import { Link, useLoaderData, useParams } from '@remix-run/react'
import { json } from '@remix-run/node'
import { _ } from 'lodash'
import {
  getProduct,
  getRelatedProducts,
  incrementProductViewCount,
} from '../models/product.server'
import { getStrapiMedia, getStrapiMedias } from '../utils/api/helper'
import AddToCartBtn from '../components/AddToCartBtn'
import { formatSize } from '../utils/formatter'
import { IconChevronRight } from '@tabler/icons-react'
import RelatedProducts from '../components/product/RelatedProducts'
import ProductImageCarousel from '../components/product/ProductImageCarousel'
import AcfirstCarousel from '../components/common/AcfirstCarousel'
import { Carousel } from '@mantine/carousel'
import AcfirstSkeleton from '../components/common/AcfirstSkeleton'

const useStyle = createStyles((theme) => ({
  accordionTitle: {
    fontWeight: 500,
    color: theme.colors[theme.primaryColor][7],
  },

  breadcrumb: {
    opacity: 0.5,
    transition: 'opacity color 150ms ease',

    '&:hover': {
      textDecoration: 'none',
      color: theme.colors[theme.primaryColor][7],
      opacity: 1,
    },
  },

  card: {
    transition: 'transform 250ms ease',

    '&:hover': {
      transform: 'scale(1.05)',
    },
  },

  carouselViewport: {
    padding: theme.spacing.md,
  },
}))

export async function loader({ params }) {
  const { productId } = params

  const product = await getProduct(productId)

  if (!product) {
    throw new Response('Product not found', { status: 404 })
  }

  const {
    name,
    code,
    size,
    surface,
    type,
    viewCount,
    productImg,
    category,
    coverImg,
    similarProducts,
  } = product.attributes
  const categoryName = category.data?.attributes.name || ''
  const categorySlug = category.data?.attributes.slug || ''
  const prunedSimilarProducts = similarProducts.data.map((similarProduct) => {
    const { code, coverImg } = similarProduct.attributes

    return {
      code,
      imgUrl: getStrapiMedia(coverImg.data),
    }
  })

  await incrementProductViewCount(product.id, viewCount)

  const relatedProducts = await getRelatedProducts(
    code,
    categorySlug,
    type,
    surface,
    size
  )
  const prunedRelatedProducts = relatedProducts.map((relatedProduct) => {
    const { name, code, category, viewCount, coverImg } =
      relatedProduct.attributes

    return {
      name,
      code,
      category: category.data?.attributes.name || '',
      viewCount,
      imgUrl: getStrapiMedia(coverImg.data),
    }
  })

  return json({
    currentProduct: {
      name,
      code,
      size,
      surface,
      type,
      viewCount,
      similarProducts: prunedSimilarProducts,
      productImages: getStrapiMedias(productImg.data),
      category: {
        name: categoryName,
        slug: categorySlug,
      },
      coverImg: getStrapiMedia(coverImg.data),
    },
    relatedProducts: prunedRelatedProducts,
  })
}

function Slide({ imgUrl, code }) {
  const { classes } = useStyle()

  return (
    <Carousel.Slide>
      <Card
        className={classes.card}
        shadow="xs"
        withBorder
        p={0}
        component={Link}
        to={`/products/c/${code}`}
      >
        <AcfirstSkeleton>
          {(handleOnLoad, imageRef) => (
            <Image
              src={imgUrl}
              radius="xs"
              imageRef={imageRef}
              onLoad={handleOnLoad}
            />
          )}
        </AcfirstSkeleton>
        <Center>
          <Text weight={500} size="sm">
            {code}
          </Text>
        </Center>
      </Card>
    </Carousel.Slide>
  )
}

function AcfirstBreadcrumb({ category, ...props }) {
  const { classes } = useStyle()
  const params = useParams()
  const breadcrumbsData = [
    { title: 'Products', href: '/products' },
    { title: category.name, href: '/products/' + category.slug },
    { title: params.productId, href: '/products/c/' + params.productId },
  ]
  const breadcrumbs = breadcrumbsData.map((item, index) => (
    <Text
      className={classes.breadcrumb}
      weight={600}
      key={index}
      component={Anchor}
      href={item.href}
    >
      {item.title}
    </Text>
  ))

  return (
    <Breadcrumbs
      separator={<IconChevronRight size="1.5rem" stroke={2} />}
      mb="sm"
      {...props}
    >
      {breadcrumbs}
    </Breadcrumbs>
  )
}

export default function ProductRoute() {
  const { classes } = useStyle()
  const params = useParams()
  const { currentProduct, relatedProducts } = useLoaderData()
  const {
    name,
    code,
    size,
    surface,
    type,
    similarProducts,
    productImages,
    category,
  } = currentProduct

  const otherProducts = similarProducts.map((similarProduct, index) => {
    const { code, imgUrl } = similarProduct

    return <Slide key={index} imgUrl={imgUrl} code={code} />
  })

  const specificationsData = [
    { title: 'Category', value: _.startCase(category.name) },
    { title: 'Surface', value: _.startCase(surface) },
    { title: 'Type', value: _.startCase(type) },
    { title: 'Size', value: formatSize(size) },
  ]
  const specifications = specificationsData.map((item) => (
    <List.Item key={item.title}>
      <Text c="dark.4">
        <Text span fw={600} mr={8}>
          {item.title}:
        </Text>
        {item.value}
      </Text>
    </List.Item>
  ))

  return (
    <Box mt={40}>
      <MediaQuery largerThan="xs" styles={{ display: 'none' }}>
        <AcfirstBreadcrumb category={category} />
      </MediaQuery>
      <Grid gutter="xl">
        <Grid.Col xs={6}>
          <ProductImageCarousel productImages={productImages} />
        </Grid.Col>

        <Grid.Col xs={6}>
          <MediaQuery smallerThan="xs" styles={{ display: 'none' }}>
            <AcfirstBreadcrumb category={category} />
          </MediaQuery>
          <Title order={1}>{name}</Title>

          <Text mt="sm" className={classes.accordionTitle}>
            Specifications
          </Text>
          <List mt="xs" mb="md" withPadding>
            {specifications}
          </List>

          <AddToCartBtn productId={params.productId} />
          <Divider my="md" />
          {otherProducts.length ? (
            <>
              <Text className={classes.accordionTitle}>
                Other Styles & Colors
              </Text>
              <AcfirstCarousel
                slideSize="25%"
                slideGap="md"
                align="start"
                skipSnaps={true}
                containScroll="keepSnaps"
                classNames={{
                  viewport: classes.carouselViewport,
                }}
                breakpoints={[
                  { maxWidth: 'sm', slideSize: '33.333333%' },
                  { maxWidth: 'xs', slideSize: '25%' },
                ]}
              >
                {otherProducts}
              </AcfirstCarousel>
            </>
          ) : null}

          <Accordion variant="separated" mt="md">
            <Accordion.Item value="additional info">
              <Accordion.Control>
                <Text className={classes.accordionTitle}>
                  Additional Information
                </Text>
              </Accordion.Control>
              <Accordion.Panel>
                <Text>
                  You can't order through our website yet. The cart items will
                  only serve as reference when you enquired with us.
                </Text>
                <br />
                <Text fs="italic">
                  <Text span color="red">
                    *
                  </Text>{' '}
                  All photos are for illustration purposes only.
                </Text>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </Grid.Col>
      </Grid>

      <RelatedProducts products={relatedProducts} />
    </Box>
  )
}
