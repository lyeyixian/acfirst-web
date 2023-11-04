import { useEffect, useState } from 'react'

export const useSkeletonLoading = (ref) => {
  const [loading, setLoading] = useState(true)
  const handler = () => {
    // mimic network latency
    setTimeout(() => {
      setLoading(false)
    }, 2000)
  }

  useEffect(() => {
    if (ref.current?.complete) {
      handler()
    }
  }, [ref.current?.complete])

  return { loading, handleOnLoad: handler }
}
