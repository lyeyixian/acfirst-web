import { createStyles, Paper, Text, rem } from '@mantine/core'
import { Link } from '@remix-run/react'

const useStyles = createStyles((theme) => ({
  card: {
    height: rem(280),
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    transition: 'transform 500ms ease',

    '&:hover': {
      transform: 'scale(1.05)',
    },
  },

  category: {
    color: theme.white,
    opacity: 0.8,
    fontWeight: 700,
    textTransform: 'uppercase',
  },

  link: {
    textDecoration: 'none',
  },
}))

// interface ArticleCardImageProps {
//   image: string;
//   title: string;
//   category: string;
// }

// TODO: remove this file and put together with ProductsSection
export default function ProductCardImage({ name, slug, imgUrl }) {
  const { classes } = useStyles()
  // TODO: to url probably is wrong. change to use query params instead
  // TODO: change position of category to bottom of the card
  return (
    <Link to={`/products/${slug}`} className={classes.link}>
      <Paper
        shadow="md"
        p="xl"
        radius="md"
        className={classes.card}
        sx={{ backgroundImage: `url(${imgUrl})` }}
      >
        <Text className={classes.category} size="md">
          {name}
        </Text>
      </Paper>
    </Link>
  )
}
