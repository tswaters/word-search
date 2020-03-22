import React, { memo } from 'react'
import { arrayOf, string, bool } from 'prop-types'

import { wordList, found as foundWordClass } from '../css'

const Word = ({ word, found }) => {
  return (
    <li className={found ? foundWordClass : ''}>
      <span>{word}</span>
    </li>
  )
}

Word.propTypes = {
  word: string,
  found: bool
}

const WordList = ({ words, foundWords }) => {
  return (
    <ul className={wordList}>
      {words.map(word => (
        <Word key={word} word={word} found={foundWords.includes(word)} />
      ))}
    </ul>
  )
}

WordList.propTypes = {
  words: arrayOf(string),
  foundWords: arrayOf(string)
}

export { WordList }

export default memo(WordList)
