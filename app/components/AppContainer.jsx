import { AppShell, Container } from '@mantine/core'
import Navbar from './Navbar'
import Footer from './Footer'
import { useLocation } from '@remix-run/react'

export default function AppContainer({ children }) {
  const location = useLocation()

  return (
    <AppShell padding={0} header={<Navbar />} footer={<Footer />}>
      {location.pathname === '/' ? children : <Container>{children}</Container>}
    </AppShell>
  )
}
