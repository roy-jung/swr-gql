import { useCallback, useState, useEffect, useRef } from 'react'

const useInfiniteScroll = targetEl => {
  const observerRef = useRef(null)
  const isFirstRender = useRef(true)
  const [isIntersecting, setIntersecting] = useState(null)
  const [loadFinished, setLoadFinished] = useState(false)

  const getObserver = useCallback(() => {
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(entries => {
        const intersecting = entries.some(entry => entry.isIntersecting)
        if (isFirstRender.current && intersecting) {
          isFirstRender.current = false
          return
        }
        setIntersecting(intersecting)
      })
    }
    return observerRef.current
  }, [observerRef.current])

  const stopObserving = useCallback(() => {
    getObserver().disconnect()
  }, [])

  useEffect(() => {
    if (targetEl.current) getObserver().observe(targetEl.current)
    return stopObserving
  }, [targetEl.current])

  useEffect(() => {
    if (loadFinished) stopObserving()
  }, [loadFinished])

  return [isIntersecting, loadFinished, setLoadFinished]
}

export default useInfiniteScroll
