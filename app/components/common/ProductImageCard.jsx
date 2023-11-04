import {
  createStyles,
  Text,
  getStylesRef,
  Card,
  Group,
  Center,
} from '@mantine/core'
import { Link } from '@remix-run/react'
import { IconEye } from '@tabler/icons-react'

const useStyles = createStyles((theme) => ({
  card: {
    position: 'relative',
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
      'linear-gradient(180deg, rgba(0, 0, 0, 0) 45%, rgba(0, 0, 0, .50) 90%)',
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

export default function ProductImageCard({ product, height }) {
  const { classes, theme } = useStyles()
  const { imgUrl, name, code, category, viewCount } = product

  return (
    <Card
      p="lg"
      shadow="lg"
      h={height}
      className={classes.card}
      radius="md"
      component={Link}
      to={`/product/${code}`}
    >
      <div
        className={classes.image}
        style={{ backgroundImage: `url(${imgUrl})` }}
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
            <Group>
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
