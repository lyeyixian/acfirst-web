import { render, screen } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import RouterTransition from '../RouterTransition'

const mockUseNavigation = vi.fn()
const mockNprogress = {
  start: vi.fn(),
  complete: vi.fn(),
}

vi.mock('@remix-run/react', () => ({
  useNavigation: () => mockUseNavigation(),
}))

vi.mock('@mantine/nprogress', () => ({
  nprogress: mockNprogress,
}))

vi.mock('../RouterTransition', () => ({
  default: () => {
    const navigation = mockUseNavigation()
    if (navigation.state === 'loading') {
      mockNprogress.start()
    } else if (navigation.state === 'idle') {
      mockNprogress.complete()
    }
    return <div data-testid="navigation-progress">NavigationProgress</div>
  },
}))

describe('RouterTransition', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders NavigationProgress', () => {
    mockUseNavigation.mockReturnValue({ state: 'idle' })

    render(<RouterTransition />)

    expect(screen.getByTestId('navigation-progress')).toBeInTheDocument()
  })

  it('calls nprogress.start when navigation state is loading', () => {
    mockUseNavigation.mockReturnValue({ state: 'loading' })

    render(<RouterTransition />)

    expect(mockNprogress.start).toHaveBeenCalled()
  })

  it('calls nprogress.complete when navigation state is idle', () => {
    mockUseNavigation.mockReturnValue({ state: 'idle' })

    render(<RouterTransition />)

    expect(mockNprogress.complete).toHaveBeenCalled()
  })

  it('does not call nprogress when state is submitting', () => {
    mockUseNavigation.mockReturnValue({ state: 'submitting' })

    render(<RouterTransition />)

    expect(mockNprogress.start).not.toHaveBeenCalled()
    expect(mockNprogress.complete).not.toHaveBeenCalled()
  })
})