import { fetchApi } from '../utils/api/fetchApi'

export async function getCategories() {
  const path = '/categories'

  return await fetchApi(path)
}
