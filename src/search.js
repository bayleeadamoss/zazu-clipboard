'use strict';

const CappedCollection = require('./lib/cappedCollection')
const Score = require('./lib/score')
const ago = require('s-ago')

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
  }).slice(0, 10)
}).then((sortedClips) => {
  return sortedClips.map((clip) => {
    if (clip.type === 'text') {
      return {
        title: clip.raw,
        value: clip._id,
        preview: `
          <pre class="text">${clip.raw}</pre>
          <div class="meta">${ago(clip.createdAt)}<br />${clip.raw.length} characters</div>
        `,
      }
    } else if(clip.type === 'image') {
      return {
        title: clip.title,
        value: clip._id,
        preview: `
          <div class="meta">${ago(clip.createdAt)}<br />${clip.raw.length} characters</div>
        `,
      }
    }
  })
}).then((clips) => {
  console.log(JSON.stringify(clips))
}).catch((err) => {
  console.log(err, err.stack)
})
