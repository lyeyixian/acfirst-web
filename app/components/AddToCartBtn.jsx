import { Button, Group } from '@mantine/core'
import { useFetcher } from '@remix-run/react'
import { useEffect, useState } from 'react'
import AcfirstNumberInput from './common/AcfirstNumberInput'
import { useNotification } from './hooks/notification'

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
  const [quantity, setQuantity] = useState(1)

  useNotification(
    addToCartFetcher,
    'Product has been added to cart.',
    'There is something wrong when adding to cart. Please try again.',
    () => setQuantity(1)
  )

  useEffect(() => {
    console.log('DEBUG add to cart state:', addToCartFetcher.state)
  }, [addToCartFetcher.state])

  return (
    <addToCartFetcher.Form method="post" action="/api/cart">
      <input type="hidden" name="productId" value={productId} />
      <Group>
        <AcfirstNumberInput value={quantity} onChange={setQuantity} />
        <Button
          type="submit"
          loading={['submitting', 'loading'].includes(addToCartFetcher.state)}
          loaderPosition="right"
          {...props}
        >
          Add to Cart
        </Button>
      </Group>
    </addToCartFetcher.Form>
  )
}
