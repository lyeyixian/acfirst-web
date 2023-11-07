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
    populate: 'deep',
  }
  const { data } = await fetchApi(path, urlParamsObj)
  return data[0]
}

// TODO: when deploy, dont know why a lot of carts will be created
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

  try {
    return await fetchApi(path, {}, options)
  } catch {
    return { error: 'Unable to clear cart!' }
  }
}

export async function addToCart(code, quantity, cartId) {
  const cart = await getCart(cartId)
  if (!cart) {
    throw new Response('Cart not found', { status: 404 })
  }

  const cartItems = cart.attributes.cartItems
  const cartItem = cartItems.find((item) => item.code === code)

  if (cartItem) {
    cartItem.quantity = parseInt(cartItem.quantity) + parseInt(quantity)
  } else {
    const product = await getProduct(code)

    if (!product) {
      throw new Response('Product not found', { status: 404 })
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

  try {
    return await fetchApi(path, {}, options)
  } catch {
    return { error: 'Unable to update cart!' }
  }
}

export async function updateCart(code, quantity, cartId) {
  const cart = await getCart(cartId)
  if (!cart) {
    throw new Response('Cart not found', { status: 404 })
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

  try {
    return await fetchApi(path, {}, options)
  } catch {
    return { error: 'Unable to update existing cart item!' }
  }
}

export async function removeFromCart(code, cartId) {
  let cart = await getCart(cartId)
  if (!cart) {
    throw new Response('Cart not found', { status: 404 })
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

  try {
    return await fetchApi(path, {}, options)
  } catch {
    return { error: 'Unable to delete product from cart!' }
  }
}
