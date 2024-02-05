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
  const [_, setDebouncedSearchParams] = useSearchParams()
  const [search, setSearch] = useState({})

  useEffect(() => {
    const handler = setTimeout(() => {
      search.p = 1
      setDebouncedSearchParams(search)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [search, delay])

  return [search, setSearch]
}
