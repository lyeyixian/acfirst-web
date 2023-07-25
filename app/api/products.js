import { fetchApi } from '../utils/fetchApi'

export async function getProductById(id) {
  const path = `/products/${id}`
  const urlParamsObj = {
    populate: '*',
  }
  return await fetchApi(path, urlParamsObj)
}

export async function getProductByCode(code) {
  const path = `/products`
  const urlParamsObj = {
    filters: {
      code: {
        $eq: code,
      },
    },
    populate: 'deep',
  }
  const { data } = await fetchApi(path, urlParamsObj)
  return data[0]
}
