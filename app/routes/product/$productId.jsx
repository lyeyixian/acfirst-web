import React, { useEffect, useState } from 'react'
import {
  Accordion,
  Anchor,
  AspectRatio,
  Breadcrumbs,
  Container,
  Grid,
  HoverCard,
  Image,
  List,
  Text,
  Title,
  createStyles,
  getStylesRef,
  rem,
} from '@mantine/core'
import { Carousel } from '@mantine/carousel'
import { useLoaderData, useParams } from '@remix-run/react'
import { json } from '@remix-run/node'
import {
  getProduct,
  getProducts,
  incrementProductViewCount,
} from '../../models/product.server'
import { getStrapiMedia, getStrapiMedias } from '../../utils/api/helper'
import AddToCartBtn from '../../components/AddToCartBtn'
import { formatSize } from '../../utils/formatter'

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
    similarCode,
  } = product.attributes

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

  const similarCodeImages = similarCode.data.map((item) =>
    getStrapiMedia(item.attributes.coverImg.data)
  )
  const relatedProductsImages = relatedProducts
    .filter((item) => item.attributes.code !== code)
    .map((item) => getStrapiMedia(item.attributes.coverImg.data))

  return json({
    name,
    code,
    size,
    surface,
    type,
    description,
    viewCount,
    similarCode,
    similarCodeImages,
    productImages: getStrapiMedias(productImg.data),
    category: category.data.attributes.name,
    coverImg: getStrapiMedia(coverImg.data),
    relatedProducts,
    relatedProductsImages,
  })
}

export default function ProductRoute() {
  // TODO: refactor carousel with the carousel in ProjectsGrid
  const { classes } = useStyle()
  const params = useParams()
  const {
    name,
    code,
    size,
    surface,
    type,
    description,
    similarCode,
    similarCodeImages,
    productImages,
    category,
    relatedProducts,
    relatedProductsImages,
  } = useLoaderData()

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

  const breadcrumbs = [
    { title: 'Home', href: '/' },
    { title: 'Products', href: '/products' },
    { title: params.productId, href: '/product/' + params.productId },
  ].map((item, index) => (
    <Anchor href={item.href} key={index}>
      {item.title}
    </Anchor>
  ))

  const similarCodeLayout = similarCode.data.map((item, index) => (
    <Grid.Col span={2} key={index}>
      <Anchor href={'/product/' + item.attributes.code} key={index} size="xs">
        <HoverCard
          offset={-60}
          keepMounted
          styles={{
            dropdown: { background: 'rgba(255,255,255,0.5)', border: 0 },
          }}
        >
          <HoverCard.Target>
            <AspectRatio ratio={1}>
              <Image src={similarCodeImages[index]} radius="sm" />
            </AspectRatio>
          </HoverCard.Target>
          <HoverCard.Dropdown mt="xs">
            <Text>{item.attributes.code}</Text>
          </HoverCard.Dropdown>
        </HoverCard>
      </Anchor>
    </Grid.Col>
  ))

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
    <div>
      <Container my="xs">
        <Breadcrumbs>{breadcrumbs}</Breadcrumbs>
      </Container>
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
          <Title order={2}>{name}</Title>
          <AddToCartBtn productId={params.productId} />
          <Grid>{similarCodeLayout}</Grid>
          <Accordion
            variant="separated"
            multiple
            defaultValue={['specifications']}
            mt="xs"
          >
            <Accordion.Item value="specifications">
              <Accordion.Control>
                <Text className={classes.accordionTitle}>Specifications</Text>
              </Accordion.Control>
              <Accordion.Panel>
                <List withPadding size="sm">
                  <List.Item>
                    <Text c="dark.4">
                      <Text span fw={600}>
                        Category:
                      </Text>{' '}
                      {category}
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
      <Container my="md">
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
      </Container>
    </div>
  )
}
