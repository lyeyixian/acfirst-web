import { fetchApi } from '../utils/fetchApi'

export async function getProductById(id) {
  const path = `/products/${id}`
  const urlParamsObj = {
    populate: '*',
  }
  return await fetchApi(path, urlParamsObj)
}
