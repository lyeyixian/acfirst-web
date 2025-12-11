// Mock dependencies before importing the module
import { vi } from 'vitest'

import { describe, it, expect, beforeEach } from 'vitest'
import { fetchApi } from '~/utils/api/fetchApi'
import { addContactFormSubmission } from '../contactFormSubmission.server'

vi.mock('~/utils/api/fetchApi')

const mockFetchApi = vi.mocked(fetchApi)

describe('contactFormSubmission.server', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFetchApi.mockReset()
  })

  describe('addContactFormSubmission', () => {
    it('submits contact form successfully', async () => {
      const formData = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Test message',
      }
      const submissionResult = { id: 1, attributes: formData }
      mockFetchApi.mockResolvedValue({ data: submissionResult })

      const result = await addContactFormSubmission(formData)

      expect(mockFetchApi).toHaveBeenCalledWith('/contact-form-submissions', {}, {
        method: 'POST',
        body: JSON.stringify({ data: formData }),
      })
      expect(result).toEqual(submissionResult)
    })

    it('returns error when unable to submit form', async () => {
      const formData = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Test message',
      }
      mockFetchApi.mockResolvedValue({ data: null })

      const result = await addContactFormSubmission(formData)

      expect(result).toEqual({ error: 'Unable to submit form!' })
    })

    it('returns error when fetchApi returns null', async () => {
      const formData = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Test message',
      }
      mockFetchApi.mockResolvedValue(null)

      const result = await addContactFormSubmission(formData)

      expect(result).toEqual({ error: 'Unable to submit form!' })
    })
  })
})