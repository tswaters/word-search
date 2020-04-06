import React, { memo, useContext } from 'react'

import { wordList, found as foundWordClass } from '../css'
import { GameContext } from './Game'

const WordList = () => {
  const { placed, found } = useContext(GameContext)
  return (
    <ul className={wordList}>
      {Object.keys(placed)
        .sort()
        .map(word => (
          <li key={word} className={found.includes(word) ? foundWordClass : ''}>
            <span>{word}</span>
          </li>
        ))}
    </ul>
  )
}

export { WordList }

export default memo(WordList)
