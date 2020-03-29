import { useState, useCallback, useRef, useContext } from 'react'
import { GameContext } from '../components/Game'

const useMouseTracking = ({ onChange, onFinish, onAbort }) => {
  const { xmax, ymax } = useContext(GameContext)

  const start = useRef(null)
  const end = useRef(null)

  // the board rect might mutate over time (changing xmax/ymax) alters css/dimensions
  // as such, need a reference to the dom node so we can call `getBoundingClientRect`
  const [boardNode, setBoardNode] = useState(null)
  const ref = useCallback(domNode => domNode && setBoardNode(domNode), [])

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
      onChange({ start: start.current, end: end.current })
    },
    [getPosition, onChange]
  )

  const handleMouseUp = useCallback(() => {
    onFinish({ start: start.current, end: end.current })
    start.current = null
    end.current = null
  }, [onFinish])

  const handleMouseLeave = useCallback(() => {
    if (start.current == null) return
    onAbort()
    start.current = null
    end.current = null
  }, [onAbort])

  return {
    ref,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave
  }
}

export { useMouseTracking }
