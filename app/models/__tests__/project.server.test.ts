// Mock dependencies before importing the module
import { vi } from 'vitest'

import { describe, it, expect, beforeEach } from 'vitest'
import { fetchApi } from '~/utils/api/fetchApi'
import { getProjects } from '../project.server'

vi.mock('~/utils/api/fetchApi')

const mockFetchApi = vi.mocked(fetchApi)

const mockApiResponse = {
  data: [],
  meta: {
    pagination: {
      pageCount: 0,
    },
  },
}

describe('project.server', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFetchApi.mockReset()
  })

  describe('getProjects', () => {
    it('returns projects with default options', async () => {
      mockFetchApi.mockResolvedValue(mockApiResponse)

      const result = await getProjects()

      expect(mockFetchApi).toHaveBeenCalledWith('/projects', {
        populate: 'deep',
        pagination: {
          page: 1,
          pageSize: 6,
        },
        filters: {},
      })
      expect(result).toEqual(mockApiResponse)
    })

    it('returns projects with custom page', async () => {
      mockFetchApi.mockResolvedValue(mockApiResponse)

      const result = await getProjects({ page: 2 })

      expect(mockFetchApi).toHaveBeenCalledWith('/projects', {
        populate: 'deep',
        pagination: {
          page: 2,
          pageSize: 6,
        },
        filters: {},
      })
      expect(result).toEqual(mockApiResponse)
    })

    it('returns projects with category filter', async () => {
      mockFetchApi.mockResolvedValue(mockApiResponse)

      const result = await getProjects({ category: 'Commercial' })

      expect(mockFetchApi).toHaveBeenCalledWith('/projects', {
        populate: 'deep',
        pagination: {
          page: 1,
          pageSize: 6,
        },
        filters: {
          category: {
            name: {
              $eq: 'Commercial',
            },
          },
        },
      })
      expect(result).toEqual(mockApiResponse)
    })

    it('returns empty result when no data', async () => {
      mockFetchApi.mockResolvedValue({ data: null })

      const result = await getProjects()

      expect(result).toEqual({
        data: [],
        meta: {
          pagination: {
            pageCount: 0,
          },
        },
      })
    })

    it('returns empty result when fetchApi returns null', async () => {
      mockFetchApi.mockResolvedValue(null)

      const result = await getProjects()

      expect(result).toEqual({
        data: [],
        meta: {
          pagination: {
            pageCount: 0,
          },
        },
      })
    })
  })
})