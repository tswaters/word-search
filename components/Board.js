import React, {
  memo,
  useRef,
  useContext,
  useMemo,
  useState,
  useCallback,
  useEffect,
  useLayoutEffect
} from 'react'
import { unstable_batchedUpdates } from 'react-dom'
import {
  board as boardClassName,
  found as foundClassName,
  selected as selectedClassName,
  invalid as invalidClassName,
  cell as cellClassName
} from '../css/index'
import { useMouseTracking } from '../hooks/mouse-tracker'

import Overlay from './Overlay'
import { GameContext } from './Game'
import { range } from '../lib/grid'

const Board = () => {
  const {
    board,
    found,
    placed,
    onFound,
    xmax,
    ymax,
    onDimsChanged
  } = useContext(GameContext)

  const boardRef = useRef(null)
  const [removingInactive, setRemovingInactive] = useState(null)

  const [selection, setSelection] = useState(null)
  const [invalid, setInvalid] = useState(null)

  useLayoutEffect(() => {
    onDimsChanged(boardRef.current.getBoundingClientRect())
  })

  const available = useMemo(() => Object.keys(placed).sort(), [placed])

  const onAbort = useCallback(() => setSelection(null), [])

  const onChange = useCallback(selection => setSelection(selection), [])

  const onFinish = useCallback(
    selection => {
      const possibleWord = range({ board, xmax, selection })

      const foundWord = available.find(checkWord =>
        // user is allowed to select something even if they select it backwards
        [possibleWord.join(''), possibleWord.reverse().join('')].some(
          p => p === checkWord
        )
      )

      const found =
        foundWord == null
          ? []
          : // make sure to get words that are enclosed within the found word
            available.filter(
              word => word === foundWord || foundWord.includes(word)
            )

      setSelection(null)

      if (foundWord == null) {
        // sets a flag to reset invalid after a timeout
        // (this gives time for the invalid shake)
        setInvalid(selection)
        setRemovingInactive(true)
      } else {
        onFound(found)
      }
    },
    [board, xmax, available, onFound]
  )

  useEffect(() => {
    if (removingInactive === false) return
    const tid = setTimeout(
      () =>
        unstable_batchedUpdates(() => {
          setRemovingInactive(false)
          setInvalid(null)
        }),
      500
    )
    return () => clearTimeout(tid)
  }, [removingInactive])

  const {
    handleMouseDown,
    handleMouseLeave,
    handleMouseMove,
    handleMouseUp
  } = useMouseTracking({ onAbort, onChange, onFinish })

  return (
    <div
      ref={boardRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      className={boardClassName}
      style={{
        '--grid-xmax': xmax,
        '--grid-ymax': ymax
      }}
    >
      {selection && <Overlay className={selectedClassName} range={selection} />}

      {invalid && <Overlay className={invalidClassName} range={invalid} />}

      {found.map(word => (
        <Overlay key={word} className={foundClassName} range={placed[word]} />
      ))}

      {board.map((letter, index) => (
        <div key={index} className={cellClassName}>
          {letter ? letter : '\u00A0'}
        </div>
      ))}
    </div>
  )
}

export { Board }

export default memo(Board)
