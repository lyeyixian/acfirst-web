import { fetchApi } from '../utils/api/fetchApi'

export async function getPage(slug) {
  const path = '/pages'
  const urlParamsObj = {
    filters: {
      slug: {
        $eq: slug,
      },
    },
    populate: 'deep',
  }
  const res = await fetchApi(path, urlParamsObj)

  if (!res?.data) {
    throw new Error('Data missing from response')
  }

  return res.data[0]
}
