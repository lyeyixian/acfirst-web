import { fetchApi } from '../utils/fetchApi'

export async function createFormEntry(data) {
  const path = '/contact-form-submissions'
  const options = {
    method: 'POST',
    body: JSON.stringify({ data }),
  }
  try {
    return await fetchApi(path, {}, options)
  } catch {
    return { error: 'Unable to submit form!' }
  }
}
