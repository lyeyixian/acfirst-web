import { useSearchParams } from '@remix-run/react'
import { useEffect, useRef, useState } from 'react'

export const useEffectAfterMount = (func, deps) => {
  const didMount = useRef(false)

  useEffect(() => {
    if (didMount.current) {
      func()
    } else {
      didMount.current = true
    }
  }, deps)
}

export function useDebounceSearchParams(delay) {
  const [debouncedSearchParams, setDebouncedSearchParams] = useSearchParams()
  const [search, setSearch] = useState(
    Object.fromEntries(debouncedSearchParams.entries())
  )

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchParams(search)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [search, delay])

  return [search, setSearch]
}
