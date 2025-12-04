import { renderHook, act } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { useEffectAfterMount, useDebounceSearchParams } from '../helper'

const mockUseSearchParams = vi.fn()
const mockSetSearchParams = vi.fn()

vi.mock('@remix-run/react', () => ({
  useSearchParams: () => [mockUseSearchParams(), mockSetSearchParams],
}))

describe('useEffectAfterMount', () => {
  it('does not call function on first mount', () => {
    const mockFunc = vi.fn()
    renderHook(() => useEffectAfterMount(mockFunc))

    expect(mockFunc).not.toHaveBeenCalled()
  })

  it('calls function on deps change after mount', () => {
    const mockFunc = vi.fn()
    let deps = [1]

    const { rerender } = renderHook(() => useEffectAfterMount(mockFunc, deps))

    expect(mockFunc).not.toHaveBeenCalled()

    deps = [2]
    rerender()

    expect(mockFunc).toHaveBeenCalledTimes(1)
  })
})

describe('useDebounceSearchParams', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('initializes with current search params', () => {
    const initialParams = new URLSearchParams('query=test&codes=a&codes=b')
    mockUseSearchParams.mockReturnValue(initialParams)

    const { result } = renderHook(() => useDebounceSearchParams(300))

    expect(result.current[0]).toEqual({
      query: 'test',
      codes: ['a', 'b'],
    })
  })

  it('debounces search params updates', async () => {
    const initialParams = new URLSearchParams()
    mockUseSearchParams.mockReturnValue(initialParams)

    const { result } = renderHook(() => useDebounceSearchParams(300))

    act(() => {
      result.current[1]({ query: 'new value' })
    })

    // Should not update immediately
    expect(mockSetSearchParams).not.toHaveBeenCalled()

    // Fast forward time
    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(mockSetSearchParams).toHaveBeenCalledTimes(1)
    const callArgs = mockSetSearchParams.mock.calls[0][0]
    expect(callArgs('new URLSearchParams()')).toEqual(new URLSearchParams('query=new%20value'))
  })

  it('handles codes array correctly', () => {
    const initialParams = new URLSearchParams()
    mockUseSearchParams.mockReturnValue(initialParams)

    const { result } = renderHook(() => useDebounceSearchParams(300))

    act(() => {
      result.current[1]({ codes: ['code1', 'code2'] })
    })

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(mockSetSearchParams).toHaveBeenCalledTimes(1)
    const callArgs = mockSetSearchParams.mock.calls[0][0]
    const params = callArgs(new URLSearchParams())
    expect(params.getAll('codes')).toEqual(['code1', 'code2'])
  })
})