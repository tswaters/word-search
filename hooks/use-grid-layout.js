import { useRef, useLayoutEffect, useMemo, useContext } from 'react'
import { GameContext } from '../components/Game'

const useGridLayout = () => {
  const gridRef = useRef(null)
  const { xmax, cellWidth, cellHeight, onDimsChanged } = useContext(GameContext)

  useLayoutEffect(() => {
    onDimsChanged(gridRef.current.getBoundingClientRect())
  })

  return useMemo(
    () => ({
      gridRef,
      gridStyles: {
        '--grid-xmax': xmax,
        '--overlay-height': `${Math.min(cellWidth, cellHeight)}px`,
        '--cell-width': `${cellWidth}px`,
        '--cell-height': `${cellHeight}px`,
      },
    }),
    [gridRef, xmax, cellWidth, cellHeight]
  )
}

export { useGridLayout }
