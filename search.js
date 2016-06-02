'use strict';

const CappedCollection = require('./lib/cappedCollection')
const Score = require('./lib/score')

const accuracy = 0.5
const query = process.argv.slice(-1)[0]
const scoreQuery = new Score(query, accuracy)
const clipCollection = new CappedCollection('clipCollection')

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
    return {
      title: clip.raw,
      value: clip.raw,
    }
  })
}).then((clips) => {
  console.log(clips)
  process.exit(0)
}).catch((err) => {
  console.log(err.stack)
  process.exit(0)
})
