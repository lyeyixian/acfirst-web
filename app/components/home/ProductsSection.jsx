import {
  createStyles,
  Text,
  SimpleGrid,
  rem,
  Paper,
  Stack,
} from '@mantine/core'
import { Link } from '@remix-run/react'
import SectionContainer from './SectionContainer'

const useStyles = createStyles((theme) => ({
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
  const features = categories.map((category, index) => (
    <ProductCardImage key={index} {...category} />
  ))

  return (
    <SectionContainer title={title} subtitle={subtitle}>
      <SimpleGrid
        cols={4}
        spacing="xl"
        breakpoints={[{ maxWidth: 'sm', cols: 2, spacing: 'md' }]}
      >
        {features}
      </SimpleGrid>
    </SectionContainer>
  )
}
