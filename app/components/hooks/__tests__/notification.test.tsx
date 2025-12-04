import { renderHook } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { useNotification } from '../notification'
import { notifications } from '@mantine/notifications'

vi.mock('@mantine/notifications', () => ({
  notifications: {
    show: vi.fn(),
  },
}))

vi.mock('@tabler/icons-react', () => ({
  IconCheck: () => 'IconCheck',
  IconX: () => 'IconX',
}))

describe('useNotification', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows error notification when fetcher has error', () => {
    const fetcher = { state: 'idle', data: { error: 'Test error' } }
    const successMsg = 'Success message'
    const errorMsg = 'Error message'

    renderHook(() => useNotification(fetcher, successMsg, errorMsg))

    expect(notifications.show).toHaveBeenCalledWith({
      title: 'Error: Test error',
      message: errorMsg,
      color: 'red',
      icon: expect.any(Object),
      withBorder: true,
      styles: expect.any(Function),
    })
    expect(fetcher.data).toBeNull()
  })

  it('shows success notification when fetcher has no error', () => {
    const fetcher = { state: 'idle', data: { success: true } }
    const successMsg = 'Success message'
    const errorMsg = 'Error message'

    renderHook(() => useNotification(fetcher, successMsg, errorMsg))

    expect(notifications.show).toHaveBeenCalledWith({
      title: 'Success',
      message: successMsg,
      color: 'teal',
      icon: expect.any(Object),
      withBorder: true,
      styles: expect.any(Function),
    })
    expect(fetcher.data).toBeNull()
  })

  it('calls optional function after notification', () => {
    const fetcher = { state: 'idle', data: { success: true } }
    const mockFunc = vi.fn()

    renderHook(() => useNotification(fetcher, 'Success', 'Error', mockFunc))

    expect(mockFunc).toHaveBeenCalledTimes(1)
  })

  it('does not show notification when fetcher state is not idle', () => {
    const fetcher = { state: 'loading', data: { success: true } }

    renderHook(() => useNotification(fetcher, 'Success', 'Error'))

    expect(notifications.show).not.toHaveBeenCalled()
  })

  it('does not show notification when fetcher has no data', () => {
    const fetcher = { state: 'idle', data: null }

    renderHook(() => useNotification(fetcher, 'Success', 'Error'))

    expect(notifications.show).not.toHaveBeenCalled()
  })
})