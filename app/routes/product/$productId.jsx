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
import { useLoaderData, useParams } from '@remix-run/react'
import { json } from '@remix-run/node'
import {
  getProduct,
  incrementProductViewCount,
} from '../../models/product.server'
import { getStrapiMedia, getStrapiMedias } from '../../utils/apiHelper'
import { Carousel } from '@mantine/carousel'
import AddToCartBtn from '../../components/AddToCartBtn'
import React, { useEffect, useState } from 'react'

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

  return json({
    name,
    code,
    size,
    surface,
    type,
    description,
    viewCount,
    similarCode,
    productImages: getStrapiMedias(productImg.data),
    category: category.data.attributes.name,
    coverImg: getStrapiMedia(coverImg.data),
  })
}

function formatSize(size) {
  const format = size.split("-")
  const units = format[0]
  const length = format[1].split("x")[0]
  const breadth = format[1].split("x")[1]
  return (length + units + " x " + breadth + units)
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
    productImages,
    category,
  } = useLoaderData()
  const [imageShown, setImageShown] = useState(0)
  const [embla, setEmbla] = useState(null)
  const [emblaForSubCarousel, setEmblaForSubCarousel] = useState(null)

  const breadcrumbs = [
    { title: 'Home', href: '/' },
    { title: 'Products', href: '/products' },
    { title: params.productId, href: '/product/' + params.productId },
  ].map((item, index) => (
      <Anchor href={item.href} key={index}>
        {item.title}
      </Anchor>
  ));

  console.log(similarCode.data);

  const similarCodeLayout = similarCode.data.map((item, index) => (
    <Grid.Col span={2}>
      <Anchor href={"/product/" + item.attributes.code} key={index} size="xs">
      <HoverCard
        offset={-60}
        keepMounted
        >
        <HoverCard.Target>
          <AspectRatio ratio={1}>
            <Image src={getStrapiMedia(item.attributes.coverImg.data)} radius="sm"/>
          </AspectRatio>
        </HoverCard.Target>
      </HoverCard>
    </Anchor>

    </Grid.Col>
  ))

  
  useEffect(() => {
    if (embla && emblaForSubCarousel) {
      embla.scrollTo(imageShown)
      emblaForSubCarousel.scrollTo(imageShown)
    }
  }, [embla, emblaForSubCarousel, imageShown])

  const slides = productImages.map((image, index) => (
    <Carousel.Slide key={index}>
      <Image src={image} fit="contain" />
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
          <Grid>
            {similarCodeLayout}
          </Grid>
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
    </div>
  )
}
