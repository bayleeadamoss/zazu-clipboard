'use strict';

const CappedCollection = require('./lib/cappedCollection')
const Score = require('./lib/score')

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
  return sortedClips.map((clip) => {
    if (clip.type === 'text') {
      return {
        title: clip.raw,
        value: clip._id,
      }
    } else if(clip.type === 'image') {
      return {
        title: clip.title,
        value: clip._id,
      }
    }
  })
}).then((clips) => {
  console.log(JSON.stringify(clips))
  process.exit(0)
}).catch((err) => {
  console.log(err, err.stack)
  process.exit(1)
})
