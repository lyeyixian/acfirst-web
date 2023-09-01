import { useEffect, useState } from 'react'

export const useSkeletonLoading = (ref) => {
  const [loading, setLoading] = useState(true)
  const handler = () => {
    setLoading(false)
  }

  useEffect(() => {
    if (ref.current?.complete) {
      handler()
    }
  }, [ref.current?.complete])

  return { loading, handleOnLoad: handler }
}
