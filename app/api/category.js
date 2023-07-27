import { fetchApi } from '../utils/fetchApi'

export async function getCategories() {
  const path = '/categories'
  const urlParamsObj = {
    populate: 'deep',
  }

  return await fetchApi(path, urlParamsObj)
}
