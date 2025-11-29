import { fetchApi } from '../utils/api/fetchApi'

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
  const res = await fetchApi(path, urlParamsObj)

  if (!res?.data) {
    return null
  }

  return res.data[0]
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
    if (!value) {
      continue
    }

    urlParamsObj.filters[key] = key === 'code' ? { $in: value } : { $eq: value }
  }

  if (category && category !== 'all') {
    urlParamsObj.filters.category = {
      slug: {
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

export async function getRelatedProducts(code, category, type, surface, size) {
  const path = '/products'
  const isEitherFour = {
    $or: [
      {
        category: {
          slug: {
            $eq: category,
          },
        },
      },
      {
        type: {
          $eq: type,
        },
      },
      {
        surface: {
          $eq: surface,
        },
      },
      {
        size: {
          $eq: size,
        },
      },
    ],
  }
  const isNotCurrentProduct = {
    code: {
      $ne: code,
    },
  }
  const urlParamsObj = {
    populate: 'deep',
    filters: {
      $and: [isEitherFour, isNotCurrentProduct],
    },
    pagination: {
      start: 0,
      limit: 10,
    },
    sort: 'viewCount:desc',
  }

  const res = await fetchApi(path, urlParamsObj)

  if (!res?.data) {
    return []
  }

  return res.data
}

export async function incrementProductViewCount(productId, viewCount) {
  const path = `/products/${productId}`
  const options = {
    method: 'PUT',
    body: JSON.stringify({
      data: {
        viewCount: (viewCount || 0) + 1,
      },
    }),
  }

  const res = await fetchApi(path, {}, options)

  if (!res?.data) {
    return null
  }

  return res.data
}

export async function getProductCodes(category) {
  const path = '/products'
  const urlParamsObj = {
    fields: ['code'],
    sort: 'viewCount:desc',
    filters: {},
  }

  if (category && category !== 'all') {
    urlParamsObj.filters.category = {
      slug: {
        $eq: category,
      },
    }
  }

  const res = await fetchApi(path, urlParamsObj)

  if (!res?.data) {
    return []
  }

  return res.data
}
