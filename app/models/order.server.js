import { fetchApi } from '../utils/api/fetchApi'

export async function createOrder(data) {
  const { name, phone, enquiry, cartItems } = data
  const path = '/orders'
  const options = {
    method: 'POST',
    body: JSON.stringify({
      data: {
        name,
        phone,
        enquiry,
        products: {
          connect: [...cartItems.map((item) => item.id)],
        },
        // quantities: cartItems.map((item) => item.quantity)
      },
    }),
  }

  const res = await fetchApi(path, {}, options)

  if (!res.data) {
    return null
  }

  return res.data
}

export async function getOrder(orderId) {
  const path = `/orders`
  const urlParamsObj = {
    filters: {
      orderId: {
        $eq: orderId,
      },
    },
    populate: 'products',
  }

  const res = await fetchApi(path, urlParamsObj)

  if (!res.data) {
    return null
  }

  return res.data[0]
}
