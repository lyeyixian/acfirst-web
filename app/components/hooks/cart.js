import { useRouteLoaderData } from '@remix-run/react'

export const useCart = () => {
  const rootLoaderData = useRouteLoaderData('root')
  let cartItems = []
  let cartId = null

  if (rootLoaderData) {
    const cart = rootLoaderData.cart.attributes

    cartId = cart.cartId
    cartItems = cart.cartItems
    console.log('--> cartItems: ', cartItems)
  }

  return { cartItems, cartId }
}
