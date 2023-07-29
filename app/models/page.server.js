import { fetchApi } from '../utils/fetchApi'

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
  const { data } = await fetchApi(path, urlParamsObj)

  return data[0]
}
