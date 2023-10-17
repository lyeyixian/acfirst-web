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
  // to prevent cron job pinging from creating too many cart sessions
  if (new URL(request.url).pathname === '/healthcheck') {
    return json({ message: 'ok' })
  }

  const cartId = await getCartId(request)

  if (!cartId) {
    return await createCartSession(request)
  }

  const session = await getSession(request)
  session.set('cartId', cartId)

  return json(
    { cart: await getCart(cartId) }, // TODO: it is possible to have cartId, but can't find a cart. in that case we need to createCartSession again.
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

// TODO: don't show detail error message
export function ErrorBoundary() {
  useCacheFix()

  const error = useRouteError()
  let errorUI = null

  if (isRouteErrorResponse(error)) {
    errorUI = (
      <GracefulError status={error.status} statusText={error.statusText} />
    )
  } else if (error instanceof Error) {
    errorUI = (
      <GracefulError
        status={null}
        statusText="Unexpected Error"
        statusDescription={error.message}
      />
    )
  } else {
    errorUI = <GracefulError status={null} statusText="Unknown error" />
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
