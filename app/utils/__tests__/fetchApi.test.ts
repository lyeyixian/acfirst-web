import { vi, describe, it, expect, beforeEach } from 'vitest'
import { fetchApi } from '../api/fetchApi'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

// Mock environment variables
vi.stubEnv('STRAPI_API_TOKEN', 'test-token')
vi.stubEnv('STRAPI_URL_BASE', 'https://api.example.com')

describe('fetchApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('builds correct URL with path and query params', async () => {
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue({ data: 'test' }),
    }
    mockFetch.mockResolvedValue(mockResponse)

    await fetchApi('/test-path', { param1: 'value1', param2: 'value2' })

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.example.com/api/test-path?param1=value1&param2=value2',
      expect.any(Object)
    )
  })

  it('builds correct URL without query params', async () => {
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue({ data: 'test' }),
    }
    mockFetch.mockResolvedValue(mockResponse)

    await fetchApi('/test-path')

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.example.com/api/test-path',
      expect.any(Object)
    )
  })

  it('sets correct headers including authorization', async () => {
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue({ data: 'test' }),
    }
    mockFetch.mockResolvedValue(mockResponse)

    await fetchApi('/test-path')

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-token',
        },
      }
    )
  })

  it('merges custom options with default headers', async () => {
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue({ data: 'test' }),
    }
    mockFetch.mockResolvedValue(mockResponse)

    await fetchApi('/test-path', {}, { method: 'POST', body: 'test-body' })

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-token',
        },
        method: 'POST',
        body: 'test-body',
      }
    )
  })

  it('returns data on successful response', async () => {
    const mockData = { data: 'success' }
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue(mockData),
    }
    mockFetch.mockResolvedValue(mockResponse)

    const result = await fetchApi('/test-path')

    expect(result).toEqual(mockData)
  })

  it('throws error on non-ok response', async () => {
    const mockResponse = {
      ok: false,
      status: 404,
      statusText: 'Not Found',
    }
    mockFetch.mockResolvedValue(mockResponse)

    const result = await fetchApi('/test-path')

    expect(result).toBeNull()
  })

  it('returns null on fetch error', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'))

    const result = await fetchApi('/test-path')

    expect(result).toBeNull()
  })
})