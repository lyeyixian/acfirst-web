import { fetchApi } from '../utils/api/fetchApi'

export async function getProjects(options: { page?: number; category?: string } = {}) {
  const { page = 1, category } = options
  const path = `/projects`
  const urlParamsObj = {
    populate: 'deep',
    pagination: {
      page,
      pageSize: 6,
    },
    filters: {} as any,
  }

  if (category) {
    urlParamsObj.filters.category = {
      name: {
        $eq: category,
      },
    }
  }

  const res = await fetchApi(path, urlParamsObj)

  if (!res?.data) {
    return {
      data: [],
      meta: {
        pagination: {
          pageCount: 0,
        },
      },
    }
  }

  return res
}
