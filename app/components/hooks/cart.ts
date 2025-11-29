import { useRouteLoaderData } from '@remix-run/react'

export const useCart = () => {
  const rootLoaderData = useRouteLoaderData('root')
  let cartItems: any[] = []
  let cartId: string | null = null

  if (rootLoaderData) {
    const cart = (rootLoaderData as any).cart.attributes

    cartId = cart.cartId
    cartItems = cart.cartItems
  }

  return { cartItems, cartId }
}