import {
  ActionIcon,
  Box,
  Button,
  Card,
  Grid,
  Group,
  Image,
  SimpleGrid,
  Text,
  TextInput,
  Textarea,
  Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { redirect } from '@remix-run/node'
import { useNavigation, useRouteLoaderData, useSubmit } from '@remix-run/react'
import { IconTrash } from '@tabler/icons-react'
import { createOrder } from '../models/order.server'
import { clearCart } from '../models/cart.server'

export async function action({ request }) {
  const formData = await request.formData()
  const cartId = formData.get('cartId')
  const data = {
    name: formData.get('name'),
    phone: formData.get('phone'),
    enquiry: formData.get('enquiry'),
    cartItems: JSON.parse(formData.get('cartItems')),
  }

  const res = await createOrder(data)

  await clearCart(cartId)

  return redirect(`/checkout/success/${res.data.attributes.orderId}`)
}

export default function CheckoutRoute() {
  const { cart } = useRouteLoaderData('root')
  const checkoutProducts = cart.attributes.cartItems.map((product, index) => (
    <Card.Section key={index} withBorder inheritPadding py="lg">
      <Group>
        <Image src={product.imgUrl} maw={75} radius="sm" />
        <Box
          mr="md"
          sx={{
            flexGrow: 1,
          }}
        >
          <Text>{product.name}</Text>
          <Text color="dimmed">{product.category}</Text>
          <Text color="dimmed">{product.code}</Text>
          <Text color="dimmed">{product.surface}</Text>
          <Text color="dimmed">{product.size}</Text>
          <Text color="dimmed">{product.type}</Text>
        </Box>
        <ActionIcon color="red.4">
          <IconTrash size="1.2rem" />
        </ActionIcon>
      </Group>
    </Card.Section>
  ))

  const form = useForm({
    initialValues: {
      name: '',
      phone: '',
      enquiry: '',
      cartItems: JSON.stringify(cart.attributes.cartItems),
      cartId: cart.attributes.cartId,
    },
    validate: {
      name: (value) => (value.trim().length < 1 ? 'Name is required' : null),
      phone: (value) => (value.trim().length < 1 ? 'Phone is required' : null),
    },
  })
  const submit = useSubmit()
  const handleSubmit = (values, event) => {
    event.preventDefault()
    submit(values, {
      method: 'post',
      encType: 'application/x-www-form-urlencoded',
    })
  }
  const navigation = useNavigation()
  const isSubmitting = navigation.state === 'submitting'

  return (
    <div>
      <h1>Checkout</h1>
      <Grid>
        <Grid.Col span={6}>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Title order={3}>Contact information</Title>
            <Box mt="md" pr="md">
              <SimpleGrid cols={1}>
                <TextInput
                  label="Name"
                  placeholder="Your name"
                  name="name"
                  withAsterisk
                  {...form.getInputProps('name')}
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
                name="enquiry"
                label="Enquiry"
                placeholder="Your message"
                minRows={4}
                {...form.getInputProps('enquiry')}
              />

              <Textarea
                name="cartItems"
                display="none"
                {...form.getInputProps('cartItems')}
              ></Textarea>

              <TextInput
                name="cartId"
                display="none"
                {...form.getInputProps('cartId')}
              />

              <Group position="right" mt="md">
                <Button
                  type="submit"
                  loading={isSubmitting}
                  loaderPosition="right"
                >
                  Send enquiry
                </Button>
              </Group>
            </Box>
          </form>
        </Grid.Col>
        <Grid.Col span={6}>
          <Title order={3}>Order Summary</Title>
          <Card padding="lg" withBorder shadow="sm" radius="md" mt="md">
            {checkoutProducts}
          </Card>
        </Grid.Col>
      </Grid>
    </div>
  )
}