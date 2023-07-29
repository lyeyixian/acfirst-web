import { getStrapiURL } from '../utils/apiHelper'
import { fetchApi } from '../utils/fetchApi'

export async function getPageById(id) {
  const res = await fetch(getStrapiURL(`/api/pages/${id}?populate=*`))
  return await res.json()
}

export async function getPageBySlug(slug) {
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
