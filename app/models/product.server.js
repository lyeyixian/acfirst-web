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
    sort: 'viewCount:desc',
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

export async function incrementProductViewCount(productId, viewCount) {
  const path = `/products/${productId}`
  const options = {
    method: 'PUT',
    body: JSON.stringify({
      data: {
        viewCount: viewCount + 1,
      },
    }),
  }

  try {
    return await fetchApi(path, {}, options)
  } catch {
    return { error: 'Unable to increment product view count!' }
  }
}
