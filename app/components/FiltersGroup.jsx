import { useEffect, useState } from 'react'
import {
  Group,
  Box,
  Collapse,
  ThemeIcon,
  Text,
  UnstyledButton,
  createStyles,
  rem,
  NavLink,
} from '@mantine/core'
import {
  IconCalendarStats,
  IconChevronLeft,
  IconChevronRight,
} from '@tabler/icons-react'
import { useSearchParams } from '@remix-run/react'

const useStyles = createStyles((theme) => ({
  control: {
    fontWeight: 500,
    display: 'block',
    width: '100%',
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
    fontSize: theme.fontSizes.sm,

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[7]
          : theme.colors.gray[0],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    },
  },

  link: {
    fontWeight: 500,
    display: 'block',
    textDecoration: 'none',
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    paddingLeft: rem(31),
    marginLeft: rem(30),
    fontSize: theme.fontSizes.sm,
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    borderLeft: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[7]
          : theme.colors.gray[0],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    },
  },

  chevron: {
    transition: 'transform 200ms ease',
  },
}))

export default function FiltersGroup({
  icon: Icon,
  label,
  slug,
  initiallyOpened,
  links,
}) {
  const { classes, theme } = useStyles()
  const hasLinks = Array.isArray(links)
  const [opened, setOpened] = useState(initiallyOpened || true)
  const ChevronIcon = theme.dir === 'ltr' ? IconChevronRight : IconChevronLeft

  const [searchParams, setSearchParams] = useSearchParams()
  const filterValue = searchParams.get(slug)
  const [active, setActive] = useState(filterValue)
  useEffect(() => {
    setActive(filterValue)
  }, [filterValue])
  // TODO: NavLink overflow to grid
  const items = (hasLinks ? links : []).map((link, index) => (
    <div key={index}>
      {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
      <NavLink
        active={active === link.slug}
        className={classes.link}
        label={link.label}
        onClick={() =>
          setSearchParams((prev) => {
            const params = new URLSearchParams(prev)

            if (active === link.slug) {
              params.delete(slug)
            } else {
              params.set(slug, link.slug)
            }

            params.set('p', 1)

            return params
          })
        }
      />
    </div>
  ))

  return (
    <>
      <UnstyledButton
        onClick={() => setOpened((o) => !o)}
        className={classes.control}
      >
        <Group position="apart" spacing={0}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {Icon && (
              <ThemeIcon variant="outline" size={30}>
                <Icon size="1.1rem" />
              </ThemeIcon>
            )}
            <Box ml="md">{`${label}${active ? `: ${active}` : ''}`}</Box>{' '}
            {/* TODO: use link label instead of slug. fix ui when text too long */}
          </Box>
          {hasLinks && (
            <ChevronIcon
              className={classes.chevron}
              size="1rem"
              stroke={1.5}
              style={{
                transform: opened
                  ? `rotate(${theme.dir === 'rtl' ? -90 : 90}deg)`
                  : 'none',
              }}
            />
          )}
        </Group>
      </UnstyledButton>
      {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
    </>
  )
}

const mockdata = {
  label: 'Releases',
  icon: IconCalendarStats,
  links: [
    { label: 'Upcoming releases', link: '/' },
    { label: 'Previous releases', link: '/' },
    { label: 'Releases schedule', link: '/' },
  ],
}

// export function NavbarLinksGroup() {
//   return (
//     <Box
//       sx={(theme) => ({
//         minHeight: rem(220),
//         padding: theme.spacing.md,
//         backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
//       })}
//     >
//       <LinksGroup {...mockdata} />
//     </Box>
//   );
// }
