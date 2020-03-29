import { CELL_STATE } from '../lib/grid'

const RESET_BOARD = '@@board/reest'
const DISABLE_FLAG = '@@board/disable-flag'
const SET_FOUND = '@@board/set-found'
const SELECTED = '@@board/selected'
const FINISHED = '@@board/finished'

export const resetBoard = opts => ({ type: RESET_BOARD, ...opts })

export const disableFlag = opts => ({ type: DISABLE_FLAG, ...opts })

export const setFound = opts => ({ type: SET_FOUND, ...opts })

export const setSelected = opts => ({ type: SELECTED, ...opts })

export const setFinished = opts => ({ type: FINISHED, ...opts })

const reducers = {
  // reset state from above
  [RESET_BOARD]: (_, { board }) => board,

  // remove a flag if it exists on any cell
  [DISABLE_FLAG]: (state, { flag }) =>
    state.map(cell =>
      cell.state & flag ? { ...cell, state: cell.state & ~flag } : cell
    ),

  // sets found on all defined indexes
  [SET_FOUND]: (state, { indexes }) =>
    state.map((cell, index) =>
      indexes.includes(index)
        ? { ...cell, state: cell.state | CELL_STATE.FOUND }
        : cell
    ),

  // use xor to figure out if the specified flag needs to be flipped.
  // * if the user drags off a selected cell, it should have it's flag flipped
  // * if the cell is closed within index, and doesn't have the flag, it's flag should be flipped
  // that set of conditions is XOR, which I've used below. It's a more terse way of saying:
  //  (indexes.includes(index) AND notHasFlag) OR (indexes.includes(index) AND hasFlag)
  // in cases returning true, need to toggle the defined flag.
  // unfortunately, while javascript can do this, it needs numbers for the XOR operator.
  // I don't like the casting options here, and I think using `Number` and `Boolean` is more clear.
  // Ah well, 9 lines of comments to explain should be enough to explain it to myself later.
  [SELECTED]: (state, { indexes }) =>
    state.map((cell, index) =>
      Number(indexes.includes(index)) ^
      Number(Boolean(cell.state & CELL_STATE.SELECTED))
        ? { ...cell, state: (cell.state ^= CELL_STATE.SELECTED) }
        : cell
    ),

  // need to set all selected cells on selection finish
  // remove SELECTED flag and add INVALID/FOUND
  [FINISHED]: (state, { indexes, found }) =>
    state.map((cell, index) =>
      indexes.includes(index)
        ? {
            ...cell,
            state:
              (cell.state & ~CELL_STATE.SELECTED) |
              (found ? CELL_STATE.FOUND : CELL_STATE.INVALID)
          }
        : cell
    )
}

export default (state, action) => {
  const reducer = reducers[action.type]
  if (reducer) return reducer(state, action)
  return state
}
