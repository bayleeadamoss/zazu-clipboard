const ago = require('s-ago')

const Score = require('./lib/score')
const CappedClient = require('./lib/cappedClient')

/**
 * Given a query sorts the clips based on the score and returns them.
 */
module.exports = (pluginContext) => {
  return (query, env = {}) => {
    const accuracy = 0.5
    const scoreQuery = new Score(query, accuracy)
    const clipCollection = new CappedClient()

    return clipCollection.all().then((allClips) => {
      clipCollection.close()
      return allClips.map((clip) => {
        clip.score = scoreQuery.score(clip.raw)
        return clip
      })
    }).then((foundClips) => {
      return foundClips.slice(0, 40)
    }).then((slicedClips) => {
      if (query === '') {
        return slicedClips
      }
      return slicedClips.sort((a, b) => {
        return b.score - a.score
      })
    }).then((sortedClips) => {
      return sortedClips.map((clip) => {
        if (clip.type === 'text') {
          return {
            title: clip.raw,
            value: clip._id,
            preview: `
              <pre class="text">${clip.raw}</pre>
              <div class="meta">${ago(new Date(clip.createdAt))}<br />${clip.raw.length} characters</div>
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
    })
  }
}
