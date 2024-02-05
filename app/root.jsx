import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
} from '@remix-run/react'
import { MantineProvider } from '@mantine/core'
import { StylesPlaceholder } from '@mantine/remix'
import { theme } from './theme'
import AppContainer from './components/layout/AppContainer'
import { Notifications } from '@mantine/notifications'
import { ModalsProvider } from '@mantine/modals'
import {
  commitSession,
  createCartSession,
  getCartId,
  getSession,
} from './session.server'
import { json } from '@remix-run/node'
import { getCart } from './models/cart.server'
import GracefulError from './components/GracefulError'
import { useCacheFix } from './utils/fixes'

export const meta = () => ({
  charset: 'utf-8',
  title: 'Acfirst Ceramics',
  viewport: 'width=device-width,initial-scale=1',
})

export const links = () => {
  return [{ rel: 'icon', href: '/title-logo.svg' }]
}

export const loader = async ({ request }) => {
  const cartId = await getCartId(request)

  if (!cartId) {
    return await createCartSession(request)
  }

  const cart = await getCart(cartId)

  if (!cart) {
    return await createCartSession(request)
  }

  const session = await getSession(request)
  session.set('cartId', cartId)

  return json(
    { cart },
    { headers: { 'Set-Cookie': await commitSession(session) } }
  )
}

export default function App() {
  useCacheFix()

  return (
    <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
      <ModalsProvider>
        <html lang="en">
          <head>
            <StylesPlaceholder />
            <Meta />
            <Links />
          </head>
          <body>
            <Notifications limit={5} position="bottom-center" />
            <AppContainer>
              <Outlet />
            </AppContainer>
            <ScrollRestoration />
            <Scripts />
            <LiveReload />
          </body>
        </html>
      </ModalsProvider>
    </MantineProvider>
  )
}

export function ErrorBoundary() {
  useCacheFix()

  const error = useRouteError()
  let errorUI = null

  console.error('Error Boundary Hit:', error)

  if (isRouteErrorResponse(error)) {
    errorUI = <GracefulError status={error.status} statusText={error.data} />
  } else if (error instanceof Error) {
    errorUI = (
      <GracefulError
        status={500}
        statusText="Unexpected Error"
        statusDescription={error.message}
      />
    )
  } else {
    errorUI = <GracefulError status={500} statusText="Unknown error" />
  }

  return (
    <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
      <html lang="en">
        <head>
          <title>Oops !!</title>
          <StylesPlaceholder />
          <Meta />
          <Links />
        </head>
        <body>
          <AppContainer>{errorUI}</AppContainer>
          <Scripts />
          <LiveReload />
        </body>
      </html>
    </MantineProvider>
  )
}
