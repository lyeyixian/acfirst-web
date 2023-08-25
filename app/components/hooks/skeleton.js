import { useEffect, useState } from 'react'

export const useSkeletonLoading = (complete) => {
  const [loading, setLoading] = useState(true)
  const handler = () => {
    setLoading(false)
  }

  useEffect(() => {
    if (complete) {
      handler()
    }
  }, [complete])

  return { loading, handleOnLoad: handler }
}
