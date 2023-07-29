import { RemixBrowser } from '@remix-run/react'
import { ClientProvider } from '@mantine/remix'
import { hydrateRoot } from 'react-dom/client'
import { useState } from 'react'
import { createEmotionCache } from '@mantine/core'
import { ClientStyleContext } from './context'
import { CacheProvider } from '@emotion/react'

function ClientCacheProvider({ children }) {
  const [cache, setCache] = useState(createEmotionCache({ key: 'css' }))
  function reset() {
    setCache(createEmotionCache({ key: 'css' }))
  }
  return (
    <ClientStyleContext.Provider value={{ reset }}>
      <CacheProvider value={cache}>{children}</CacheProvider>
    </ClientStyleContext.Provider>
  )
}

hydrateRoot(
  document,
  <ClientCacheProvider>
    <RemixBrowser />
  </ClientCacheProvider>
)
