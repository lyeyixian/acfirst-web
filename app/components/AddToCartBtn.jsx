import { Button, Group } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useFetcher } from '@remix-run/react'
import { IconCheck, IconX } from '@tabler/icons-react'
import { useEffect } from 'react'
import AcfirstNumberInput from './common/AcfirstNumberInput'

export function isInvalidQuantity(quantity) {
  return (
    quantity === '' ||
    quantity === null ||
    quantity === undefined ||
    (quantity <= 0 && /^[0-9]+$/.test(quantity.toString()))
  )
}

export default function AddToCartBtn({ productId, ...props }) {
  const addToCartFetcher = useFetcher()

  useEffect(() => {
    if (addToCartFetcher.state === 'idle' && addToCartFetcher.data) {
      if (addToCartFetcher.data.error) {
        notifications.show({
          title: `Error: ${addToCartFetcher.data.error}`,
          message:
            'There is something wrong when adding to cart. Please try again.',
          color: 'red',
          icon: <IconX size="1.2rem" />,
        })
      } else if (addToCartFetcher.data.msg) {
        notifications.show({
          title: 'Success',
          message: addToCartFetcher.data.msg,
          color: 'teal',
          icon: <IconCheck size="1.2rem" />,
        })
      } else {
        notifications.show({
          title: 'Success',
          message: 'Product has been added to cart.',
          color: 'teal',
          icon: <IconCheck size="1.2rem" />,
        })
      }

      addToCartFetcher.data = null
    }
  }, [addToCartFetcher.state])

  return (
    <addToCartFetcher.Form method="post" action="/api/addToCart">
      <input type="hidden" name="productId" value={productId} />
      <Group>
        <AcfirstNumberInput />
        <Button
          my="md"
          type="submit"
          loading={addToCartFetcher.state === 'submitting'}
          loaderPosition="right"
          {...props}
        >
          Add to Cart
        </Button>
      </Group>
    </addToCartFetcher.Form>
  )
}
