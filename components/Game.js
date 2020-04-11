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
import { populate, range } from '../lib/grid'
import { random } from '../lib/random'
import Board from './Board'
import WordList from './WordList'
import Selection from './Selection'
import FoundWords from './FoundWords'

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
        oldDims.width === newDims.width && oldDims.height === newDims.height
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

  const onWordSelected = useCallback(
    selection => {
      const available = Object.keys(placed).sort()
      const possibleWord = range({ board, xmax, selection })

      // user is allowed to select something even if they select it backwards
      const checks = [possibleWord.join(''), possibleWord.reverse().join('')]
      const foundWord = available.find(word => checks.some(p => p === word))
      const isFound = foundWord != null

      if (foundWord) {
        onFound(
          available.filter(
            word => word === foundWord || foundWord.includes(word)
          )
        )
      }

      return isFound
    },
    [board, placed, xmax, onFound]
  )

  const [ctx, setCtx] = useState({
    xmax,
    x,
    y,
    cellWidth: 0,
    cellHeight: 0,
    found: [],
    onDimsChanged,
    onWordSelected,
    board,
    placed
  })

  useLayoutEffect(() => {
    const setter = () => {
      setCtx({
        xmax,
        x,
        y,
        cellWidth: width / xmax,
        cellHeight: height / ymax,
        found,
        onDimsChanged,
        onWordSelected,
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
    found,
    xmax,
    ymax,
    x,
    y,
    width,
    height,
    onDimsChanged,
    onWordSelected,
    board,
    placed
  ])

  return (
    <GameContext.Provider value={ctx}>
      <div className={game}>
        <Board />
        <Selection />
        <FoundWords />
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
