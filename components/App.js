import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { hot } from 'react-hot-loader/root'
import { string } from 'prop-types'

import { container, menu, header, game } from '../css/index'
import Form from './Form'
import Board from './Board'
import WordList from './WordList'
import ButtonToggle from './ButtonToggle'

import * as words from '../dict'
import { random } from '../lib/random'
import { populate } from '../lib/grid'
import { LightSwitch } from './LightSwitch'
import { useStorage } from '../hooks/storage'

const App = ({ APP_VERSION }) => {
  const [opts, setOpts] = useStorage('wordSearch', {
    seed: 2,
    xmax: 15,
    ymax: 15,
    wordSet: 'space'
  })
  const [foundWords, setFoundWords] = useState([])

  useEffect(() => {
    document.documentElement.style.setProperty('--grid-xmax', opts.xmax)
    document.documentElement.style.setProperty('--grid-ymax', opts.ymax)
  }, [opts.xmax, opts.ymax])

  const handleNewGame = useCallback(
    newOpts => {
      setOpts({ ...newOpts, seed: Math.floor(Math.random() * 500) })
      setFoundWords([])
    },
    [setOpts]
  )

  const { board, placedWords } = useMemo(
    () =>
      populate({
        xmax: opts.xmax,
        ymax: opts.ymax,
        rnd: random(opts.seed),
        source: words[opts.wordSet],
        fill: true
      }),
    [opts.seed, opts.xmax, opts.ymax, opts.wordSet]
  )

  const availableWords = useMemo(() => Object.keys(placedWords).sort(), [
    placedWords
  ])

  const checkWord = useCallback(
    letters => {
      const possibilities = [letters.join(''), letters.reverse().join('')]
      const newWords = availableWords.filter(word =>
        possibilities.some(p => p.includes(word))
      )

      let words = []
      const theWord = newWords.find(word => word.length === letters.length)
      if (theWord != null) {
        words = newWords.filter(
          word => word === theWord.length || theWord.includes(word)
        )
      }

      if (words.length > 0)
        setFoundWords(foundWords => foundWords.concat(words))

      return words
    },
    [availableWords]
  )

  return (
    <div className={container}>
      <h1 className={header}>Word Search</h1>
      <div className={menu}>
        <ButtonToggle icon={['☰︎']} label={['Open Menu']}>
          <Form opts={opts} onNewGame={handleNewGame} />
        </ButtonToggle>
        <LightSwitch />
        <ButtonToggle icon={['❓︎']} label={['About']}>
          version: {APP_VERSION} game: {opts.seed}
        </ButtonToggle>
      </div>
      <div className={game}>
        <Board
          opts={opts}
          board={board}
          checkWord={checkWord}
          placedWords={placedWords}
        />
        <WordList words={availableWords} foundWords={foundWords} />
      </div>
    </div>
  )
}

App.propTypes = {
  APP_VERSION: string.isRequired
}

export default hot(App)
