import { json } from '@remix-run/node'
import { getOrder } from '../models/order.server'
import { Link, useLoaderData, useParams } from '@remix-run/react'
import { Button, Stack, Text, Title } from '@mantine/core'
import { useEffect } from 'react'

export async function loader({ params }) {
  const order = await getOrder(params.orderId) // TODO: handle cant get order error
  const { phone, name, enquiry, orderId, products } = order.attributes
  const productCodes = products.data.map((product) => product.attributes.code)
  const text = `Name: ${name}
Phone: ${phone}
Interested Products: ${productCodes.join(', ')}
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

  // TODO: figure out how to let user choose to use whatsapp or not in a delegant way
  return (
    <Stack align="flex-start" justify="center" h={400} spacing={0}>
      <Title
        sx={(theme) => ({
          color: theme.colors[theme.primaryColor][6],
        })}
      >
        Thank You!
      </Title>
      <Text color="dimmed">
        Your order is received and we will be in touch with you in 3 business
        days
      </Text>
      <Title order={5} mt="md">
        Order ID:
      </Title>
      <Text color="dimmed">{orderId}</Text>
      <Button component={Link} to="/products" my="md">
        Back to Products
      </Button>
    </Stack>
  )
}
