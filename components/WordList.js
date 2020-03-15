import React, { memo } from 'react'
import { arrayOf, string } from 'prop-types'

import { wordList, found as foundWordClass } from '../css'

const WordList = ({ words, foundWords }) => {
  const getClassname = word => {
    if (foundWords.includes(word)) {
      return foundWordClass
    }
    return ''
  }

  return (
    <ul className={wordList}>
      {words.map(word => (
        <li className={getClassname(word)} key={word}>
          {word}
        </li>
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
