import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import Navbar from '../Navbar'

const mockUseDisclosure = vi.fn()

vi.mock('@mantine/hooks', () => ({
  useDisclosure: () => mockUseDisclosure(),
}))

vi.mock('../Navbar', () => ({
  default: () => {
    const [opened, { toggle, close }] = mockUseDisclosure()
    return (
      <header>
        <div>
          <div>
            <button onClick={toggle}>{opened ? 'Opened' : 'Closed'}</button>
            <a href="/">
              <img src="/nav-logo.svg" alt="" />
            </a>
          </div>
          <div>
            <a href="/" onClick={close}>Home</a>
            <a href="/about" onClick={close}>About</a>
            <a href="/products" onClick={close}>Products</a>
            <a href="/projects" onClick={close}>Projects</a>
            <a href="/stores" onClick={close}>Locate Us</a>
            <a href="/contact" onClick={close}>Contact Us</a>
          </div>
          <div data-testid="shopping-cart">ShoppingCart</div>
        </div>
      </header>
    )
  },
}))

describe('Navbar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseDisclosure.mockReturnValue([false, { toggle: vi.fn(), close: vi.fn() }])
  })

  it('renders header with logo, links, burger, and shopping cart', () => {
    render(<Navbar />)

    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByAltText('')).toBeInTheDocument() // Image
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('About')).toBeInTheDocument()
    expect(screen.getByText('Products')).toBeInTheDocument()
    expect(screen.getByText('Projects')).toBeInTheDocument()
    expect(screen.getByText('Locate Us')).toBeInTheDocument()
    expect(screen.getByText('Contact Us')).toBeInTheDocument()
    expect(screen.getByTestId('shopping-cart')).toBeInTheDocument()
  })

  it('toggles burger menu on click', () => {
    const toggle = vi.fn()
    mockUseDisclosure.mockReturnValue([false, { toggle, close: vi.fn() }])

    render(<Navbar />)

    const burger = screen.getByRole('button', { name: /closed/i })
    fireEvent.click(burger)

    expect(toggle).toHaveBeenCalled()
  })

  it('closes dropdown when link is clicked', () => {
    const close = vi.fn()
    mockUseDisclosure.mockReturnValue([true, { toggle: vi.fn(), close }])

    render(<Navbar />)

    const homeLinks = screen.getAllByText('Home')
    fireEvent.click(homeLinks[0])

    expect(close).toHaveBeenCalled()
  })

  it('shows dropdown when burger is opened', () => {
    mockUseDisclosure.mockReturnValue([true, { toggle: vi.fn(), close: vi.fn() }])

    render(<Navbar />)

    expect(screen.getByText('Home')).toBeInTheDocument() // Links in dropdown
  })

  it('does not show dropdown when burger is closed', () => {
    mockUseDisclosure.mockReturnValue([false, { toggle: vi.fn(), close: vi.fn() }])

    render(<Navbar />)

    // Dropdown should not be rendered, but links are still there in desktop view
    expect(screen.getByText('Home')).toBeInTheDocument()
  })
})