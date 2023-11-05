import { useRouteLoaderData } from '@remix-run/react'

export const useCart = () => {
  const rootLoaderData = useRouteLoaderData('root')
  let cartItems = []

  if (rootLoaderData) {
    cartItems = rootLoaderData.cart.attributes.cartItems
    console.log('--> cartItems: ', cartItems)
  }

  return { cartItems }
}
