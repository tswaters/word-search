import React, {
  memo,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react'
import { unstable_batchedUpdates } from 'react-dom'
import {
  selection as selectionClassName,
  selected as selectedClassName,
  invalid as invalidClassName,
  grid as gridClassName,
} from '../css/index'
import { useMouseTracking } from '../hooks/mouse-tracker'
import { useGridLayout } from '../hooks/use-grid-layout'

import Overlay from './Overlay'
import { GameContext } from './Game'

const Selection = () => {
  const { onWordSelected } = useContext(GameContext)
  const { gridRef, gridStyles } = useGridLayout()

  const [selection, setSelection] = useState(null)
  const [invalid, setInvalid] = useState(false)

  const onAbort = useCallback(() => setSelection(null), [])

  const onChange = useCallback((selection) => {
    setInvalid(false)
    setSelection(selection)
  }, [])

  const onFinish = useCallback(
    (selection) =>
      onWordSelected(selection) ? setSelection(null) : setInvalid(true),
    [onWordSelected]
  )

  useEffect(() => {
    if (!invalid) return
    const tid = setTimeout(
      () =>
        unstable_batchedUpdates(() => {
          setInvalid(false)
          setSelection(null)
        }),
      500
    )
    return () => clearTimeout(tid)
  }, [invalid])

  const {
    handleMouseDown,
    handleMouseLeave,
    handleMouseMove,
    handleMouseUp,
  } = useMouseTracking({ onAbort, onChange, onFinish })

  return (
    <div
      id="selection"
      ref={gridRef}
      style={gridStyles}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      className={`${selectionClassName} ${gridClassName}`}
    >
      {selection && (
        <Overlay
          className={invalid ? invalidClassName : selectedClassName}
          range={selection}
        />
      )}
    </div>
  )
}

export { Selection }

export default memo(Selection)
