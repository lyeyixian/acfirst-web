import qs from 'qs'
import { getStrapiURL } from './helper'

export async function fetchApi(path, urlParamsObj = {}, options = {}) {
  try {
    // Merge default and user options
    const mergedOptions = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
      ...options,
    }

    // Build request URL
    const queryString = qs.stringify(urlParamsObj)
    const requestUrl = `${getStrapiURL(
      `/api${path}${queryString ? `?${queryString}` : ''}`
    )}`

    // Trigger API call
    const response = await fetch(requestUrl, mergedOptions)

    if (!response.ok) {
      throw new Error(`Fetch response not ok: ${response.statusText}`)
    }

    const data = await response.json()

    return data
  } catch (err) {
    console.log(err)

    return null
  }
}
