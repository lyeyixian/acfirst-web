import {
  createStyles,
  Header,
  Container,
  Group,
  Burger,
  rem,
  ActionIcon,
  Popover,
  Text,
  Image,
  Divider,
  Box,
  Button,
  Paper,
  Indicator,
  ScrollArea,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { MantineLogo } from '@mantine/ds'
import { Link, NavLink, useFetcher, useRouteLoaderData } from '@remix-run/react'
import { IconShoppingCart, IconTrash } from '@tabler/icons-react'
import { useState } from 'react'

const HEADER_HEIGHT = rem(60)

const useStyles = createStyles((theme) => ({
  inner: {
    height: HEADER_HEIGHT,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  links: {
    [theme.fn.smallerThan('52em')]: {
      display: 'none',
    },
  },

  burger: {
    [theme.fn.largerThan('52em')]: {
      display: 'none',
    },
  },

  link: {
    display: 'block',
    lineHeight: 1,
    padding: `${rem(8)} ${rem(12)}`,
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[6]
          : theme.colors.gray[1],
    },
  },

  linkLabel: {
    marginRight: rem(5),
  },

  linkActive: {
    backgroundColor: theme.colors[theme.primaryColor][1],

    '&:hover': {
      backgroundColor: theme.colors[theme.primaryColor][2],
    },
  },
}))

const links = [
  {
    link: '/',
    label: 'Home',
  },
  {
    link: '/about',
    label: 'About',
  },
  {
    link: '/products',
    label: 'Products',
  },
  {
    link: '/projects',
    label: 'Projects',
  },
  {
    link: '/stores',
    label: 'Locate Us',
  },
  {
    link: '/contact',
    label: 'Contact Us',
  },
]

function CartItem({ product, index }) {
  const deleteCartItemBtn = useFetcher()

  return (
    <div>
      {index !== 0 && <Divider my="md" />}
      <Paper>
        <Group>
          <Image src={product.imgUrl} maw={75} radius="sm" />
          <Box
            mr="md"
            miw={100}
            sx={{
              flexGrow: 1,
            }}
          >
            <Text>{product.name}</Text>
            <Text color="dimmed">{product.category}</Text>
          </Box>
          <deleteCartItemBtn.Form method="delete" action="/cart">
            <input type="hidden" name="code" value={product.code} />
            <ActionIcon
              color="red.4"
              type="submit"
              loading={deleteCartItemBtn.state === 'submitting'}
              loaderPosition="center"
            >
              <IconTrash size="1.2rem" />
            </ActionIcon>
          </deleteCartItemBtn.Form>
        </Group>
      </Paper>
    </div>
  )
}

export default function Navbar() {
  const { classes, cx } = useStyles()
  const [opened, { toggle }] = useDisclosure(false)
  const items = links.map((link) => {
    return (
      <NavLink
        key={link.label}
        to={link.link}
        className={({ isActive }) =>
          cx(classes.link, { [classes.linkActive]: isActive })
        }
      >
        {link.label}
      </NavLink>
    )
  })

  const rootLoaderData = useRouteLoaderData('root')
  let cart = null
  let cartSize = 0
  let cartProducts = []

  if (rootLoaderData) {
    cart = rootLoaderData.cart
    cartSize = cart.attributes.cartItems.length
    cartProducts = cart.attributes.cartItems.map((product, index) => (
      <CartItem key={index} product={product} index={index} />
    ))
  }

  const [cartOpened, setCartOpened] = useState(false)

  return (
    <Header height={HEADER_HEIGHT} sx={{ borderBottom: 0 }} mb={120}>
      <Container className={classes.inner}>
        <Group>
          <Burger // TODO: when click navbar doesnt come out
            opened={opened}
            onClick={toggle}
            className={classes.burger}
            size="sm"
          />
          <MantineLogo size={28} />
          {/* <Image width={60} src='logo.svg' /> */}
          {/* TODO: change to acfirst logo */}
        </Group>
        <Group spacing={5} className={classes.links}>
          {items}
        </Group>
        <Popover shadow="sm" opened={cartOpened} onChange={setCartOpened}>
          <Popover.Target>
            <Indicator color="red" label={cartSize} size={16}>
              <ActionIcon
                variant="subtle"
                onClick={() => setCartOpened((o) => !o)}
              >
                <IconShoppingCart stroke={1.5} size="2rem" />
              </ActionIcon>
            </Indicator>
          </Popover.Target>
          <Popover.Dropdown p="xl">
            <ScrollArea mah={400} offsetScrollbars>
              {/* TODO: show something when cart is empty */}
              {cartProducts}
            </ScrollArea>
            <Button
              fullWidth
              mt="xl"
              component={Link}
              to="/checkout"
              onClick={() => setCartOpened(false)}
            >
              Checkout
            </Button>
          </Popover.Dropdown>
        </Popover>
      </Container>
    </Header>
  )
}
