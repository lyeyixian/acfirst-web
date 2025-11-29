import { render, screen } from '@testing-library/react'
import DeleteCartItemBtn from '../DeleteCartItemBtn'

// Mock Remix hooks
const MockForm = ({ children, ...props }) => <form {...props}>{children}</form>
vi.mock('@remix-run/react', () => ({
  useFetcher: () => ({ state: 'idle', Form: MockForm }),
}))

test('renders delete button with form', () => {
  render(<DeleteCartItemBtn code="test-code" />)
  expect(screen.getByRole('button')).toBeInTheDocument()
  expect(screen.getByDisplayValue('test-code')).toBeInTheDocument()
})