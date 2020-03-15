import React, { memo, useMemo } from 'react'
import { cell as cellType } from './_types'
import { cell as cellClassName, selected as selectedClass } from '../css/index'

import { CELL_STATE } from '../lib/grid'

const Cell = ({ cell }) => {
  const { letter, state } = cell

  const className = useMemo(() => {
    let ret = []
    if (state & CELL_STATE.SELECTED) ret.push(selectedClass)
    return `${cellClassName} ${ret.join(' ')}`
  }, [state])

  return <div className={className}>{letter ? letter : '\u00A0'}</div>
}

Cell.propTypes = {
  cell: cellType.isRequired
}

export { Cell }

export default memo(Cell)
