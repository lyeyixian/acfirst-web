import { render, screen } from '@testing-library/react'
import { vi, describe, it, expect } from 'vitest'
import ContactIconsList, { ContactIcons } from '../ContactIconsList'

// Mock dependencies
vi.mock('@mantine/core', () => ({
  createStyles: vi.fn(() => vi.fn(() => ({ classes: {}, cx: vi.fn() }))),
  ThemeIcon: ({ children, ...props }) => <div {...props}>{children}</div>,
  Text: ({ children, ...props }) => <div {...props}>{children}</div>,
  SimpleGrid: ({ children, ...props }) => <div {...props}>{children}</div>,
  Box: ({ children, ...props }) => <div {...props}>{children}</div>,
  Stack: ({ children, ...props }) => <div {...props}>{children}</div>,
}))

vi.mock('@tabler/icons-react', () => ({
  IconSun: () => <span>IconSun</span>,
  IconPhone: () => <span>IconPhone</span>,
  IconMapPin: () => <span>IconMapPin</span>,
  IconAt: () => <span>IconAt</span>,
}))

describe('ContactIconsList', () => {
  it('renders the list with default data', () => {
    render(<ContactIconsList />)

    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('acfirst55@gmail.com')).toBeInTheDocument()
    expect(screen.getByText('Phone')).toBeInTheDocument()
    expect(screen.getByText('04-917 8928')).toBeInTheDocument()
    expect(screen.getByText('Address')).toBeInTheDocument()
    expect(screen.getByText('Working hours')).toBeInTheDocument()
  })

  it('renders with custom data', () => {
    const customData = [
      { title: 'Test', description: 'Desc', icon: () => <span>TestIcon</span> },
    ]

    render(<ContactIconsList data={customData} />)

    expect(screen.getByText('Test')).toBeInTheDocument()
    expect(screen.getByText('Desc')).toBeInTheDocument()
    expect(screen.getByText('TestIcon')).toBeInTheDocument()
  })

  it('renders with white variant', () => {
    render(<ContactIconsList variant="white" />)

    // Since variant is passed, but mocked, just check it renders
    expect(screen.getByText('Email')).toBeInTheDocument()
  })
})

describe('ContactIcons', () => {
  it('renders the contact icons grid', () => {
    render(<ContactIcons />)

    expect(screen.getAllByText('Email')).toHaveLength(2)
    expect(screen.getAllByText('Phone')).toHaveLength(2)
  })
})