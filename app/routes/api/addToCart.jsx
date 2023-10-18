import { json } from '@remix-run/node'
import { addCart, addToCart } from '../../models/cart.server'
import { commitSession, getCartId, getSession } from '../../session.server'

export async function action({ request }) {
  let cartId = await getCartId(request)
  let options = {}

  if (!cartId) {
    const session = await getSession(request)
    const res = await addCart()

    cartId = res.data.attributes.cartId
    session.set('cartId', cartId)
    options = { headers: { 'Set-Cookie': await commitSession(session) } }
  }

  const formData = await request.formData()
  const productId = formData.get('productId')
  const quantity = formData.get("quantity")
  const res = await addToCart(productId, quantity, cartId)

  return json(res, options)
}
