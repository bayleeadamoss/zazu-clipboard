const ago = require('s-ago')
const Color = require('color')

module.exports = (allClips) => {
  return allClips.map((clip) => {
    if (clip.type === 'text') {
      const isHexColor = clip.raw.match(/^#([0-9a-f]{3}){1,2}$/i)
      const response = {
        title: clip.raw,
        value: clip._id,
        preview: `
          <pre class="text">${clip.raw}</pre>
          <div class="meta">${ago(new Date(clip.createdAt))}<br />${clip.raw.length} characters</div>
        `
      }
      if (isHexColor) {
        const color = new Color(clip.raw)
        const colorType = color.dark() ? 'dark' : 'light'
        response.preview = `
          <pre
            class="text color ${colorType}"
            style="background-color: ${clip.raw};">${clip.raw}</pre>
          <div class="meta ${colorType}">
            ${ago(new Date(clip.createdAt))}<br />${clip.raw.length} characters
          </div>
        `
      }
      return response
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
