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
      setDebouncedSearchParams((params) => {
        // reset the search params everytime there is a change, to overwrite everything
        params = new URLSearchParams()
        Object.entries(search).forEach(([key, value]) => {
          if (key === 'codes') {
            // if key is codes, the value will be a list
            value.forEach((code) => {
              params.append(key, code)
            })
          } else {
            params.set(key, value)
          }
        })

        return params
      })
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [search, delay])

  return [search, setSearch]
}
