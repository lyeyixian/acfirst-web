import { renderHook } from '@testing-library/react'
import { vi, describe, it, expect } from 'vitest'
import { useCacheFix } from '../fixes'

// Mock the context
const mockReset = vi.fn()
vi.mock('../context', () => ({
  ClientStyleContext: {
    Provider: ({ children }: { children: React.ReactNode }) => children,
    Consumer: ({ children }: { children: (value: any) => React.ReactNode }) => children(null),
  },
}))

// Mock useEmotionCache
const mockCache = {
  sheet: {
    container: null,
    tags: [{}, {}],
    flush: vi.fn(),
    _insertTag: vi.fn(),
  },
}
vi.mock('@mantine/core', () => ({
  useEmotionCache: vi.fn(() => mockCache),
}))

// Mock React's useContext
vi.mock('react', async () => {
  const actual = await vi.importActual('react')
  return {
    ...actual,
    useContext: vi.fn(() => ({ reset: mockReset })),
  }
})

describe('useCacheFix', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockCache.sheet.container = null
    mockCache.sheet.flush.mockClear()
    mockCache.sheet._insertTag.mockClear()
    mockReset.mockClear()
  })

  it('sets cache sheet container to document.head', () => {
    renderHook(() => useCacheFix())

    expect(mockCache.sheet.container).toBe(document.head)
  })

  it('flushes the cache sheet', () => {
    renderHook(() => useCacheFix())

    expect(mockCache.sheet.flush).toHaveBeenCalled()
  })

  it('re-inserts all tags', () => {
    renderHook(() => useCacheFix())

    expect(mockCache.sheet._insertTag).toHaveBeenCalledTimes(2)
    expect(mockCache.sheet._insertTag).toHaveBeenCalledWith({})
    expect(mockCache.sheet._insertTag).toHaveBeenCalledWith({})
  })

  it('calls reset on client style data', () => {
    renderHook(() => useCacheFix())

    expect(mockReset).toHaveBeenCalled()
  })
})