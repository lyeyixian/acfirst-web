import { Carousel } from '@mantine/carousel'
import { useMediaQuery } from '@mantine/hooks'
import {
  createStyles,
  Paper,
  Text,
  Title,
  Button,
  useMantineTheme,
  rem,
} from '@mantine/core'
import { ImageCard } from './ImageCard'

const useStyles = createStyles((theme) => ({
  card: {
    height: rem(325),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontWeight: 900,
    color: theme.white,
    lineHeight: 1.2,
    fontSize: rem(32),
    marginTop: theme.spacing.xs,
  },

  category: {
    color: theme.white,
    opacity: 0.7,
    fontWeight: 700,
    textTransform: 'uppercase',
  },
}))

// interface CardProps {
//   image: string;
//   title: string;
//   category: string;
// }

function Card({ image, title, category }) {
  const { classes } = useStyles()

  return (
    <Paper
      shadow="md"
      p="xl"
      radius="md"
      sx={{ backgroundImage: `url(${image})` }}
      className={classes.card}
    >
      <div>
        <Text className={classes.category} size="xs">
          {category}
        </Text>
        <Title order={3} className={classes.title}>
          {title}
        </Title>
      </div>
      <Button variant="white" color="dark">
        Read article
      </Button>
    </Paper>
  )
}

export default function CardsCarousel({ products }) {
  const theme = useMantineTheme()
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`)
  const slides = products.map((product, index) => (
    <Carousel.Slide key={index}>
      <ImageCard {...product} />
    </Carousel.Slide>
  ))

  return (
    <Carousel
      slideSize="33.333333%"
      breakpoints={[{ maxWidth: 'sm', slideSize: '50%', slideGap: 'lg' }]}
      slideGap="lg"
      align="start"
      slidesToScroll={mobile ? 2 : 3}
      loop
    >
      {slides}
    </Carousel>
  )
}
