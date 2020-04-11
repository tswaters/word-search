import { useRef, useLayoutEffect, useMemo, useContext } from 'react'
import { GameContext } from '../components/Game'

const useGridLayout = () => {
  const gridRef = useRef(null)
  const { xmax, ymax, cellWidth, cellHeight, onDimsChanged } = useContext(
    GameContext
  )

  useLayoutEffect(() => {
    onDimsChanged(gridRef.current.getBoundingClientRect())
  })

  return useMemo(
    () => ({
      gridRef,
      gridStyles: {
        '--grid-xmax': xmax,
        '--grid-ymax': ymax,
        '--overlay-height': `${Math.min(cellWidth, cellHeight)}px`,
        '--cell-width': `${cellWidth}px`,
        '--cell-height': `${cellHeight}px`
      }
    }),
    [gridRef, xmax, ymax, cellWidth, cellHeight]
  )
}

export { useGridLayout }
