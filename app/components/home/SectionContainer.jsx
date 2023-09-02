import { Text, Title, createStyles, rem } from '@mantine/core'

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
    marginTop: theme.spacing.xs,
    marginBottom: rem(50),
    textAlign: 'center',

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
}))

export default function SectionContainer({ title, subtitle, children }) {
  const { classes } = useStyles()

  return (
    <div className={classes.container}>
      <Title order={2} className={classes.title} ta="center">
        {title}
      </Title>
      <Text c="dimmed" className={classes.description}>
        {subtitle}
      </Text>
      {children}
    </div>
  )
}
