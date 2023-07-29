import { fetchApi } from '../utils/fetchApi'

export async function getProjects(page = 1) {
  const path = '/projects'
  const urlParamsObj = {
    populate: 'deep',
    pagination: {
      page,
      pageSize: 4,
    },
  }

  return await fetchApi(path, urlParamsObj)
}
