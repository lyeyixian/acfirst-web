import React, { useEffect, useState } from 'react'
import {
  Accordion,
  Anchor,
  Box,
  Breadcrumbs,
  Card,
  Center,
  Container,
  Grid,
  Image,
  List,
  SimpleGrid,
  Text,
  Title,
  createStyles,
} from '@mantine/core'
import { Carousel } from '@mantine/carousel'
import { Link, useLoaderData, useParams } from '@remix-run/react'
import { json } from '@remix-run/node'
import {
  getProduct,
  getRelatedProducts,
  incrementProductViewCount,
} from '../../models/product.server'
import { getStrapiMedia, getStrapiMedias } from '../../utils/api/helper'
import AddToCartBtn from '../../components/AddToCartBtn'
import { formatSize } from '../../utils/formatter'
import { IconChevronRight } from '@tabler/icons-react'
import AcfirstCarousel from '../../components/common/AcfirstCarousel'
import RelatedProducts from '../../components/product/RelatedProducts'

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

    ['&:hover']: {
      transform: 'scale(1.05)',
    },
  },
}))

export async function loader({ params }) {
  const { productId } = params

  const product = await getProduct(productId)
  const {
    name,
    code,
    size,
    surface,
    type,
    description,
    viewCount,
    productImg,
    category,
    coverImg,
    similarProducts,
  } = product.attributes
  const prunedSimilarProducts = similarProducts.data.map((similarProduct) => {
    const { code, coverImg } = similarProduct.attributes

    return {
      code,
      img: getStrapiMedia(coverImg.data),
    }
  })

  await incrementProductViewCount(product.id, viewCount)

  const relatedProducts = await getRelatedProducts(
    code,
    category.data.attributes.slug,
    type,
    surface,
    size
  )
  const prunedRelatedProducts = relatedProducts.data.map((relatedProduct) => {
    const { name, code, category, viewCount, coverImg } =
      relatedProduct.attributes

    return {
      name,
      code,
      category: category.data.attributes.name,
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
      description,
      viewCount,
      similarProducts: prunedSimilarProducts,
      productImages: getStrapiMedias(productImg.data),
      category: {
        name: category.data.attributes.name,
        slug: category.data.attributes.slug,
      },
      coverImg: getStrapiMedia(coverImg.data),
    },
    relatedProducts: prunedRelatedProducts,
  })
}

export default function ProductRoute() {
  // TODO: refactor carousel with the carousel in ProjectsGrid
  const { classes } = useStyle()
  const params = useParams()
  const { currentProduct, relatedProducts } = useLoaderData()
  const {
    name,
    code,
    size,
    surface,
    type,
    description,
    similarProducts,
    productImages,
    category,
  } = currentProduct

  const [imageShown, setImageShown] = useState(0)
  const [embla, setEmbla] = useState(null)
  const [emblaForSubCarousel, setEmblaForSubCarousel] = useState(null)

  useEffect(() => {
    if (embla && emblaForSubCarousel) {
      embla.scrollTo(imageShown)
      emblaForSubCarousel.scrollTo(imageShown)
    }
  }, [embla, emblaForSubCarousel, imageShown])

  const slides = productImages.map((image, index) => {
    return (
      <Carousel.Slide key={index}>
        <Image src={image} fit="contain" />
      </Carousel.Slide>
    )
  })

  const breadcrumbsData = [
    { title: 'Products', href: '/products' },
    { title: category.name, href: '/products/' + category.slug },
    { title: params.productId, href: '/product/' + params.productId },
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

  const otherProducts = similarProducts.map((similarProduct, index) => {
    const { code, img } = similarProduct

    return (
      <div key={index}>
        <Card
          className={classes.card}
          shadow="lg"
          padding={0}
          component={Link}
          to={`/product/${code}`}
        >
          <Image src={img} radius="xs" />
          <Center>
            <Text size="sm">{code}</Text>
          </Center>
        </Card>
      </div>
    )
  })

  return (
    <Box mt={40}>
      <Grid>
        <Grid.Col span={6}>
          <Container>
            <AcfirstCarousel
              onSlideChange={(index) => setImageShown(index)}
              withIndicators
              loop
              getEmblaApi={setEmbla}
              slideGap="sm"
            >
              {slides}
            </AcfirstCarousel>
            <AcfirstCarousel
              mt="xs"
              onSlideChange={(index) => setImageShown(index)}
              loop
              withControls={false}
              slideSize="25%"
              slideGap="md"
              align="start"
              slidesToScroll={productImages.length >= 4 ? 1 : 4}
              getEmblaApi={setEmblaForSubCarousel}
            >
              {productImages.map((image, index) => {
                const isCurrentImageShown = imageShown === index
                return (
                  <Carousel.Slide key={index}>
                    <Image
                      sx={(theme) => ({
                        borderStyle: isCurrentImageShown ? 'solid' : null,
                        borderColor: isCurrentImageShown
                          ? theme.colors[theme.primaryColor][6]
                          : null,
                        borderRadius: isCurrentImageShown ? theme.radius.sm : 0,
                      })}
                      src={image}
                      fit="contain"
                      onClick={() => setImageShown(index)}
                    />
                  </Carousel.Slide>
                )
              })}
            </AcfirstCarousel>
          </Container>
        </Grid.Col>

        <Grid.Col span={6}>
          <Breadcrumbs
            separator={<IconChevronRight size="1.5rem" stroke={2} />}
            mb="sm"
          >
            {breadcrumbs}
          </Breadcrumbs>
          <Title order={1}>{name}</Title>
          <AddToCartBtn productId={params.productId} />
          <Accordion
            variant="separated"
            multiple
            defaultValue={['other style & color', 'specifications']}
            mt="xs"
          >
            <Accordion.Item value="other style & color">
              <Accordion.Control>
                <Text className={classes.accordionTitle}>
                  Other Styles & Colors
                </Text>
              </Accordion.Control>
              <Accordion.Panel>
                <SimpleGrid cols={3}>{otherProducts}</SimpleGrid>
              </Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item value="specifications">
              <Accordion.Control>
                <Text className={classes.accordionTitle}>Specifications</Text>
              </Accordion.Control>
              <Accordion.Panel>
                <List withPadding>
                  <List.Item>
                    <Text c="dark.4">
                      <Text span fw={600}>
                        Category:
                      </Text>{' '}
                      {category.name}
                    </Text>
                  </List.Item>
                  <List.Item>
                    <Text c="dark.4">
                      <Text span fw={600}>
                        Surface:
                      </Text>{' '}
                      {surface}
                    </Text>
                  </List.Item>
                  <List.Item>
                    <Text c="dark.4">
                      <Text span fw={600}>
                        Type:
                      </Text>{' '}
                      {type}
                    </Text>
                  </List.Item>
                  <List.Item>
                    <Text c="dark.4">
                      <Text span fw={600}>
                        Size:
                      </Text>{' '}
                      {formatSize(size)}
                    </Text>
                  </List.Item>
                </List>
              </Accordion.Panel>
            </Accordion.Item>
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
