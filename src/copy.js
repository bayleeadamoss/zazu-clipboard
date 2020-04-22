const path = require('path')
const CappedClient = require('./lib/cappedClient')
const { clipboard, nativeImage } = require('electron')

/**
 * Given an id, copy the data to the clipboard.
 */
module.exports = (pluginContext) => {
  const { cwd } = pluginContext

  return (id) => {
    const clipCollection = CappedClient.init(cwd, {})
    return clipCollection.findOne(id).then((clip) => {
      if (clip.type === 'text') {
        clipboard.writeText(clip.raw)
      } else if (clip.type === 'image') {
        const image = nativeImage.createFromPath(path.resolve(cwd, clip.raw))
        clipboard.writeImage(image)
      }
    })
  }
}
