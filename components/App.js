import React, { useState, useCallback } from 'react'
import { hot } from 'react-hot-loader/root'
import { string } from 'prop-types'

import { container, menu, header, game } from '../css/index'
import Form from './Form'
import Board from './Board'
import WordList from './WordList'
import ButtonToggle from './ButtonToggle'
import { LightSwitch } from './LightSwitch'
import { useStorage } from '../hooks/storage'

const App = ({ APP_VERSION }) => {
  const [opts, setOpts] = useStorage('wordSearch', {
    seed: 2,
    xmax: 20,
    ymax: 15,
    wordSet: 'space'
  })

  const [foundWords, setFoundWords] = useStorage('foundWords', [])
  const [availableWords, setAvailableWords] = useState([])

  const handleNewGame = useCallback(
    newOpts => {
      setOpts({ ...newOpts, seed: Math.floor(Math.random() * 500) })
      setFoundWords([])
    },
    [setOpts, setFoundWords]
  )

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

  const handleAvailableWord = useCallback(
    availableWords => setAvailableWords(availableWords),
    []
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
          onFoundWords={handleFoundWords}
          onAvailableWord={handleAvailableWord}
          initialWords={foundWords}
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
