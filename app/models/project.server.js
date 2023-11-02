import { fetchApi } from '../utils/api/fetchApi'

export async function getProjects(page = 1, category) {
  const path = `/projects`
  const urlParamsObj = {
    populate: 'deep',
    pagination: {
      page,
      pageSize: 6,
    },
    filters: {},
  }

  if (category) {
    urlParamsObj.filters.category = {
      name: {
        $eq: category,
      },
    }
  }

  return await fetchApi(path, urlParamsObj)
}
