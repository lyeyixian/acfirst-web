import { fetchApi } from '../utils/fetchApi'

export async function getCategories(page=1) {
  const path = '/categories'
  const urlParamsObj = {
    populate: 'deep',
    pagination: {
      page,
      pageSize: 4,
    },
  }

  return await fetchApi(path, urlParamsObj)
}
