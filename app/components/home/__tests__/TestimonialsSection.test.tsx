import { render, screen } from '@testing-library/react'
import TestimonialsSection from '../TestimonialsSection'

const mockReviews = [
  {
    author_name: 'John Doe',
    profile_photo_url: 'john.jpg',
    rating: 5,
    relative_time_description: '2 days ago',
    text: 'Great products!',
  },
  {
    author_name: 'Jane Smith',
    profile_photo_url: 'jane.jpg',
    rating: 4,
    relative_time_description: '1 week ago',
    text: 'Very satisfied.',
  },
]

test('renders testimonials section with reviews', () => {
  render(<TestimonialsSection reviews={mockReviews} />)
  expect(screen.getByText('Testimonials')).toBeInTheDocument()
  expect(screen.getByText('What our customers say')).toBeInTheDocument()
  expect(screen.getByText('John Doe')).toBeInTheDocument()
  expect(screen.getByText('Jane Smith')).toBeInTheDocument()
  expect(screen.getByText('Great products!')).toBeInTheDocument()
  expect(screen.getByText('Very satisfied.')).toBeInTheDocument()
  expect(screen.getByText('See More ...')).toBeInTheDocument()
})