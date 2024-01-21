import {
  Badge,
  Box,
  Button,
  Card,
  Flex,
  Grid,
  Group,
  Image,
  SimpleGrid,
  Text,
  TextInput,
  Textarea,
  Title,
  createStyles,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { json, redirect } from '@remix-run/node'
import {
  Link,
  useActionData,
  useFetcher,
  useNavigation,
  useSubmit,
} from '@remix-run/react'
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
import DeleteCartItemBtn from '../components/common/DeleteCartItemBtn'

const useStyles = createStyles((theme) => ({
  link: {
    '&:hover': {
      color: theme.colors[theme.primaryColor][7],
    },
  },
}))

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

  if (!res) {
    return json({ error: "Can't submit enquiry" })
  }

  const cartRes = await clearCart(cartId)
  if (!cartRes) {
    console.log('Something went wrong when clearing cart')
  }

  return redirect(`/checkout/success/${res.attributes.orderId}`)
}

function ProductSummary({ product }) {
  const { classes } = useStyles()
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
            miw={75}
            maw={75}
            radius="sm"
            imageRef={imageRef}
            onLoad={handleOnLoad}
          />
        )}
      </AcfirstSkeleton>
      <Flex
        direction={{ base: 'column', sm: 'row' }}
        gap={{ base: 'lg', sm: 0 }}
        sx={{
          flexGrow: 1,
        }}
      >
        <Box mr="md">
          <Text
            component={Link}
            to={`/products/c/${product.code}`}
            className={classes.link}
          >
            {product.name}
          </Text>
          <Text size="sm" color="dimmed">
            {product.category}
          </Text>
          <Group spacing="xs" mt="xs">
            <Badge variant="dot">{_.startCase(product.type)}</Badge>
            <Badge variant="dot">{_.startCase(product.surface)}</Badge>
            <Badge variant="dot">{formatSize(product.size)}</Badge>
          </Group>
        </Box>
        <Flex
          direction={{ base: 'row-reverse', sm: 'column' }}
          align={{ base: 'center', sm: 'flex-end' }}
          justify={{ base: 'space-between', sm: 'center' }}
          gap={{ sm: 'xl' }}
          style={{ flexShrink: 0 }}
        >
          <DeleteCartItemBtn code={product.code} />
          <AcfirstNumberInput value={quantity} onChange={setQuantity} />
        </Flex>
      </Flex>
    </Group>
  )
}

export default function CheckoutRoute() {
  const { cartItems, cartId } = useCart()
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

  const actionData = useActionData()

  useNotification(
    { state: navigation.state, data: actionData },
    'Your form has been submitted successfully. We will contact you in 3 business days.',
    'There is something wrong when submitting your enquiry. Please try again.'
  )

  return (
    <div>
      <h1>Checkout</h1>
      <Grid gutter="xl">
        <Grid.Col order={2} sm={5} orderSm={1}>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Title order={3}>Contact information</Title>
            <Box mt="md">
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
        <Grid.Col order={1} sm={7} orderSm={2}>
          <Title order={3}>Order Summary</Title>
          <Card padding="lg" withBorder shadow="sm" radius="md" mt="md">
            {checkoutProducts}
          </Card>
        </Grid.Col>
      </Grid>
    </div>
  )
}
