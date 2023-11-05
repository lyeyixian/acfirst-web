import { useRouteLoaderData } from '@remix-run/react'

export const useCart = () => {
  const rootLoaderData = useRouteLoaderData('root')
  let cartSize = 0
  let cartItems = []

  if (rootLoaderData) {
    cartItems = rootLoaderData.cart.attributes.cartItems
    cartSize = cartItems.length
    console.log('--> cartItems: ', cartItems)
  }

  return { cartSize, cartItems }
}
