import {
  createStyles,
  Header,
  Container,
  Group,
  Burger,
  rem,
  ActionIcon,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { MantineLogo } from '@mantine/ds'
import { NavLink } from '@remix-run/react'
import { IconShoppingCart } from '@tabler/icons-react'

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
    link: '/products/all',
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
        end
      >
        {link.label}
      </NavLink>
    )
  })

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
        </Group>
        <Group spacing={5} className={classes.links}>
          {items}
        </Group>
        <ActionIcon variant="subtle" size="lg">
          <IconShoppingCart stroke={1.5} />
        </ActionIcon>
      </Container>
    </Header>
  )
}
