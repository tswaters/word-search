import React, { memo, useContext } from 'react'

import { wordList, found as foundWordClass } from '../css'
import { GameContext } from './Game'

const WordList = () => {
  const { placedWords, foundWords } = useContext(GameContext)
  return (
    <ul className={wordList}>
      {Object.keys(placedWords)
        .sort()
        .map(word => (
          <li
            key={word}
            className={foundWords.includes(word) ? foundWordClass : ''}
          >
            <span>{word}</span>
          </li>
        ))}
    </ul>
  )
}

export { WordList }

export default memo(WordList)
