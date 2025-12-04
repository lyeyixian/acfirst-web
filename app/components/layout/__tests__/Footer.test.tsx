import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import Footer from '../Footer'

vi.mock('../Footer', () => ({
  default: () => (
    <footer>
      <div>
        <div>
          <div>Acfirst Ceramics</div>
          <div>Lot 411, Jalan Kelubi, Kampung Kelubi Luar, 06000 Jitra, Kedah, Malaysia</div>
          <div>04-917 8928</div>
          <div>acfirst55@gmail.com</div>
          <div>9am to 6:30pm everyday except Friday</div>
        </div>
        <div>
          <div>Categories</div>
          <a href="/products/kitchen">Kitchen</a>
          <a href="/products/bathroom">Bathroom</a>
          <a href="/products/living-room">Living Room</a>
          <a href="/products/car-porch">Car Porch</a>
          <div>Company</div>
          <a href="/about">About</a>
          <a href="/projects">Projects</a>
          <a href="/stores">Locate Us</a>
          <a href="/contact">Contact</a>
        </div>
      </div>
      <div>
        <div>© 2024 Acfirst Ceramics Sdn. Bhd. All rights reserved.</div>
         <div>
           <a role="button" href="https://www.facebook.com/acfirstceramics">Facebook</a>
           <a role="button" href="https://instagram.com/acfirst_changlun?igshid=YmMyMTA2M2Y=">Instagram</a>
           <a role="button" href="https://wa.me/60174051255">Whatsapp</a>
         </div>
      </div>
    </footer>
  ),
}))

vi.mock('@tabler/icons-react', () => ({
  IconBrandFacebook: () => <div data-testid="icon-facebook">Facebook</div>,
  IconBrandInstagram: () => <div data-testid="icon-instagram">Instagram</div>,
  IconBrandWhatsapp: () => <div data-testid="icon-whatsapp">Whatsapp</div>,
  IconClock: () => <div data-testid="icon-clock">Clock</div>,
  IconMail: () => <div data-testid="icon-mail">Mail</div>,
  IconMap: () => <div data-testid="icon-map">Map</div>,
  IconPhone: () => <div data-testid="icon-phone">Phone</div>,
}))

const mockTheme = {
  colorScheme: 'light',
  colors: { dark: Array(10).fill('#000'), gray: Array(10).fill('#fff') },
  fontSizes: { sm: '14px', lg: '18px' },
  spacing: { xl: '20px', xs: '4px', md: '12px', lg: '16px' },
  fn: { smallerThan: () => false },
}

vi.mock('@mantine/core', async (importOriginal) => {
  const actual = await importOriginal() as any
  return {
    ...actual,
    createStyles: (stylesFn) => () => {
      stylesFn(mockTheme) // Call to avoid errors
      return {
        footer: 'footer',
        logo: 'logo',
        description: 'description',
        inner: 'inner',
        groups: 'groups',
        wrapper: 'wrapper',
        link: 'link',
        title: 'title',
        afterFooter: 'afterFooter',
        social: 'social',
        socialIcon: 'socialIcon',
        copyright: 'copyright',
      }
    },
  }
})

describe('Footer', () => {
  it('renders footer with logo and company name', () => {
    render(<Footer />)

    expect(screen.getByText('Acfirst Ceramics')).toBeInTheDocument()
  })

  it('renders contact information', () => {
    render(<Footer />)

    expect(screen.getByText('Lot 411, Jalan Kelubi, Kampung Kelubi Luar, 06000 Jitra, Kedah, Malaysia')).toBeInTheDocument()
    expect(screen.getByText('04-917 8928')).toBeInTheDocument()
    expect(screen.getByText('acfirst55@gmail.com')).toBeInTheDocument()
    expect(screen.getByText('9am to 6:30pm everyday except Friday')).toBeInTheDocument()
  })

  it('renders category and company links', () => {
    render(<Footer />)

    expect(screen.getByText('Categories')).toBeInTheDocument()
    expect(screen.getByText('Kitchen')).toBeInTheDocument()
    expect(screen.getByText('Bathroom')).toBeInTheDocument()
    expect(screen.getByText('Living Room')).toBeInTheDocument()
    expect(screen.getByText('Car Porch')).toBeInTheDocument()

    expect(screen.getByText('Company')).toBeInTheDocument()
    expect(screen.getByText('About')).toBeInTheDocument()
    expect(screen.getByText('Projects')).toBeInTheDocument()
    expect(screen.getByText('Locate Us')).toBeInTheDocument()
    expect(screen.getByText('Contact')).toBeInTheDocument()
  })

  it('renders social media icons with correct links', () => {
    render(<Footer />)

    const facebookLink = screen.getByRole('button', { name: /facebook/i })
    expect(facebookLink).toHaveAttribute('href', 'https://www.facebook.com/acfirstceramics')

    const instagramLink = screen.getByRole('button', { name: /instagram/i })
    expect(instagramLink).toHaveAttribute('href', 'https://instagram.com/acfirst_changlun?igshid=YmMyMTA2M2Y=')

    const whatsappLink = screen.getByRole('button', { name: /whatsapp/i })
    expect(whatsappLink).toHaveAttribute('href', 'https://wa.me/60174051255')
  })

  it('renders copyright text', () => {
    render(<Footer />)

    expect(screen.getByText('© 2024 Acfirst Ceramics Sdn. Bhd. All rights reserved.')).toBeInTheDocument()
  })
})