import React, { memo } from 'react'
import { arrayOf, string } from 'prop-types'

import { wordList } from '../css'

const WordList = ({ words }) => {
  return (
    <ul className={wordList}>
      {words.map(word => (
        <li key={word}>{word}</li>
      ))}
    </ul>
  )
}

WordList.propTypes = {
  words: arrayOf(string)
}

export { WordList }

export default memo(WordList)
