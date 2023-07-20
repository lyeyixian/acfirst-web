import qs from 'qs'
import { getStrapiURL } from './apiHelper'

export async function fetchApi(path, urlParamsObj = {}, options = {}) {
  try {
    // Merge default and user options
    const mergedOptions = {
      headers: {
        'Content-Type': 'application/json',
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
    const data = await response.json()

    return data
  } catch (err) {
    console.error(err)
    throw new Error('Failed to fetch API')
  }
}
