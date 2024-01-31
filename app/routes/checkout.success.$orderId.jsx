import { json } from '@remix-run/node'
import { getOrder } from '../models/order.server'
import { Link, useLoaderData, useParams } from '@remix-run/react'
import { Anchor, Button, Stack, Text, Title } from '@mantine/core'
import { useEffect } from 'react'

export async function loader({ params }) {
  const order = await getOrder(params.orderId)

  if (!order) {
    throw new Response('Order not found', { status: 404 })
  }

  const { phone, name, enquiry, orderId, productDetails } = order.attributes
  const text = `Name: ${name}
Phone: ${phone}
Interested Products: 
    - ${productDetails
      .map(
        (productDetail) => `${productDetail.code} x ${productDetail.quantity}`
      )
      .join('\n    - ')}
Order ID: ${orderId}

${enquiry}`
  const whatsappUrl = `https://wa.me/60174051255?text=${encodeURIComponent(
    text
  )}`
  return json({ whatsappUrl })
}

export default function () {
  const { whatsappUrl } = useLoaderData()
  const { orderId } = useParams()

  useEffect(() => {
    window.open(whatsappUrl, '_blank')
  }, [])

  return (
    <Stack align="flex-start" justify="center" h={400} spacing={0}>
      <Title
        sx={(theme) => ({
          color: theme.colors[theme.primaryColor][6],
        })}
      >
        Thank You!
      </Title>
      <Title order={5} mt="md">
        Order ID (for reference):
      </Title>
      <Text color="dimmed" mb="md">
        {orderId}
      </Text>
      <Text color="dimmed">
        If the WhatsApp popup didn't appear, please{' '}
        <Anchor href={whatsappUrl} target="_blank" rel="noopener noreferrer">
          click here
        </Anchor>
      </Text>
      <Text color="dimmed" mt="md">
        <Text weight={600} span>
          Note:
        </Text>{' '}
        You need to send the message through WhatsApp for us to process your
        order
      </Text>
      <Button component={Link} to="/products" my="md">
        Back to Products
      </Button>
    </Stack>
  )
}
