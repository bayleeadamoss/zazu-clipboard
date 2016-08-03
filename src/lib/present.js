const ago = require('s-ago')

module.exports = (allClips) => {
  return allClips.map((clip) => {
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
}
