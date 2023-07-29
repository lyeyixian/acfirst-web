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
import {
  MantineProvider,
  createEmotionCache,
  useEmotionCache,
} from '@mantine/core'
import { StylesPlaceholder } from '@mantine/remix'
import { theme } from './theme'
import AppContainer from './components/layout/AppContainer'
import { Notifications } from '@mantine/notifications'
import { ModalsProvider } from '@mantine/modals'
import { useContext, useEffect } from 'react'
import { ClientStyleContext } from './context'

export const meta = () => ({
  charset: 'utf-8',
  title: 'Acfirst Ceramics',
  viewport: 'width=device-width,initial-scale=1',
})

export const links = () => {
  return [{ rel: 'icon', href: '/logo.png' }]
}

export default function App() {
  // fix for style disappearing on error
  // https://github.com/correiarmjoao/remix-with-mantine
  const clientStyleData = useContext(ClientStyleContext)
  const mantineCache = useEmotionCache()

  useEffect(() => {
    const cache = mantineCache
    cache.sheet.container = document.head
    const tags = cache.sheet.tags
    cache.sheet.flush()
    tags.forEach((tag) => {
      cache.sheet._insertTag(tag)
    })
    clientStyleData?.reset()
  }, [])

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
            <Notifications limit={5} />
            <AppContainer>
              <Outlet />
            </AppContainer>
            <ScrollRestoration
              getKey={(location, matches) => {
                const paths = ['/about', '/stores', '/contact']

                return paths.includes(location.pathname)
                  ? location.key
                  : location.pathname.includes('/products')
                  ? '/products'
                  : location.pathname
              }}
            />
            <Scripts />
            <LiveReload />
          </body>
        </html>
      </ModalsProvider>
    </MantineProvider>
  )
}

// TODO: add healthcheck route

// TODO: add error handling UI
export function ErrorBoundary() {
  const error = useRouteError()

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    )
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    )
  } else {
    return <h1>Unknown Error</h1>
  }
}
