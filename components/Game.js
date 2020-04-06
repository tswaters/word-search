import React, {
  createContext,
  memo,
  useState,
  useLayoutEffect,
  useCallback,
  useMemo
} from 'react'
import { number, string, arrayOf, func } from 'prop-types'

import { game } from '../css/index'
import * as allWords from '../dict'
import { populate } from '../lib/grid'
import { random } from '../lib/random'
import Board from './Board'
import WordList from './WordList'

export const GameContext = createContext(null)

const Game = ({ xmax, ymax, seed, wordSet, found, onFound }) => {
  // this is gross, but it seems to work.
  // the size of the board is dependent on this context (board component pulls `board` from here)
  // initially, it won't have any dimensions
  // (get around that with passing most of the initial state)
  // also, after opts change, the board might get bigger or smaller
  // so we need to track if separately.
  // (calculating width/height in the handler below would be based on the board's old dimensions)
  // so, in a useLayoutEffect inside the board, we fire onDimsChanged
  // if the width/height happen to change, we need to re-render things anyway.
  const [{ x, y, height, width }, setDimensions] = useState({
    x: 0,
    y: 0,
    height: 0,
    width: 0
  })

  const onDimsChanged = useCallback(
    newDims =>
      setDimensions(oldDims =>
        oldDims.width === newDims.height && oldDims.height === newDims.height
          ? oldDims
          : newDims
      ),
    []
  )

  const { board, placed } = useMemo(
    () =>
      populate({
        xmax,
        ymax,
        rnd: random(seed),
        source: allWords[wordSet],
        fill: true
      }),
    [seed, xmax, ymax, wordSet]
  )

  const [ctx, setCtx] = useState({
    xmax,
    ymax,
    x,
    y,
    cellWidth: 0,
    cellHeight: 0,
    onFound,
    found: [],
    onDimsChanged,
    board,
    placed
  })

  useLayoutEffect(() => {
    const setter = () => {
      setCtx({
        xmax,
        ymax,
        x,
        y,
        cellWidth: width / xmax,
        cellHeight: height / ymax,
        onFound,
        found,
        onDimsChanged,
        board,
        placed
      })
    }

    let tid = null
    const handler = () => {
      cancelAnimationFrame(tid)
      tid = requestAnimationFrame(setter)
    }

    window.addEventListener('resize', handler)
    setter()

    return () => {
      window.removeEventListener('resize', handler)
      cancelAnimationFrame(tid)
    }
  }, [
    onFound,
    found,
    xmax,
    ymax,
    x,
    y,
    width,
    height,
    onDimsChanged,
    board,
    placed
  ])

  return (
    <GameContext.Provider value={ctx}>
      <div className={game}>
        <Board />
        <WordList />
      </div>
    </GameContext.Provider>
  )
}

Game.propTypes = {
  xmax: number.isRequired,
  ymax: number.isRequired,
  seed: number.isRequired,
  wordSet: string.isRequired,
  found: arrayOf(string).isRequired,
  onFound: func.isRequired
}

export { Game }

export default memo(Game)
