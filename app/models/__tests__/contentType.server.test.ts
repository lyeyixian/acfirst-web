// Mock dependencies before importing the module
import { vi } from 'vitest'

import { describe, it, expect, beforeEach } from 'vitest'
import { fetchApi } from '~/utils/api/fetchApi'
import { getProductSchema } from '../contentType.server'

vi.mock('~/utils/api/fetchApi')

const mockFetchApi = vi.mocked(fetchApi)

describe('contentType.server', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFetchApi.mockReset()
  })

  describe('getProductSchema', () => {
    it('returns product schema', async () => {
      const schemaData = {
        data: {
          schema: {
            attributes: {
              name: { type: 'string' },
              code: { type: 'string' },
              price: { type: 'decimal' },
            },
          },
        },
      }
      mockFetchApi.mockResolvedValue(schemaData)

      const result = await getProductSchema()

      expect(mockFetchApi).toHaveBeenCalledWith(
        '/content-type-builder/content-types/api::product.product',
        {},
        { method: 'GET' }
      )
      expect(result).toEqual(schemaData.data.schema.attributes)
    })

    it('returns null when no schema data', async () => {
      mockFetchApi.mockResolvedValue({ data: null })

      const result = await getProductSchema()

      expect(result).toBeNull()
    })

    it('returns null when fetchApi returns null', async () => {
      mockFetchApi.mockResolvedValue(null)

      const result = await getProductSchema()

      expect(result).toBeNull()
    })
  })
})