import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'
import { MantineProvider, createEmotionCache } from '@mantine/core'
import { StylesPlaceholder } from '@mantine/remix'
import { theme } from './theme'
import AppContainer from './components/layout/AppContainer'
import { Notifications } from '@mantine/notifications'
import { ModalsProvider } from '@mantine/modals'

export const meta = () => ({
  charset: 'utf-8',
  title: 'Acfirst Ceramics',
  viewport: 'width=device-width,initial-scale=1',
})

export const links = () => {
  return [{ rel: 'icon', href: '/logo.png' }]
}

createEmotionCache({ key: 'mantine' })

export default function App() {
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

// TODO: add error handling
// issue with error boundary: https://github.com/remix-run/remix/issues/1136
// https://github.com/mui/material-ui/pull/30592
// https://github.com/mui/material-ui/issues/30436#issuecomment-1003339715
// https://github.com/correiarmjoao/remix-with-mantine
