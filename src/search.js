const ago = require('s-ago')

const CappedClient = require('./lib/cappedClient')

module.exports = (pluginContext) => {
  return (query, env = {}) => {
    const clipCollection = new CappedClient()

    return clipCollection.all().then((allClips) => {
      if (query === '') {
        return allClips.slice(0, 10)
      }
      return allClips.filter((clip) => {
        return clip.raw.indexOf(query) !== -1
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
