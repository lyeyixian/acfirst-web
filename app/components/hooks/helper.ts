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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [func, ...deps])
}

export function useDebounceSearchParams(delay: number) {
  const [debouncedSearchParams, setDebouncedSearchParams] = useSearchParams()
  const [search, setSearch] = useState<Record<string, any>>(
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
            ;(value as string[]).forEach((code) => {
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
  }, [search, delay, setDebouncedSearchParams])

  return [search, setSearch] as const
}
