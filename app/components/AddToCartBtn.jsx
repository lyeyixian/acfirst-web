import { Button, NumberInput, Group } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useFetcher } from '@remix-run/react'
import { IconCheck, IconX } from '@tabler/icons-react'
import { useState, useEffect } from 'react'

export function isInvalidQuantity(quantity) {
  return (quantity === "" || quantity === null || quantity === undefined || (quantity <= 0 && /^[0-9]+$/.test(quantity.toString())));
}

export function InputQuantity({quantity, setQuantity, ...props}) {
  return (
    <NumberInput
      name="quantity"
      my="xs"
      placeholder="0"
      value={quantity}
      onChange={setQuantity}
      allowNegative={false}
      allowDecimal={false}
      type="number"
      min={0}
      {...props}
    />
  )
}
export default function AddToCartBtn({ productId, ...props }) {
  const addToCartFetcher = useFetcher()
  const [quantity, setQuantity] = useState(0);

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
        setQuantity(0)
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
      <InputQuantity quantity={quantity} setQuantity={setQuantity} {...props}/>
      <Button
        disabled={isInvalidQuantity(quantity)}
        my="md"
        type="submit"
        loading={addToCartFetcher.state === 'submitting'}
        loaderPosition="right"
        onClick={(e) => {
          if(isInvalidQuantity(quantity)) e.preventDefault();
          e.stopPropagation()
        }}
        {...props}
      >
        Add to Cart
      </Button>
      </Group>
    </addToCartFetcher.Form>
  )
}
