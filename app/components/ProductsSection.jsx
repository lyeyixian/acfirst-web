import { createStyles, Title, Text, SimpleGrid, rem } from '@mantine/core'
import ProductCardImage from './ProductCardImage'

const mockdata = [
  {
    image: 'kitchen.svg',
    category: 'Kitchen',
    link: '/products/kitchen',
  },
  {
    image: 'bathroom.svg',
    category: 'Bathroom',
    link: '/products/bathroom',
  },
  {
    image: 'living-room.svg',
    category: 'Living Room',
    link: '/products/living',
  },
  {
    image: 'car-poch.svg',
    category: 'Car Poch',
    link: '/products/car',
  },
]

const useStyles = createStyles((theme) => ({
  container: {
    marginTop: `calc(${theme.spacing.xl} * 4)`,
    marginBottom: `calc(${theme.spacing.xl} * 4)`,
  },

  title: {
    fontSize: rem(34),
    fontWeight: 900,

    [theme.fn.smallerThan('sm')]: {
      fontSize: rem(24),
    },
  },

  description: {
    maxWidth: 600,
    margin: 'auto',

    '&::after': {
      content: '""',
      display: 'block',
      backgroundColor: theme.fn.primaryColor(),
      width: rem(45),
      height: rem(2),
      marginTop: theme.spacing.sm,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
}))

export default function ProductsSection({ title, subtitle, categories }) {
  const { classes } = useStyles()
  const features = categories.map((category, index) => (
    <ProductCardImage key={index} {...category} />
  ))

  return (
    <div className={classes.container}>
      <Title order={2} className={classes.title} ta="center" mt="sm">
        {title}
      </Title>

      <Text c="dimmed" className={classes.description} ta="center" mt="md">
        {subtitle}
      </Text>

      <SimpleGrid
        cols={4}
        spacing="xl"
        mt={50}
        breakpoints={[{ maxWidth: 'sm', cols: 2 }]}
      >
        {features}
      </SimpleGrid>
    </div>
  )
}
