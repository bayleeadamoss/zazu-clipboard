const ago = require('s-ago').default
const Color = require('color')
const { htmlEncode } = require('js-htmlencode')
const path = require('path')
const fs = require('fs')

module.exports = (allClips, options = {}) => {
  const { cwd } = options
  return allClips.map((clip) => {
    if (clip.type === 'text') {
      const isHexColor = clip.raw.match(/^#([0-9a-f]{3}){1,2}$/i)
      const response = {
        title: clip.raw,
        value: clip._id,
        preview: `
          <pre class='text'>${htmlEncode(clip.raw)}</pre>
          <div class='meta'>${ago(new Date(clip.createdAt))}<br />${clip.raw.length} characters</div>
        `,
      }
      if (isHexColor) {
        const color = Color(clip.raw)
        const colorType = color.isDark() ? 'dark' : 'light'
        response.preview = `
          <pre
            class='text color ${colorType}'
            style='background-color: ${clip.raw};'>${clip.raw}</pre>
          <div class='meta ${colorType}'>
            ${ago(new Date(clip.createdAt))}<br />${clip.raw.length} characters
          </div>
        `
      }
      return response
    } else if (clip.type === 'image') {
      let imageSrc = clip.raw
      let icon
      if (clip.raw.indexOf(path.join('data', 'image')) === 0) {
        //  if 'clip.raw' is a path instead of DataURL, then prefixed the plugin path to get full path
        const imageFile = path.join(cwd || '', clip.raw)
        //  Load the image and converted to DataURL format for <iframe> content
        const imageData = fs.readFileSync(imageFile)
        imageSrc = `data:image/png;base64,${imageData.toString('base64')}`
        //  Let icon be the image file
        icon = imageFile
      }
      return {
        icon,
        title: clip.title,
        value: clip._id,
        preview: `
          <img src='${imageSrc}' />
          <div class='meta'>${ago(new Date(clip.createdAt))}</div>
        `,
      }
    }
  })
}
