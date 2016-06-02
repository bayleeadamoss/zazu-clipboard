'use strict'

class Score {
  constructor(source, accuracy) {
    this.source = source || ''
    this.accuracy = accuracy
    this.regex = this.generateRegex(this.source)
  }

  generateRegex (value) {
    return new RegExp('.*?((' + this.grams(value).map((gram) => {
      return gram.split('').join(').*?(')
    }).join(')).*?|.*?((') + ')).*?', 'i')
  }

  grams (value) {
    const maxGramLen = value.length
    const minGramLen = Math.ceil(this.accuracy * maxGramLen)
    const values = []
    for (let currentLen = maxGramLen; currentLen >= minGramLen;currentLen--) {
      let endPos = maxGramLen - currentLen
      for (let startPos = 0; startPos <= endPos; startPos++) {
        values.push(value.substring(startPos, startPos + currentLen))
      }
    }
    return values
  }

  score (query) {
    query = query || ''
    const matches = (query.match(this.regex) || [])
      .reduce((memo, item) => {
        if (item && item.length > 0) {
          memo.push(item)
        }
        return memo
      }, [])
      .slice(1)


    const matchedSegment = matches[0] || ''
    const biggestGram = matches.slice(1).join('')
    const positiveScore = biggestGram.length / this.source.length
    const negativeScore = Math.abs(matchedSegment.length - biggestGram.length) / 100

    return Math.round((positiveScore - negativeScore) * 100)
  }
}

module.exports = Score
