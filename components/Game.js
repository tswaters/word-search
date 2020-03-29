import React, { createContext, useMemo, memo, useCallback } from 'react'
import { oneOfType, node, arrayOf, number, string } from 'prop-types'

import { game } from '../css/index'
import * as allWords from '../dict'
import { populate } from '../lib/grid'
import { random } from '../lib/random'
import { useStorage } from '../hooks/storage'
import { useEffectAvoidInit } from '../hooks/use-effect-avoid-init'

export const GameContext = createContext(null)

const Game = ({ children, xmax, ymax, seed, wordSet }) => {
  const { board, placedWords } = useMemo(
    () =>
      populate({
        xmax: xmax,
        ymax: ymax,
        rnd: random(seed),
        source: allWords[wordSet],
        fill: true
      }),
    [seed, xmax, ymax, wordSet]
  )

  const [foundWords, setFoundWords] = useStorage('foundWords', [])

  // reset found words to nothing when we get a new board
  // this doesn't fire during initialization because it would clear the initial found words
  useEffectAvoidInit(() => setFoundWords([]), [
    setFoundWords,
    seed,
    xmax,
    ymax,
    wordSet
  ])

  const handleFoundWords = useCallback(
    newWords => {
      setFoundWords(prev => {
        const items = new Set(prev)
        newWords.forEach(item => items.add(item))
        return Array.from(items)
      })
    },
    [setFoundWords]
  )

  const ctx = useMemo(
    () => ({
      xmax,
      ymax,
      board,
      placedWords,
      foundWords,
      onFoundWords: handleFoundWords
    }),
    [xmax, ymax, board, placedWords, handleFoundWords, foundWords]
  )

  return (
    <GameContext.Provider value={ctx}>
      <div className={game}>{children}</div>
    </GameContext.Provider>
  )
}

Game.propTypes = {
  children: oneOfType([node, arrayOf(node)]),
  xmax: number.isRequired,
  ymax: number.isRequired,
  seed: number.isRequired,
  wordSet: string.isRequired
}

export { Game }

export default memo(Game)
