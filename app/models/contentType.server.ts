import { fetchApi } from '../utils/api/fetchApi'

export async function getProductSchema() {
  const path = '/content-type-builder/content-types/api::product.product'
  const options = { method: 'GET' }

  const res = await fetchApi(path, {}, options)

  if (!res?.data) {
    return null
  }

  return res.data.schema.attributes
}
