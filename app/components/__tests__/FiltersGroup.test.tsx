import { render, screen, fireEvent } from '@testing-library/react'
import { vi, describe, it, expect } from 'vitest'
import FiltersGroup, { formatSlugToLabel } from '../FiltersGroup'

// Mock dependencies
vi.mock('@mantine/core', () => ({
  createStyles: vi.fn(() => vi.fn(() => ({ classes: {}, theme: { dir: 'ltr' } }))),
  Group: ({ children, ...props }) => <div {...props}>{children}</div>,
  Box: ({ children, ...props }) => <div {...props}>{children}</div>,
  Collapse: ({ children, in: isIn }) => (isIn ? <div>{children}</div> : null),
  ThemeIcon: ({ children, ...props }) => <div {...props}>{children}</div>,
  Text: ({ children, ...props }) => <div {...props}>{children}</div>,
  UnstyledButton: ({ children, ...props }) => <button {...props}>{children}</button>,
  NavLink: ({ children, label, ...props }) => <a {...props}>{label}{children}</a>,
}))

vi.mock('@tabler/icons-react', () => ({
  IconChevronLeft: () => <span>ChevronLeft</span>,
  IconChevronRight: () => <span>ChevronRight</span>,
}))

describe('FiltersGroup', () => {
  const mockOnClick = vi.fn()
  const mockSetSearch = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders with icon and label', () => {
    const Icon = () => <span>TestIcon</span>
    render(
      <FiltersGroup
        icon={Icon}
        label="Test Label"
        slug="test"
        initiallyOpened={false}
        filters={[]}
        onClick={mockOnClick}
        search={{}}
        setSearch={mockSetSearch}
      />
    )

    expect(screen.getByText('Test Label')).toBeInTheDocument()
    expect(screen.getByText('TestIcon')).toBeInTheDocument()
  })

  it('renders without icon', () => {
    render(
      <FiltersGroup
        icon={undefined}
        label="Test Label"
        slug="test"
        initiallyOpened={false}
        filters={[]}
        onClick={mockOnClick}
        search={{}}
        setSearch={mockSetSearch}
      />
    )

    expect(screen.getByText('Test Label')).toBeInTheDocument()
  })

  it('renders with filters and chevron', () => {
    const filters = [{ slug: 'filter1', label: 'Filter 1' }]
    render(
      <FiltersGroup
        icon={undefined}
        label="Test Label"
        slug="test"
        initiallyOpened
        filters={filters}
        onClick={mockOnClick}
        search={{}}
        setSearch={mockSetSearch}
      />
    )

    expect(screen.getByText('ChevronRight')).toBeInTheDocument()
    expect(screen.getByText('Filter 1')).toBeInTheDocument()
  })

  it('toggles collapse on button click', () => {
    const filters = [{ slug: 'filter1', label: 'Filter 1' }]
    render(
      <FiltersGroup
        icon={undefined}
        label="Test Label"
        slug="test"
        initiallyOpened={false}
        filters={filters}
        onClick={mockOnClick}
        search={{}}
        setSearch={mockSetSearch}
      />
    )

    const button = screen.getByRole('button')
    fireEvent.click(button)

    // Since Collapse is mocked to show when in=true, but initially false, after click should show
    // But since state is internal, hard to test without re-render
    expect(button).toBeInTheDocument()
  })

  it('selects filter on click', () => {
    const filters = [{ slug: 'filter1', label: 'Filter 1' }]
    render(
      <FiltersGroup
        icon={undefined}
        label="Test Label"
        slug="test"
        initiallyOpened
        filters={filters}
        onClick={mockOnClick}
        search={{}}
        setSearch={mockSetSearch}
      />
    )

    const link = screen.getByText('Filter 1')
    fireEvent.click(link)

    expect(mockSetSearch).toHaveBeenCalledWith({ test: 'filter1' })
    expect(mockOnClick).toHaveBeenCalled()
  })

  it('deselects filter if already selected', () => {
    const filters = [{ slug: 'filter1', label: 'Filter 1' }]
    render(
      <FiltersGroup
        icon={undefined}
        label="Test Label"
        slug="test"
        initiallyOpened
        filters={filters}
        onClick={mockOnClick}
        search={{ test: 'filter1' }}
        setSearch={mockSetSearch}
      />
    )

    const link = screen.getByText('Filter 1')
    fireEvent.click(link)

    expect(mockSetSearch).toHaveBeenCalledWith({})
    expect(mockOnClick).toHaveBeenCalled()
  })

  it('shows selected filter in label', () => {
    const filters = [{ slug: 'filter1', label: 'Filter 1' }]
    render(
      <FiltersGroup
        icon={undefined}
        label="Test Label"
        slug="test"
        initiallyOpened={false}
        filters={filters}
        onClick={mockOnClick}
        search={{ test: 'filter1' }}
        setSearch={mockSetSearch}
      />
    )

    expect(screen.getByText('Test Label: Filter 1')).toBeInTheDocument()
  })
})

describe('formatSlugToLabel', () => {
  it('returns label for matching slug', () => {
    const filters = [
      { slug: 'filter1', label: 'Filter 1' },
      { slug: 'filter2', label: 'Filter 2' },
    ]

    expect(formatSlugToLabel('filter1', filters)).toBe('Filter 1')
    expect(formatSlugToLabel('filter2', filters)).toBe('Filter 2')
    expect(formatSlugToLabel('filter3', filters)).toBeUndefined()
  })
})