import { fetchApi } from '../utils/api/fetchApi'

export async function getCategories() {
  const path = '/categories'
  const urlParamsObj = {
    populate: 'coverImg',
  }
  const res = await fetchApi(path, urlParamsObj)

  if (!res?.data) {
    return null
  }

  return res.data
}
