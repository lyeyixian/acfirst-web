import { getStrapiMedia } from '../utils/apiHelper'
import { fetchApi } from '../utils/fetchApi'
import { getProduct } from './product.server'

export async function getCart(cartId) {
  const path = '/carts'
  const urlParamsObj = {
    filters: {
      cartID: {
        $eq: cartId,
      },
    },
    populate: 'deep',
  }
  const { data } = await fetchApi(path, urlParamsObj)
  return data[0]
}

export async function addCart() {
  const path = '/carts'
  const options = {
    method: 'POST',
    body: JSON.stringify({ data: { cartItems: [] } }),
  }
  try {
    return await fetchApi(path, {}, options)
  } catch {
    return { error: 'Unable to create cart!' }
  }
}

export async function addToCart(code, cartId) {
  const product = await getProduct(code)
  if (!product) {
    throw new Response('Product not found', { status: 404 })
  }

  let cart = await getCart(cartId)
  if (!cart) {
    throw new Response('Cart not found', { status: 404 })
  }

  const cartItems = cart.attributes.cartItems
  const cartItem = cartItems.find((item) => item.code === code)

  if (!cartItem) {
    const prunedProduct = {
      id: product.id,
      name: product.attributes.name,
      code: product.attributes.code,
      size: product.attributes.size,
      surface: product.attributes.surface,
      type: product.attributes.type,
      imgUrl: getStrapiMedia(product.attributes.coverImg.data),
    }
    const path = `/carts/${cart.id}`
    const options = {
      method: 'PUT',
      body: JSON.stringify({
        data: { cartItems: [...cartItems, prunedProduct] },
      }),
    }
    try {
      return await fetchApi(path, {}, options)
    } catch {
      return { error: 'Unable to add to cart!' }
    }
  }

  return { msg: 'OK! Product already in cart.' }
}

export async function removeFromCart(product) {}
