import { Carousel } from '@mantine/carousel'
import {
  createStyles,
  Text,
  rem,
  getStylesRef,
  Card,
  Group,
  Center,
} from '@mantine/core'
import { Link } from '@remix-run/react'
import { IconEye } from '@tabler/icons-react'
import SectionContainer from './SectionContainer'

const useStyles = createStyles((theme) => ({
  card: {
    position: 'relative',
    height: rem(280),
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[6]
        : theme.colors.gray[0],

    [`&:hover .${getStylesRef('image')}`]: {
      transform: 'scale(1.1)',
    },
  },

  image: {
    ...theme.fn.cover(),
    ref: getStylesRef('image'),
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    transition: 'transform 500ms ease',
  },

  overlay: {
    position: 'absolute',
    top: '20%',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage:
      'linear-gradient(180deg, rgba(0, 0, 0, 0) 60%, rgba(0, 0, 0, .50) 90%)',
  },

  content: {
    height: '100%',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    zIndex: 1,
  },
}))

function ImageCard({ imgUrl, name, code, category, viewCount }) {
  const { classes, theme } = useStyles()

  return (
    <Card
      p="lg"
      shadow="lg"
      className={classes.card}
      radius="md"
      component={Link}
      to={`/products/${code}`}
    >
      <div
        className={classes.image}
        style={{ backgroundImage: `url(${imgUrl})` }} // TODO: check if need skeleton or not
      />
      <div className={classes.overlay} />

      <div className={classes.content}>
        <div>
          <Text size="lg" color={theme.white} mb={5} weight={500}>
            {name}
          </Text>

          <Group position="apart">
            <Text size="sm" color="dark.0">
              {category}
            </Text>
            <Group spacing="lg">
              <Center>
                <IconEye
                  size="1rem"
                  stroke={1.5}
                  color={theme.colors.dark[0]}
                />
                <Text size="sm" ml={7} color="dark.0">
                  {viewCount}
                </Text>
              </Center>
            </Group>
          </Group>
        </div>
      </div>
    </Card>
  )
}

function CardsCarousel({ products }) {
  const slides = products.map((product, index) => (
    <Carousel.Slide key={index}>
      <ImageCard {...product} />
    </Carousel.Slide>
  ))

  return (
    <Carousel
      slideSize="33.333333%"
      breakpoints={[
        { maxWidth: 'sm', slideSize: '50%' },
        { maxWidth: 'xs', slideSize: '100%' },
      ]}
      slideGap="lg"
      align="start"
      slidesToScroll="auto"
      loop
    >
      {slides}
    </Carousel>
  )
}

export default function ShowcaseSection({ title, subtitle, products }) {
  return (
    <SectionContainer title={title} subtitle={subtitle}>
      <CardsCarousel products={products} />
    </SectionContainer>
  )
}
