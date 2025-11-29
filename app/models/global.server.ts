import { fetchApi } from '../utils/api/fetchApi'

export async function getGlobal() {
  const path = '/global'
  const urlParamsObj = {
    populate: 'deep',
  }

  return await fetchApi(path, urlParamsObj)
}
