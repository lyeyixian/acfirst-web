import { fetchApi } from '../utils/api/fetchApi'

export async function addContactFormSubmission(data) {
  const path = '/contact-form-submissions'
  const options = {
    method: 'POST',
    body: JSON.stringify({ data }),
  }

  const res = await fetchApi(path, {}, options)

  if (!res?.data) {
    return { error: 'Unable to submit form!' }
  }

  return res.data
}
