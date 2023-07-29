import { fetchApi } from '../utils/fetchApi'

export async function getProduct(code) {
  const path = `/products`
  const urlParamsObj = {
    filters: {
      code: {
        $eq: code,
      },
    },
    populate: 'deep',
  }
  const { data } = await fetchApi(path, urlParamsObj)
  return data[0]
}

export async function getProducts(page = 1, category, filters = {}) {
  const path = '/products'
  const urlParamsObj = {
    populate: 'deep',
    pagination: {
      page,
      pageSize: 6,
    },
    filters: {},
  }

  for (const [key, value] of Object.entries(filters)) {
    if (value) {
      urlParamsObj.filters[key] = {
        $eq: value,
      }
    }
  }

  if (category && category !== 'all') {
    urlParamsObj.filters.category = {
      slug: {
        $eq: category,
      },
    }
  }

  return await fetchApi(path, urlParamsObj)
}
