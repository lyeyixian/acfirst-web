import { useEffect } from 'react'

import {
  useActionData,
  useLoaderData,
  useNavigation,
  useSubmit,
} from '@remix-run/react'
import { json } from '@remix-run/node'

import {
  Paper,
  Text,
  TextInput,
  Textarea,
  Button,
  Group,
  SimpleGrid,
  createStyles,
  rem,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'

import {
  IconAt,
  IconCheck,
  IconMapPin,
  IconPhone,
  IconSun,
  IconX,
} from '@tabler/icons-react'

import ContactIconsList from '~/components/ContactIconsList'
import { createFormEntry } from '../models/contactFormSubmission.server'
import { getPageBySlug } from '../models/page.server'

const useStyles = createStyles((theme) => {
  const BREAKPOINT = theme.fn.smallerThan('sm')

  return {
    wrapper: {
      display: 'flex',
      backgroundColor:
        theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
      borderRadius: theme.radius.lg,
      padding: rem(4),
      border: `${rem(1)} solid ${
        theme.colorScheme === 'dark'
          ? theme.colors.dark[8]
          : theme.colors.gray[2]
      }`,

      [BREAKPOINT]: {
        flexDirection: 'column',
      },
    },

    form: {
      boxSizing: 'border-box',
      flex: 1,
      padding: theme.spacing.xl,
      paddingLeft: `calc(${theme.spacing.xl} * 2)`,
      borderLeft: 0,

      [BREAKPOINT]: {
        padding: theme.spacing.md,
        paddingLeft: theme.spacing.md,
      },
    },

    fields: {
      marginTop: rem(-12),
    },

    fieldInput: {
      flex: 1,

      '& + &': {
        marginLeft: theme.spacing.md,

        [BREAKPOINT]: {
          marginLeft: 0,
          marginTop: theme.spacing.md,
        },
      },
    },

    fieldsGroup: {
      display: 'flex',

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
      },
    },

    title: {
      marginBottom: `calc(${theme.spacing.xl} * 1.5)`,
      fontFamily: `Greycliff CF, ${theme.fontFamily}`,

      [BREAKPOINT]: {
        marginBottom: theme.spacing.xl,
      },
    },

    control: {
      [BREAKPOINT]: {
        flex: 1,
      },
    },
  }
})

function GetInTouch({ contactInfoTitle, contactInfoData, submitButtonData }) {
  const { type, text } = submitButtonData // TODO: figure out how to utilise type
  const { classes } = useStyles()
  const submit = useSubmit()
  const navigation = useNavigation()
  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
    },
    validate: {
      name: (value) => (value.trim().length < 1 ? 'Name is required' : null),
      email: (value) =>
        !/^\S+@\S+$/.test(value) ? 'Email format is invalid' : null,
      phone: (value) => (value.trim().length < 1 ? 'Phone is required' : null),
    },
  })

  const isSubmitting = navigation.state === 'submitting'
  useEffect(() => {
    if (!isSubmitting) {
      form.reset()
    }
  }, [isSubmitting])

  const handleSubmit = (values, event) => {
    event.preventDefault()
    submit(values, {
      method: 'post',
      encType: 'application/x-www-form-urlencoded',
    })
  }

  return (
    <Paper shadow="md" radius="lg" mt={50}>
      <div className={classes.wrapper}>
        <div className={classes.contacts}>
          <Text fz="lg" fw={700} className={classes.title} c="#fff">
            {contactInfoTitle}
          </Text>

          <ContactIconsList variant="white" data={contactInfoData} />
        </div>

        <form className={classes.form} onSubmit={form.onSubmit(handleSubmit)}>
          <Text fz="lg" fw={700} className={classes.title}>
            Get in touch
          </Text>

          <div className={classes.fields}>
            <SimpleGrid cols={1}>
              <TextInput
                label="Name"
                placeholder="Your name"
                name="name"
                withAsterisk
                {...form.getInputProps('name')}
              />

              <TextInput
                label="Email"
                placeholder="hello@acfirst.com"
                name="email"
                withAsterisk
                {...form.getInputProps('email')}
              />
              <TextInput
                label="Phone"
                placeholder="0123456789"
                name="phone"
                withAsterisk
                {...form.getInputProps('phone')}
              />
            </SimpleGrid>

            <Textarea
              mt="md"
              label="Message"
              placeholder="Your message"
              minRows={4}
              {...form.getInputProps('message')}
            />

            <Group position="right" mt="md">
              <Button
                type="submit"
                className={classes.control}
                loading={isSubmitting}
                loaderPosition="right"
              >
                {text}
              </Button>
            </Group>
          </div>
        </form>
      </div>
    </Paper>
  )
}

export async function action({ request }) {
  const formData = await request.formData()
  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    message: formData.get('message'),
  }

  return await createFormEntry(data)
}

export async function loader() {
  const pageData = await getPageBySlug('contact')
  const { contactInfo, submitButton } = pageData.attributes.contentSection[0]

  return json({
    contactInfoData: contactInfo,
    submitButtonData: submitButton,
  })
}

export default function ContactRoute() {
  const actionData = useActionData()
  const navigation = useNavigation()

  if (navigation.state === 'idle' && actionData) {
    if (actionData.error) {
      notifications.show({
        title: 'Error',
        message:
          'There is something wrong when submitting your form. Please try again.',
        color: 'red',
        icon: <IconX size="1.2rem" />,
      })
    } else {
      notifications.show({
        title: 'Success',
        message:
          'Your form has been submitted successfully. We will contact you in 3 business days.',
        color: 'teal',
        icon: <IconCheck size="1.2rem" />,
      })
    }
  }

  const { contactInfoData, submitButtonData } = useLoaderData()
  const { title, email, phone, address, workingHours } = contactInfoData

  return (
    <div>
      <h1>Contact Us</h1>
      <GetInTouch
        contactInfoTitle={title}
        contactInfoData={[
          { title: 'Email', description: email, icon: IconAt },
          { title: 'Phone', description: phone, icon: IconPhone },
          { title: 'Address', description: address, icon: IconMapPin },
          { title: 'Working hours', description: workingHours, icon: IconSun },
        ]}
        submitButtonData={submitButtonData}
      />
    </div>
  )
}
