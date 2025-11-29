import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { Text, createStyles, rem } from '@mantine/core'
import { IconMapPin, IconPhone } from '@tabler/icons-react'
import ContactIconsList from '../components/ContactIconsList'
import { getPage } from '../models/page.server'
import Map from '../components/stores/Map'

const useStyles = createStyles((theme) => {
  const BREAKPOINT = theme.fn.smallerThan('sm')

  return {
    wrapper: {
      display: 'flex',
      padding: rem(4),
      marginTop: `calc(${theme.spacing.xl} * 2)`,

      [BREAKPOINT]: {
        flexDirection: 'column',
      },
    },

    contacts: {
      boxSizing: 'border-box',
      position: 'relative',
      borderRadius: theme.radius.lg,
      backgroundImage: `linear-gradient(135deg, ${
        theme.colors[theme.primaryColor][5]
      } 0%, ${theme.colors[theme.primaryColor][7]} 100%)`,
      border: `${rem(1)} solid transparent`,
      padding: theme.spacing.xl,
      flex: `0 0 ${rem(280)}`,

      [BREAKPOINT]: {
        marginBottom: theme.spacing.sm,
        paddingLeft: theme.spacing.md,
        flexBasis: 'auto',
      },
    },

    title: {
      marginBottom: `calc(${theme.spacing.xl} * 1.5)`,
      fontFamily: `Greycliff CF, ${theme.fontFamily}`,

      [BREAKPOINT]: {
        marginBottom: theme.spacing.xl,
      },
    },
  }
})

export async function loader() {
  const pageData = await getPage('stores')
  const res = []

  for (const section of pageData.attributes.contentSection) {
    const { title, phone, address } = section.contactInfo

    res.push({ src: section.map.url, title, phone, address })
  }
  return json(res)
}

export default function LocateUsRoute() {
  const loaderData = useLoaderData()
  const { classes } = useStyles()
  const locations = loaderData.map((store, index) => {
    const { src, title, phone, address } = store
    const data = [
      {
        title: 'Address',
        description: address,
        icon: IconMapPin,
      },
      {
        title: 'Contact',
        description: phone,
        icon: IconPhone,
      },
    ]

    return (
      <div key={index} className={classes.wrapper}>
        <div className={classes.contacts}>
          <Text fz="lg" fw={700} className={classes.title} c="#fff">
            {title}
          </Text>
          <ContactIconsList variant="white" data={data} />
        </div>
        <Map src={src} />
      </div>
    )
  })

  return (
    <div>
      <h1>Locate Us</h1>
      {locations}
    </div>
  )
}
