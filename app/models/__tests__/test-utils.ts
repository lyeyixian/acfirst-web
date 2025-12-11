import { vi } from 'vitest'

// Mock fetchApi utility
export const mockFetchApi = vi.fn()

// Mock getStrapiMedia utility
export const mockGetStrapiMedia = vi.fn()

// Mock file system operations
export const mockFs = {
  writeFile: vi.fn(),
  readFile: vi.fn(),
}

// Mock path
export const mockPath = {
  resolve: vi.fn(),
}

// Mock global fetch
export const mockGlobalFetch = vi.fn()

// Setup mocks before imports
vi.mock('~/utils/api/fetchApi', () => ({
  fetchApi: mockFetchApi,
}))

vi.mock('~/utils/api/helper', () => ({
  getStrapiMedia: mockGetStrapiMedia,
}))

vi.mock('fs/promises', () => ({
  default: mockFs,
}))

vi.mock('path', () => ({
  default: mockPath,
}))

// Mock global fetch for testimonial tests
global.fetch = mockGlobalFetch

// Helper to reset all mocks
export const resetMocks = () => {
  vi.clearAllMocks()
  mockFetchApi.mockReset()
  mockGetStrapiMedia.mockReset()
  mockFs.writeFile.mockReset()
  mockFs.readFile.mockReset()
  mockPath.resolve.mockReset()
  mockGlobalFetch.mockReset()
}

// Common test data
export const mockCartData = {
  id: 1,
  attributes: {
    cartId: 'test-cart-id',
    cartItems: [
      {
        id: 1,
        name: 'Test Product',
        code: 'TEST001',
        size: '60x60',
        surface: 'Polished',
        type: 'Ceramic',
        category: 'Floor Tiles',
        imgUrl: 'https://example.com/image.jpg',
        quantity: 2,
      },
    ],
  },
}

export const mockProductData = {
  id: 1,
  attributes: {
    name: 'Test Product',
    code: 'TEST001',
    size: '60x60',
    surface: 'Polished',
    type: 'Ceramic',
    category: {
      data: {
        attributes: {
          name: 'Floor Tiles',
        },
      },
    },
    coverImg: {
      data: {
        attributes: {
          url: '/uploads/test-image.jpg',
        },
      },
    },
    viewCount: 10,
  },
}

export const mockApiResponse = {
  data: [mockCartData],
  meta: {
    pagination: {
      pageCount: 1,
    },
  },
}