import { useState, useCallback, useRef } from 'react'

const useMouseTracking = ({ opts: { xmax, ymax }, change, finish, abort }) => {
  const start = useRef(null)
  const end = useRef(null)

  // the board rect might mutate over time (changing xmax/ymax) alters css/dimensions
  // as such, need a reference to the dom node so we can call `getBoundingClientRect`
  const [boardNode, setBoardNode] = useState(null)
  const boardRef = useCallback(domNode => domNode && setBoardNode(domNode), [])

  const getPosition = useCallback(
    e => {
      const { x, y, width, height } = boardNode.getBoundingClientRect()
      const cellWidth = width / xmax
      const cellHeight = height / ymax
      const cellX = Math.floor((e.clientX - x) / cellWidth)
      const cellY = Math.floor((e.clientY - y) / cellHeight)
      return cellX + cellY * xmax
    },
    [xmax, ymax, boardNode]
  )

  const handleMouseDown = useCallback(
    e => {
      start.current = end.current = getPosition(e)
    },
    [getPosition]
  )

  const handleMouseMove = useCallback(
    e => {
      if (start.current == null) return
      const newEnd = getPosition(e)
      if (newEnd === end.current) return
      end.current = newEnd
      change({ start: start.current, end: end.current })
    },
    [getPosition, change]
  )

  const handleMouseUp = useCallback(() => {
    finish({ start: start.current, end: end.current })
    start.current = null
    end.current = null
  }, [finish])

  const handleMouseLeave = useCallback(() => {
    if (start.current == null) return
    abort()
    start.current = null
    end.current = null
  }, [abort])

  return {
    boardRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave
  }
}

export { useMouseTracking }
