import {
  createStyles,
  Title,
  Text,
  SimpleGrid,
  rem,
  Paper,
  Stack,
} from '@mantine/core'
import { Link } from '@remix-run/react'

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

  card: {
    height: rem(250),
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    transition: 'transform 500ms ease',
    padding: theme.spacing.xl,

    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
}))

function ProductCardImage({ name, slug, imgUrl }) {
  const { classes } = useStyles()

  return (
    <Paper
      shadow="md"
      radius="md"
      className={classes.card}
      sx={{ backgroundImage: `url(${imgUrl})` }}
      component={Link}
      to={`/products/${slug}`}
    >
      <Stack justify="flex-end" h="100%">
        <Text color="white" opacity={0.8} fw={700} tt="uppercase" size="md">
          {name}
        </Text>
      </Stack>
    </Paper>
  )
}

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
        breakpoints={[{ maxWidth: 'sm', cols: 2, spacing: 'md' }]}
      >
        {features}
      </SimpleGrid>
    </div>
  )
}
