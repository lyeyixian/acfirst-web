import { createCookieSessionStorage, json } from '@remix-run/node'
import invariant from 'tiny-invariant'
import { addCart } from './models/cart.server'

invariant(process.env.SESSION_SECRET, 'SESSION_SECRET must be set')

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__session',
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 7 day
    path: '/',
    sameSite: 'lax',
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === 'production',
  },
})
const { commitSession } = sessionStorage
export { commitSession }

export async function getSession(request) {
  const cookie = request.headers.get('Cookie')
  return sessionStorage.getSession(cookie)
}

export async function createCartSession(request) {
  // to prevent cron job pinging from creating too many cart sessions
  if (new URL(request.url).pathname === '/healthcheck') {
    return json({ message: 'ok' })
  }

  const session = await getSession(request)
  const cart = await addCart()

  session.set('cartId', cart.attributes.cartId)
  return json(
    { cart: cart },
    {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    }
  )
}

export async function getCartId(request) {
  const session = await getSession(request)
  const cartId = session.get('cartId')
  return cartId
}
