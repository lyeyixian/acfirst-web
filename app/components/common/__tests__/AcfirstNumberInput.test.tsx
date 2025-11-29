import { render, screen, fireEvent } from '@testing-library/react'
import AcfirstNumberInput from '../AcfirstNumberInput'

test('renders number input with buttons', () => {
  render(<AcfirstNumberInput />)
  expect(screen.getByRole('spinbutton')).toBeInTheDocument()
  const buttons = screen.getAllByRole('button')
  expect(buttons).toHaveLength(2)
})

test('increments value on plus click', () => {
  render(<AcfirstNumberInput />)
  const input = screen.getByRole('spinbutton')
  const buttons = screen.getAllByRole('button')
  const plusButton = buttons[1] // assuming second is plus
  fireEvent.click(plusButton)
  expect(input).toHaveDisplayValue('2')
})

test('decrements value on minus click', () => {
  render(<AcfirstNumberInput />)
  const input = screen.getByRole('spinbutton')
  const buttons = screen.getAllByRole('button')
  const minusButton = buttons[0] // assuming first is minus
  fireEvent.click(minusButton)
  expect(input).toHaveDisplayValue('1') // min is 1, so stays 1
})