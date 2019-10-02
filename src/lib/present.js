const ago = require('s-ago')
const Color = require('color')
const { htmlEncode } = require('js-htmlencode')
const path = require('path')
const fs = require('fs')

function present (allClips, options = {}) {
  const { cwd } = options
  return allClips.map((clip) => {
    if (clip.type === 'text') {
      const isHexColor = clip.raw.match(/^#([0-9a-f]{3}){1,2}$/i)
      const response = {
        title: clip.raw,
        subtitle: `${ago(new Date(clip.createdAt))}, ${clip.raw.length} characters`,
        value: clip._id,
        id: clip._id,
        preview: `
          <pre class="text">${htmlEncode(clip.raw)}</pre>
        `,
      }
      if (isHexColor) {
        const color = Color(clip.raw)
        const colorType = color.isDark() ? 'dark' : 'light'
        response.preview = `
          <pre
            class="text color ${colorType}"
            style="background-color: ${clip.raw};"
          >
            ${clip.raw}
          </pre>
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
        subtitle: ago(new Date(clip.createdAt)),
        id: clip._id,
        value: clip._id,
        preview: `
          <img src="${imageSrc}" />
        `,
      }
    }
  })
}

module.exports = present
