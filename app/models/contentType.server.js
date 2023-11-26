import { fetchApi } from '../utils/api/fetchApi'

export async function getProductSchema() {
  const path = '/content-type-builder/content-types/api::product.product'
  const options = { method: 'GET' }

  try {
    return await fetchApi(path, {}, options)
  } catch {
    return { error: 'Unable to get product schema!' }
  }
}
