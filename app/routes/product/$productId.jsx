import React, { useEffect, useState } from 'react'
import {
  Accordion,
  Anchor,
  AspectRatio,
  Box,
  Breadcrumbs,
  Card,
  Center,
  Container,
  Grid,
  HoverCard,
  Image,
  List,
  SimpleGrid,
  Text,
  Title,
  createStyles,
  getStylesRef,
  rem,
} from '@mantine/core'
import { Carousel } from '@mantine/carousel'
import { Link, useLoaderData, useParams } from '@remix-run/react'
import { json } from '@remix-run/node'
import {
  getProduct,
  getProducts,
  incrementProductViewCount,
} from '../../models/product.server'
import { getStrapiMedia, getStrapiMedias } from '../../utils/api/helper'
import AddToCartBtn from '../../components/AddToCartBtn'
import { formatSize } from '../../utils/formatter'
import { IconChevronRight } from '@tabler/icons-react'

const useStyle = createStyles((theme) => ({
  carousel: {
    '&:hover': {
      [`& .${getStylesRef('carouselControls')}`]: {
        opacity: 1,
      },
    },
  },

  carouselControls: {
    ref: getStylesRef('carouselControls'),
    transition: 'opacity 150ms ease',
    opacity: 0,
  },

  carouselIndicator: {
    width: rem(4),
    height: rem(4),
    transition: 'width 250ms ease',

    '&[data-active]': {
      width: rem(16),
    },
  },

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

  const relatedProductsByFourFields = await getProducts(
    1,
    category.data.attributes.slug,
    { type, surface, size }
  )
  const relatedProductsByTypeSurface = await getProducts(
    1,
    category.data.attributes.slug,
    { type, surface }
  )
  const relatedProductsBySurfaceSize = await getProducts(
    1,
    category.data.attributes.slug,
    { surface, size }
  )
  const relatedProductsByTypeSize = await getProducts(
    1,
    category.data.attributes.slug,
    { type, size }
  )
  let relatedProducts = [
    ...relatedProductsByFourFields.data,
    ...relatedProductsBySurfaceSize.data,
    ...relatedProductsByTypeSize.data,
    ...relatedProductsByTypeSurface.data,
  ]
  relatedProducts = Array.from(
    new Map(relatedProducts.map((obj) => [obj['id'], obj])).values()
  )

  const relatedProductsImages = relatedProducts
    .filter((item) => item.attributes.code !== code)
    .map((item) => getStrapiMedia(item.attributes.coverImg.data))

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
    relatedProducts, // TODO: combine into relatedProducts
    relatedProductsImages,
  })
}

export default function ProductRoute() {
  // TODO: refactor carousel with the carousel in ProjectsGrid
  const { classes, theme } = useStyle()
  const params = useParams()
  const { currentProduct, relatedProducts, relatedProductsImages } =
    useLoaderData()
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

  const relatedProductsCarousel = relatedProducts
    .filter((item) => item.attributes.code !== code)
    .map((item, index) => (
      <Carousel.Slide key={index}>
        <Anchor href={'/product/' + item.attributes.code} key={index}>
          <HoverCard offset={-60} keepMounted>
            <HoverCard.Target>
              <AspectRatio ratio={1}>
                <Image h={10} src={relatedProductsImages[index]} radius="sm" />
              </AspectRatio>
            </HoverCard.Target>
            <HoverCard.Dropdown mt="xs">
              <Text>{item.attributes.code}</Text>
            </HoverCard.Dropdown>
          </HoverCard>
        </Anchor>
      </Carousel.Slide>
    ))
  return (
    <Box mt={40}>
      <Grid>
        <Grid.Col span={6}>
          <Container>
            <Carousel
              onSlideChange={(index) => setImageShown(index)}
              withIndicators
              loop
              classNames={{
                root: classes.carousel,
                controls: classes.carouselControls,
                indicator: classes.carouselIndicator,
              }}
              getEmblaApi={setEmbla}
              slideGap="sm"
            >
              {slides}
            </Carousel>
            <Carousel
              mt="xs"
              onSlideChange={(index) => setImageShown(index)}
              loop
              withControls={false}
              slideSize="25%"
              slideGap="md"
              align="start"
              slidesToScroll={productImages.length >= 4 ? 1 : 4}
              classNames={{
                root: classes.carousel,
                controls: classes.carouselControls,
                indicator: classes.carouselIndicator,
              }}
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
            </Carousel>
          </Container>
        </Grid.Col>

        <Grid.Col span={6}>
          <Breadcrumbs
            separator={
              <IconChevronRight
                // color={theme.colors[theme.primaryColor][6]}
                size="1.5rem"
                stroke={2}
              />
            }
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
      {/* <Container my="md"> */}
      <Title order={3}>Related Products</Title>
      <Carousel
        mt="xs"
        loop
        withIndicators
        slideSize="20%"
        slideGap="md"
        align="start"
        classNames={{
          root: classes.carousel,
          controls: classes.carouselControls,
          indicator: classes.carouselIndicator,
        }}
      >
        {relatedProductsCarousel}
      </Carousel>
      {/* </Container> */}
    </Box>
  )
}
