import { RemixBrowser } from '@remix-run/react'
import { hydrateRoot } from 'react-dom/client'
import { useState } from 'react'
import { createEmotionCache } from '@mantine/core'
import { ClientStyleContext } from './context'
import { CacheProvider } from '@emotion/react'

function ClientCacheProvider({ children }) {
  const [cache, setCache] = useState(createEmotionCache({ key: 'mantine' }))
  function reset() {
    setCache(createEmotionCache({ key: 'mantine' }))
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
