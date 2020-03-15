import { useState, useCallback, useRef } from 'react'

const useMouseTracking = ({
  opts,
  cellWidth,
  onSelectionChange,
  onSelectionFinish
}) => {
  const start = useRef(null)
  const end = useRef(null)

  // the board rect might mutate over time (changing xmax/ymax) alters css/dimensions
  // as such, need a reference to the dom node so we can call `getBoundingClientRect`
  const [boardNode, setBoardNode] = useState(null)
  const boardRef = useCallback(domNode => domNode && setBoardNode(domNode), [])

  const getPosition = useCallback(
    e => {
      const { x, y } = boardNode.getBoundingClientRect()
      return (
        Math.floor((e.clientX - x) / cellWidth) +
        Math.floor((e.clientY - y) / cellWidth) * opts.xmax
      )
    },
    [opts, boardNode, cellWidth]
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
      onSelectionChange({ start: start.current, end: end.current })
    },
    [getPosition, onSelectionChange]
  )

  const handleMouseUp = useCallback(() => {
    onSelectionFinish({ start: start.current, end: end.current })
    start.current = null
    end.current = null
  }, [onSelectionFinish])

  return {
    boardRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  }
}

export { useMouseTracking }
