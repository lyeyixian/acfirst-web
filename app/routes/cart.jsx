import { json } from '@remix-run/node'
import { getCartId } from '../session.server'
import { removeFromCart } from '../models/cart.server'

export async function action({ request }) {
  const formData = await request.formData()
  const code = formData.get('code')
  const cartId = await getCartId(request)
  const res = await removeFromCart(code, cartId)

  return json(res)
}
