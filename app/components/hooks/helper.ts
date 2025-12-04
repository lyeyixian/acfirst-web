import { useSearchParams } from '@remix-run/react'
import { useEffect, useRef, useState } from 'react'

export const useEffectAfterMount = (func: () => void, deps: any[] = []) => {
  const didMount = useRef(false)

  useEffect(() => {
    if (didMount.current) {
      func()
    } else {
      didMount.current = true
    }
  }, deps)
}

export function useDebounceSearchParams(delay: number) {
  const [debouncedSearchParams, setDebouncedSearchParams] = useSearchParams()
  const [search, setSearch] = useState<Record<string, any>>(() => {
    const params: Record<string, any> = {}
    for (const [key, value] of debouncedSearchParams.entries()) {
      if (key === 'codes') {
        if (!params[key]) params[key] = []
        params[key].push(value)
      } else {
        params[key] = value
      }
    }
    return params
  })

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchParams((params) => {
        // reset the search params everytime there is a change, to overwrite everything
        params = new URLSearchParams()
        Object.entries(search).forEach(([key, value]) => {
          if (key === 'codes') {
            // if key is codes, the value will be a list
            ; (value as string[]).forEach((code) => {
              params.append(key, code)
            })
          } else {
            params.set(key, value as string)
          }
        })

        return params
      })
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [search, delay])

  return [search, setSearch] as const
}
