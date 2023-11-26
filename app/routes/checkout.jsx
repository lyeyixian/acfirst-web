import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Grid,
  Group,
  Image,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { redirect } from '@remix-run/node'
import { useFetcher, useNavigation, useSubmit } from '@remix-run/react'
import { IconTrash } from '@tabler/icons-react'
import { createOrder } from '../models/order.server'
import { clearCart } from '../models/cart.server'
import AcfirstSkeleton from '../components/common/AcfirstSkeleton'
import AcfirstNumberInput from '../components/common/AcfirstNumberInput'
import { useCart } from '../components/hooks/cart'
import { useState } from 'react'
import { useNotification } from '../components/hooks/notification'
import { useEffectAfterMount } from '../components/hooks/helper'
import { formatSize } from '../utils/formatter'
import { _ } from 'lodash'

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

function ProductSummary({ product }) {
  const updateCartFetcher = useFetcher()
  const [quantity, setQuantity] = useState(product.quantity)

  useEffectAfterMount(() => {
    const timer = setTimeout(() => {
      updateCartFetcher.submit(
        { productId: product.code, quantity: quantity },
        { method: 'put', action: '/api/cart' }
      )
    }, 2000)

    return () => clearTimeout(timer)
  }, [quantity])

  useNotification(
    updateCartFetcher,
    `${product.name} has been updated.`,
    'There is something wrong when updating the product. Please try again.'
  )

  return (
    <Group noWrap>
      <AcfirstSkeleton>
        {(handleOnLoad, imageRef) => (
          <Image
            src={product.imgUrl}
            maw={75}
            radius="sm"
            imageRef={imageRef}
            onLoad={handleOnLoad}
          />
        )}
      </AcfirstSkeleton>
      <Box
        mr="md"
        sx={{
          flexGrow: 1,
        }}
      >
        <Text>{product.name}</Text>
        <Text size="sm" color="dimmed">
          {product.category}
        </Text>
        <Group spacing="xs" mt="xs">
          <Badge variant="dot">{_.startCase(product.type)}</Badge>
          <Badge variant="dot">{_.startCase(product.surface)}</Badge>
          <Badge variant="dot">{formatSize(product.size)}</Badge>
        </Group>
      </Box>
      <Stack align="flex-end" gap="xl" style={{ flexShrink: 0 }}>
        <ActionIcon color="red.4" mb="1.5rem">
          <IconTrash size="1.2rem" />
        </ActionIcon>
        <AcfirstNumberInput value={quantity} onChange={setQuantity} />
      </Stack>
    </Group>
  )
}

export default function CheckoutRoute() {
  const { cartItems, cartId } = useCart()
  // TODO: UI issue
  const checkoutProducts = cartItems.map((product, index) => (
    <Card.Section key={index} withBorder inheritPadding py="lg">
      <ProductSummary product={product} />
    </Card.Section>
  ))

  const form = useForm({
    initialValues: {
      name: '',
      phone: '',
      enquiry: '',
      cartItems: JSON.stringify(cartItems),
      cartId: cartId,
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
        <Grid.Col span={5}>
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
        <Grid.Col span={7}>
          <Title order={3}>Order Summary</Title>
          <Card padding="lg" withBorder shadow="sm" radius="md" mt="md">
            {checkoutProducts}
          </Card>
        </Grid.Col>
      </Grid>
    </div>
  )
}
