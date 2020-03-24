import { CELL_STATE, between } from '../lib/grid'

const RESET_BOARD = '@@board/reest'
const DISABLE_FLAG = '@@board/disable-flag'
const SET_FLAG = '@@board/set-flag'
const SELECTED = '@@board/selected'
const FINISHED = '@@board/finished'

export const resetBoard = ({ board }) => ({ type: RESET_BOARD, board })

export const disableFlag = ({ flag }) => ({ type: DISABLE_FLAG, flag })

export const setFlag = ({ indexes, flag }) => ({
  type: SET_FLAG,
  indexes,
  flag
})

export const setSelected = ({ xmax, start, end }) => ({
  type: SELECTED,
  xmax,
  start,
  end
})

export const setFinished = ({ indexes, flag }) => ({
  type: FINISHED,
  indexes,
  flag
})

const reducers = {
  // reset state from above
  [RESET_BOARD]: (_, { board }) => board,

  // remove a flag if it exists on any cell
  [DISABLE_FLAG]: (state, { flag }) =>
    state.map(cell =>
      cell.state & flag ? { ...cell, state: cell.state & ~flag } : cell
    ),

  // set the specified on the specified indexes
  [SET_FLAG]: (state, { indexes, flag }) =>
    state.map((cell, index) =>
      indexes.includes(index) ? { ...cell, state: cell.state | flag } : cell
    ),

  // use xor to figure out if we need to flip the SELECTED bit.
  // this is - (match and notHasFlag) OR (notMatch and hasFlag)
  // javascript needs numbers for the XOR operator, so wrap in Number
  [SELECTED]: (state, { xmax, start, end }) => {
    const cells = between({ board: state, xmax, start, end })
    const indexes = cells.map(cell => cell.index)
    return state.map((cell, index) =>
      Number(indexes.includes(index)) ^
      Number(Boolean(cell.state & CELL_STATE.SELECTED))
        ? { ...cell, state: (cell.state ^= CELL_STATE.SELECTED) }
        : cell
    )
  },

  // need to set all selected cells on selection finish
  // remove SELECTED flag and INVALID (if was invalid)
  [FINISHED]: (state, { indexes, flag }) => {
    return state.map((cell, index) =>
      indexes.includes(index)
        ? { ...cell, state: (cell.state & ~CELL_STATE.SELECTED) | flag }
        : cell
    )
  }
}

export default (state, action) => {
  const reducer = reducers[action.type]
  if (reducer) return reducer(state, action)
  return state
}
