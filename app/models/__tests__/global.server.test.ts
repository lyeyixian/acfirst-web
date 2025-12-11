// Mock dependencies before importing the module
import { vi } from 'vitest'

import { describe, it, expect, beforeEach } from 'vitest'
import { fetchApi } from '~/utils/api/fetchApi'
import { getGlobal } from '../global.server'

vi.mock('~/utils/api/fetchApi')

const mockFetchApi = vi.mocked(fetchApi)

describe('global.server', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFetchApi.mockReset()
  })

  describe('getGlobal', () => {
    it('returns global data', async () => {
      const globalData = {
        data: {
          attributes: {
            siteName: 'AC First',
            description: 'Tile company',
            contactInfo: {
              phone: '1234567890',
              email: 'info@acfirst.com',
            },
          },
        },
        meta: {},
      }
      mockFetchApi.mockResolvedValue(globalData)

      const result = await getGlobal()

      expect(mockFetchApi).toHaveBeenCalledWith('/global', {
        populate: 'deep',
      })
      expect(result).toEqual(globalData)
    })

    it('returns result from fetchApi even if null', async () => {
      mockFetchApi.mockResolvedValue(null)

      const result = await getGlobal()

      expect(result).toBeNull()
    })
  })
})