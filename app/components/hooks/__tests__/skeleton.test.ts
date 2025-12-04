import { renderHook, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useSkeletonLoading } from '../skeleton'

describe('useSkeletonLoading', () => {
  it('starts with loading true', () => {
    const mockRef = { current: null }
    const { result } = renderHook(() => useSkeletonLoading(mockRef))

    expect(result.current.loading).toBe(true)
  })

  it('sets loading to false when ref complete', () => {
    const mockRef = { current: { complete: true } }
    const { result } = renderHook(() => useSkeletonLoading(mockRef))

    expect(result.current.loading).toBe(false)
  })

  it('handleOnLoad sets loading to false', () => {
    const mockRef = { current: null }
    const { result } = renderHook(() => useSkeletonLoading(mockRef))

    expect(result.current.loading).toBe(true)

    act(() => {
      result.current.handleOnLoad()
    })

    expect(result.current.loading).toBe(false)
  })

  it('updates when ref complete changes', () => {
    let complete = false
    const mockRef = { current: { get complete() { return complete } } }

    const { result, rerender } = renderHook(() => useSkeletonLoading(mockRef))

    expect(result.current.loading).toBe(true)

    complete = true
    rerender()

    expect(result.current.loading).toBe(false)
  })
})