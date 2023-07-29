import { useActionData, useLoaderData, useNavigation } from '@remix-run/react'
import { json } from '@remix-run/node'

import { notifications } from '@mantine/notifications'

import {
  IconAt,
  IconCheck,
  IconMapPin,
  IconPhone,
  IconSun,
  IconX,
} from '@tabler/icons-react'

import { addContactFormSubmission } from '../models/contactFormSubmission.server'
import { getPage } from '../models/page.server'
import GetInTouch from '../components/contact/GetInTouch'

export async function action({ request }) {
  const formData = await request.formData()
  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    message: formData.get('message'),
  }

  return await addContactFormSubmission(data)
}

export async function loader() {
  const pageData = await getPage('contact')
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
