import { useCallback, useRef, useContext, useMemo } from 'react'
import { GameContext } from '../components/Game'
import { between } from '../lib/grid'

const useMouseTracking = ({ onChange, onFinish, onAbort }) => {
  const { board, xmax, cellWidth, cellHeight, x, y } = useContext(GameContext)

  const start = useRef(null)
  const end = useRef(null)

  const getPosition = useCallback(
    (e) => {
      const cellX = Math.floor((e.clientX - x) / cellWidth)
      const cellY = Math.floor((e.clientY - y) / cellHeight)
      return cellX + cellY * xmax
    },
    [xmax, x, y, cellWidth, cellHeight]
  )

  const handleMouseDown = useCallback(
    (e) => {
      start.current = end.current = getPosition(e)
    },
    [getPosition]
  )

  const handleMouseMove = useCallback(
    (e) => {
      if (start.current == null) return
      const newEnd = getPosition(e)
      if (newEnd === end.current) return
      end.current = newEnd
      const [startIndex, endIndex] = between({
        board,
        xmax,
        start: start.current,
        end: end.current,
      })
      onChange({ startIndex, endIndex })
    },
    [getPosition, onChange, board, xmax]
  )

  const handleMouseUp = useCallback(() => {
    const [startIndex, endIndex] = between({
      board,
      xmax,
      start: start.current,
      end: end.current,
    })
    onFinish({ startIndex, endIndex })
    start.current = null
    end.current = null
  }, [onFinish, board, xmax])

  const handleMouseLeave = useCallback(() => {
    if (start.current == null) return
    onAbort()
    start.current = null
    end.current = null
  }, [onAbort])

  return useMemo(
    () => ({
      handleMouseDown,
      handleMouseMove,
      handleMouseUp,
      handleMouseLeave,
    }),
    [handleMouseDown, handleMouseMove, handleMouseUp, handleMouseLeave]
  )
}

export { useMouseTracking }
