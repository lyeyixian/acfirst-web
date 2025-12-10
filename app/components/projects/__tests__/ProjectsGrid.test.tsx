import { render, screen, fireEvent } from '@testing-library/react'
import { vi, describe, it, expect } from 'vitest'
import ProjectsGrid from '../ProjectsGrid'
import { modals } from '@mantine/modals'

// Mock dependencies
vi.mock('@mantine/core', () => ({
  createStyles: vi.fn(() => vi.fn(() => ({ classes: {} }))),
  SimpleGrid: ({ children, ...props }) => <div {...props}>{children}</div>,
  Card: ({ children, onClick, ...props }) => <div onClick={onClick} {...props}>{children}</div>,
  Image: ({ src, ...props }) => <img src={src} {...props} />,
  Text: ({ children, ...props }) => <div {...props}>{children}</div>,
  AspectRatio: ({ children, ...props }) => <div {...props}>{children}</div>,
  Skeleton: ({ children, visible, ...props }) => (
    <div data-testid="skeleton" data-visible={visible} {...props}>
      {children}
    </div>
  ),
}))

vi.mock('@mantine/modals', () => ({
  modals: {
    open: vi.fn(),
  },
}))

vi.mock('../ProjectModal', () => ({
  default: ({ title }) => <div>Modal: {title}</div>,
}))

vi.mock('../common/AcfirstSkeleton', () => ({
  default: ({ children }) => <div>{children(() => {}, null)}</div>,
}))

describe('ProjectsGrid', () => {
  it('renders grid with projects', () => {
    const projects = [
      { id: 1, title: 'Project 1', coverImgUrl: 'img1.jpg' },
      { id: 2, title: 'Project 2', coverImgUrl: 'img2.jpg' },
    ]
    render(<ProjectsGrid projects={projects} />)

    expect(screen.getByText('Project 1')).toBeInTheDocument()
    expect(screen.getByText('Project 2')).toBeInTheDocument()
    const images = screen.getAllByRole('img')
    expect(images).toHaveLength(2)
  })

  it('opens modal on card click', () => {
    const projects = [{ id: 1, title: 'Project 1', coverImgUrl: 'img1.jpg' }]
    render(<ProjectsGrid projects={projects} />)

    const card = screen.getByText('Project 1').closest('div')
    fireEvent.click(card)

    const mockedModals = vi.mocked(modals)
    expect(mockedModals.open).toHaveBeenCalledWith({
      children: expect.any(Object),
      centered: true,
      withCloseButton: false,
      padding: 0,
      radius: 'md',
      trapFocus: false,
    })
  })
})