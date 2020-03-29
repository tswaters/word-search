import { useEffect, useRef } from 'react'

// this basically wraps useEffect
// it'll avoid firing the first time (i.e., first/initial value received)

const useEffectAvoidInit = (cb, deps) => {
  const initializedRef = useRef(false)
  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true
    } else {
      cb()
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, deps)
}

export { useEffectAvoidInit }
