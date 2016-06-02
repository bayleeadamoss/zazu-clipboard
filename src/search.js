'use strict';

const CappedCollection = require('./lib/cappedCollection')
const Score = require('./lib/score')
const readableFormat = require('./lib/readableFormat')
const nativeImage = require('electron').nativeImage

const accuracy = 0.5
const query = process.argv.slice(-1)[0]
const scoreQuery = new Score(query, accuracy)
const clipCollection = new CappedCollection('clipCollection')

/**
 * Given a query sorts the clips based on the score and returns them.
 */
clipCollection.all().then((allClips) => {
  return allClips.map((clip) => {
    clip.score = scoreQuery.score(clip.raw)
    return clip
  })
}).then((foundClips) => {
  return foundClips.sort((a, b) => {
    return b.score - a.score
  }).slice(0, 3)
}).then((sortedClips) => {
  return sortedClips.reduce((memo, clip) => {
    if (clip.score > 0) {
      if (clip.type === 'text') {
        memo.push({
          title: clip.raw,
          value: clip._id,
        })
      } else if (clip.type === 'image') {
        const image = nativeImage.createFromDataURL(clip.raw)
        const dimensions = image.getSize()
        const size = readableFormat(clip.raw.length * 0.75)
        memo.push({
          title: `Image: ${dimensions.width}x${dimensions.height} (${size.value}${size.unit})`,
          value: clip._id,
        })
      }
    }
    return memo
  }, [])
}).then((clips) => {
  console.log(clips)
  process.exit(0)
}).catch((err) => {
  console.log(err, err.stack)
  process.exit(1)
})
