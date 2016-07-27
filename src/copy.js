const CappedClient = require('./lib/cappedClient')

/**
 * Given an id, coyp the data to the clipboard.
 */
module.exports = (pluginContext) => {
  const clipboard = pluginContext.clipboard
  const nativeImage = pluginContext.nativeImage

  return (id) => {
    const clipCollection = new CappedClient()
    return clipCollection.findOne(id).then((clip) => {
      if (clip.type === 'text') {
        clipboard.writeText(clip.raw)
      } else if(clip.type === 'image') {
        const image = nativeImage.createFromDataURL(clip.raw)
        clipboard.writeImage(image)
      }
    })
  }
}
