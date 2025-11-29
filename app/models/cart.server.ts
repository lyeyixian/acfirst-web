import { getStrapiMedia } from '../utils/api/helper'
import { fetchApi } from '../utils/api/fetchApi'
import { getProduct } from './product.server'

export async function getCart(cartId) {
  const path = '/carts'
  const urlParamsObj = {
    filters: {
      cartId: {
        $eq: cartId,
      },
    },
  }

  const res = await fetchApi(path, urlParamsObj)

  if (!res?.data) {
    return null
  }

  return res.data[0]
}

export async function addCart() {
  const path = '/carts'
  const options = {
    method: 'POST',
    body: JSON.stringify({ data: { cartItems: [] } }),
  }

  const res = await fetchApi(path, {}, options)

  if (!res?.data) {
    throw new Error('Unable to create cart!')
  }

  return res.data
}

export async function clearCart(cartId) {
  let cart = await getCart(cartId)
  if (!cart) {
    throw new Response('Cart not found', { status: 404 })
  }

  const path = `/carts/${cart.id}`
  const options = {
    method: 'PUT',
    body: JSON.stringify({
      data: { cartItems: [] },
    }),
  }

  const res = await fetchApi(path, {}, options)

  if (!res?.data) {
    return null
  }

  return res.data
}

export async function addToCart(code, quantity, cartId) {
  const cart = await getCart(cartId)
  if (!cart) {
    return { error: 'Cart not found' }
  }

  const cartItems = cart.attributes.cartItems
  const cartItem = cartItems.find((item) => item.code === code)

  if (cartItem) {
    cartItem.quantity = parseInt(cartItem.quantity) + parseInt(quantity)
  } else {
    const product = await getProduct(code)

    if (!product) {
      return { error: 'Product not found' }
    }

    const prunedProduct = {
      id: product.id,
      name: product.attributes.name,
      code: product.attributes.code,
      size: product.attributes.size,
      surface: product.attributes.surface,
      type: product.attributes.type,
      category: product.attributes.category.data.attributes.name,
      imgUrl: getStrapiMedia(product.attributes.coverImg.data),
      quantity: parseInt(quantity),
    }

    cartItems.push(prunedProduct)
  }

  const path = `/carts/${cart.id}`
  const options = {
    method: 'PUT',
    body: JSON.stringify({
      data: { cartItems: [...cartItems] },
    }),
  }

  const res = await fetchApi(path, {}, options)

  if (!res?.data) {
    return { error: 'Unable to add to cart!' }
  }

  return res.data
}

export async function updateCart(code, quantity, cartId) {
  const cart = await getCart(cartId)
  if (!cart) {
    return { error: 'Cart not found' }
  }

  const cartItems = cart.attributes.cartItems
  const cartItem = cartItems.find((item) => item.code === code)

  if (cartItem) {
    cartItem.quantity = parseInt(quantity)
  }

  const path = `/carts/${cart.id}`
  const options = {
    method: 'PUT',
    body: JSON.stringify({
      data: { cartItems: [...cartItems] },
    }),
  }

  const res = await fetchApi(path, {}, options)

  if (!res?.data) {
    return { error: 'Unable to update existing cart item!' }
  }

  return res.data
}

export async function removeFromCart(code, cartId) {
  let cart = await getCart(cartId)
  if (!cart) {
    return { error: 'Cart not found' }
  }

  const cartItems = cart.attributes.cartItems.filter(
    (item) => item.code !== code
  )
  const path = `/carts/${cart.id}`
  const options = {
    method: 'PUT',
    body: JSON.stringify({
      data: { cartItems },
    }),
  }

  const res = await fetchApi(path, {}, options)

  if (!res?.data) {
    return { error: 'Unable to remove product from cart!' }
  }

  return res.data
}
