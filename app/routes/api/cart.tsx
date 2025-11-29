import { json } from '@remix-run/node'
import { addCart, addToCart, updateCart } from '../../models/cart.server'
import { commitSession, getCartId, getSession } from '../../session.server'

export async function action({ request }) {
  let cartId = await getCartId(request)
  let options = {}

  if (!cartId) {
    const session = await getSession(request)
    const cart = await addCart()

    cartId = cart.attributes.cartId
    session.set('cartId', cartId)
    options = { headers: { 'Set-Cookie': await commitSession(session) } }
  }

  const formData = await request.formData()
  const productId = formData.get('productId')
  const quantity = formData.get('quantity')
  let res = null

  if (request.method === 'POST') {
    res = await addToCart(productId, quantity, cartId)
  } else if (request.method === 'PUT') {
    res = await updateCart(productId, quantity, cartId)
  }

  return json(res, options)
}
