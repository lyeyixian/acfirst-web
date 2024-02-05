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
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'

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

const formatSlugToLabel = (slug, filters) => {
  return filters.find((filter) => filter.slug === slug)?.label
}

export default function FiltersGroup({
  icon: Icon,
  label,
  slug,
  initiallyOpened,
  filters,
  onClick,
  search,
  setSearch,
}) {
  const { classes, theme } = useStyles()
  const hasFilters = Array.isArray(filters)
  const [opened, setOpened] = useState(initiallyOpened || true)
  const ChevronIcon = theme.dir === 'ltr' ? IconChevronRight : IconChevronLeft

  const filterValue = search[slug] || ''

  const items = (hasFilters ? filters : []).map((filter, index) => (
    <div key={index}>
      {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
      <NavLink
        active={filterValue === filter.slug}
        className={classes.link}
        label={filter.label}
        onClick={(e) => {
          if (filterValue === filter.slug) {
            delete search[slug]
            setSearch({ ...search })
          } else {
            setSearch({ ...search, [slug]: filter.slug })
          }

          onClick(e)
        }}
      />
    </div>
  ))

  return (
    <>
      <UnstyledButton
        onClick={() => setOpened((o) => !o)}
        className={classes.control}
      >
        <Group position="apart" spacing={0} noWrap>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {Icon && (
              <ThemeIcon variant="outline" size={30}>
                <Icon size="1.1rem" />
              </ThemeIcon>
            )}
            <Text ml="sm" lineClamp={1}>
              {`${label}${
                filterValue
                  ? `: ${formatSlugToLabel(filterValue, filters)}`
                  : ''
              }`}
            </Text>{' '}
          </Box>
          {hasFilters && (
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
      {hasFilters ? <Collapse in={opened}>{items}</Collapse> : null}
    </>
  )
}
