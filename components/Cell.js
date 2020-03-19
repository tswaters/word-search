import React, { memo, useMemo } from 'react'
import { shape, string, number } from 'prop-types'

import {
  cell as cellClassName,
  found as foundClass,
  selected as selectedClass,
  invalid as invalidClass,
  letter as letterClass
} from '../css/index'

import { CELL_STATE } from '../lib/grid'

const Cell = ({ cell: { letter, state } }) => {
  const className = useMemo(() => {
    const classes = [cellClassName]
    if (state & CELL_STATE.SELECTED) classes.push(selectedClass)
    if (state & CELL_STATE.FOUND) classes.push(foundClass)
    if (state & CELL_STATE.INVALID) classes.push(invalidClass)
    return classes.join(' ')
  }, [state])

  return (
    <div className={className}>
      <span className={letterClass}>{letter ? letter : '\u00A0'}</span>
    </div>
  )
}

Cell.propTypes = {
  cell: shape({
    letter: string,
    state: number.isRequired
  }).isRequired
}

export { Cell }

export default memo(Cell)
