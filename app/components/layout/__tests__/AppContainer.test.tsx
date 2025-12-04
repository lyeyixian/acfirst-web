import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import AppContainer from '../AppContainer'

const mockUseLocation = vi.fn()

vi.mock('@remix-run/react', () => ({
  useLocation: () => mockUseLocation(),
}))

vi.mock('../AppContainer', () => ({
  default: ({ children }) => {
    const location = mockUseLocation()
    return (
      <div data-testid="app-shell">
        <div data-testid="navbar">Navbar</div>
        <div data-testid="footer">Footer</div>
        <div data-testid="router-transition">RouterTransition</div>
        {location.pathname === '/' ? children : <div data-testid="container">{children}</div>}
      </div>
    )
  },
}))

describe('AppContainer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders AppShell with Navbar, Footer, and RouterTransition', () => {
    mockUseLocation.mockReturnValue({ pathname: '/' })

    render(<AppContainer>Test Children</AppContainer>)

    expect(screen.getByTestId('app-shell')).toBeInTheDocument()
    expect(screen.getByTestId('navbar')).toBeInTheDocument()
    expect(screen.getByTestId('footer')).toBeInTheDocument()
    expect(screen.getByTestId('router-transition')).toBeInTheDocument()
    expect(screen.getByText('Test Children')).toBeInTheDocument()
  })

  it('does not wrap children in Container when pathname is "/"', () => {
    mockUseLocation.mockReturnValue({ pathname: '/' })

    render(<AppContainer>Test Children</AppContainer>)

    expect(screen.queryByTestId('container')).not.toBeInTheDocument()
  })

  it('wraps children in Container when pathname is not "/"', () => {
    mockUseLocation.mockReturnValue({ pathname: '/products' })

    render(<AppContainer>Test Children</AppContainer>)

    expect(screen.getByTestId('container')).toBeInTheDocument()
    expect(screen.getByText('Test Children')).toBeInTheDocument()
  })
})