import { render, screen } from '@testing-library/react'
import { vi, describe, it, expect } from 'vitest'
import Map from '../Map'

// Mock dependencies
vi.mock('@mantine/core', () => ({
  AspectRatio: ({ children, ...props }) => <div {...props}>{children}</div>,
  Skeleton: ({ children, visible, ...props }) => (
    <div data-testid="skeleton" data-visible={visible} {...props}>
      {children}
    </div>
  ),
  createStyles: vi.fn(() => vi.fn(() => ({ classes: {} }))),
}))

describe('Map', () => {
  it('renders iframe with src and skeleton visible initially', () => {
    render(<Map src="https://maps.google.com" />)

    const iframe = screen.getByTitle('Google Maps')
    expect(iframe).toHaveAttribute('src', 'https://maps.google.com')

    const skeleton = screen.getByTestId('skeleton') // Assuming we add data-testid
    expect(skeleton).toHaveAttribute('data-visible', 'true')
  })

  it('renders with different src', () => {
    render(<Map src="https://example.com/map" />)

    const iframe = screen.getByTitle('Google Maps')
    expect(iframe).toHaveAttribute('src', 'https://example.com/map')
  })
})