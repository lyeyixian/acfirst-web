import {
  Accordion,
  Button,
  Grid,
  Image,
  List,
  Text,
  Title,
  createStyles,
  getStylesRef,
  rem,
} from '@mantine/core'
import { useLoaderData, useParams } from '@remix-run/react'
import { json } from '@remix-run/node'
import { getProductByCode } from '../../api/products'
import { getStrapiMedia, getStrapiMedias } from '../../utils/apiHelper'
import { Carousel } from '@mantine/carousel'

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
  const product = await getProductByCode(productId)
  const {
    name,
    code,
    size,
    surface,
    type,
    specification,
    viewCount,
    productImg,
    category,
    coverImg,
  } = product.attributes

  return json({
    name,
    code,
    size,
    surface,
    type,
    specification,
    viewCount,
    productImages: getStrapiMedias(productImg.data),
    category: category.data.attributes.name,
    coverImg: getStrapiMedia(coverImg.data),
  })
}

export default function ProductRoute() {
  // TODO: add functionality to add to cart button
  const { classes } = useStyle()
  const params = useParams()
  const {
    name,
    code,
    size,
    surface,
    type,
    specification, // TODO: change key to description
    viewCount, // TODO: figure out what to do with viewCount
    productImages,
    category,
    coverImg,
  } = useLoaderData()
  const slides = productImages.map((image) => (
    <Carousel.Slide key={image}>
      <Image src={image} fit="contain" />
    </Carousel.Slide>
  ))

  return (
    <div>
      <h1>Product {params.productId}</h1>
      <Grid>
        <Grid.Col span={6}>
          <Carousel
            withIndicators
            loop
            classNames={{
              root: classes.carousel,
              controls: classes.carouselControls,
              indicator: classes.carouselIndicator,
            }}
          >
            {slides}
          </Carousel>
        </Grid.Col>
        <Grid.Col span={6}>
          <Title order={2}>{name}</Title>
          <Text mt="md">{specification}</Text>
          <Button my="md">Add to Cart</Button>
          <Accordion
            variant="separated"
            multiple
            defaultValue={['specifications']}
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
                        Code:
                      </Text>{' '}
                      {code}
                    </Text>
                  </List.Item>
                  <List.Item>
                    <Text c="dark.4">
                      <Text span fw={600}>
                        Place:
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
                        Category:
                      </Text>{' '}
                      {type}
                    </Text>
                  </List.Item>
                  <List.Item>
                    <Text c="dark.4">
                      <Text span fw={600}>
                        Size:
                      </Text>{' '}
                      {size}
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
    </div>
  )
}
