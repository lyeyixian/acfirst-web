import {
  createStyles,
  Overlay,
  Container,
  Title,
  Button,
  Text,
  rem,
  Box,
} from '@mantine/core'
import { Link } from '@remix-run/react'

const useStyles = createStyles((theme) => ({
  container: {
    height: rem(700),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    paddingBottom: `calc(${theme.spacing.xl} * 6)`,
    zIndex: 1,
    position: 'relative',

    [theme.fn.smallerThan('sm')]: {
      height: rem(500),
      paddingBottom: `calc(${theme.spacing.xl} * 3)`,
    },

    [theme.fn.smallerThan('xs')]: {
      height: rem(400),
    },
  },

  title: {
    color: theme.white,
    fontSize: rem(60),
    fontWeight: 900,
    lineHeight: 1.1,

    [theme.fn.smallerThan('sm')]: {
      fontSize: rem(40),
      lineHeight: 1.2,
    },

    [theme.fn.smallerThan('xs')]: {
      fontSize: rem(28),
      lineHeight: 1.3,
    },
  },

  description: {
    color: theme.white,
    maxWidth: 600,
    marginTop: theme.spacing.xl,
    fontSize: theme.fontSizes.xl,

    [theme.fn.smallerThan('sm')]: {
      maxWidth: '100%',
      fontSize: theme.fontSizes.md,
      marginTop: theme.spacing.md,
    },

    [theme.fn.smallerThan('xs')]: {
      fontSize: theme.fontSizes.sm,
    },
  },

  control: {
    marginTop: `calc(${theme.spacing.xl} * 1.5)`,

    [theme.fn.smallerThan('xs')]: {
      width: '100%',
    },
  },
}))

export default function HeroBanner({
  title,
  description,
  buttonProps,
  imgUrl,
}) {
  const { classes } = useStyles()
  const { text, url, type, newTab } = buttonProps

  return (
    <Box
      sx={{
        position: 'relative',
        backgroundImage: `url(${imgUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Overlay
        gradient="linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, .65) 40%)"
        opacity={1}
        zIndex={0}
      />
      <Container className={classes.container}>
        <Title className={classes.title}>{title}</Title>
        <Text className={classes.description}>{description}</Text>

        <Button
          variant="gradient"
          size="xl"
          radius="xl"
          className={classes.control}
          component={Link}
          to={url}
        >
          {text}
        </Button>
      </Container>
    </Box>
  )
}
