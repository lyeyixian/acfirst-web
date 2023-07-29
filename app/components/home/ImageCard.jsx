import { IconEye } from '@tabler/icons-react'
import {
  Card,
  Text,
  Group,
  Center,
  createStyles,
  getStylesRef,
  rem,
} from '@mantine/core'
import { Link } from '@remix-run/react'

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

  title: {
    color: theme.white,
    marginBottom: rem(5),
  },

  bodyText: {
    color: theme.colors.dark[0],
    marginLeft: rem(7),
  },

  author: {
    color: theme.colors.dark[2],
  },

  link: {
    textDecoration: 'none',
  },
}))

// interface ImageCardProps {
//   link: string;
//   image: string;
//   title: string;
//   author: string;
//   views: number;
//   comments: number;
// }

export function ImageCard({ imgUrl, name, code, category, viewCount }) {
  // TODO: display category
  const { classes, theme } = useStyles()

  return (
    <Link to={`/products/${code}`} className={classes.link}>
      <Card p="lg" shadow="lg" className={classes.card} radius="md">
        <div
          className={classes.image}
          style={{ backgroundImage: `url(${imgUrl})` }} // TODO: use AspectRatio component
        />
        <div className={classes.overlay} />

        <div className={classes.content}>
          <div>
            <Text size="lg" className={classes.title} weight={500}>
              {name}
            </Text>

            <Group spacing="lg">
              <Center>
                <IconEye
                  size="1rem"
                  stroke={1.5}
                  color={theme.colors.dark[2]}
                />
                <Text size="sm" className={classes.bodyText}>
                  {viewCount}
                </Text>
              </Center>
            </Group>
          </div>
        </div>
      </Card>
    </Link>
  )
}
