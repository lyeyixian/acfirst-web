import { useContext, useEffect } from 'react'
import { ClientStyleContext } from '../context'
import { useEmotionCache } from '@mantine/core'

// fix for style disappearing on error
// https://github.com/correiarmjoao/remix-with-mantine
export function useCacheFix() {
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
}
