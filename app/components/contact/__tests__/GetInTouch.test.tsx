import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import GetInTouch from '../GetInTouch'
import { vi } from 'vitest'

// Mock Remix hooks
const mockSubmit = vi.fn()
const mockNavigation = { state: 'idle' }
vi.mock('@remix-run/react', () => ({
  useSubmit: () => mockSubmit,
  useNavigation: () => mockNavigation,
}))

// Mock Mantine form
const mockForm = {
  onSubmit: vi.fn((fn) => (event) => fn({}, event)),
  getInputProps: vi.fn(() => ({})),
  reset: vi.fn(),
}
vi.mock('@mantine/form', () => ({
  useForm: () => mockForm,
}))

// Mock ContactIconsList
vi.mock('~/components/ContactIconsList', () => ({
  default: ({ data }) => <div data-testid="contact-icons">{data ? data.length : 0} icons</div>,
}))

const mockProps = {
  contactInfoTitle: 'Contact Us',
  contactInfoData: [],
  submitButtonData: { text: 'Send Message' },
}

test('renders contact form with title and fields', () => {
  render(<GetInTouch {...mockProps} />)
  expect(screen.getByText('Contact Us')).toBeInTheDocument()
  expect(screen.getByText('Get in touch')).toBeInTheDocument()
  expect(screen.getByRole('textbox', { name: /name/i })).toBeInTheDocument()
  expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument()
  expect(screen.getByRole('textbox', { name: /phone/i })).toBeInTheDocument()
  expect(screen.getByRole('textbox', { name: /message/i })).toBeInTheDocument()
  expect(screen.getByText('Send Message')).toBeInTheDocument()
})

test('submits form on button click', async () => {
  render(<GetInTouch {...mockProps} />)
  const button = screen.getByRole('button', { name: 'Send Message' })
  fireEvent.click(button)
  await waitFor(() => {
    expect(mockSubmit).toHaveBeenCalled()
  })
})
