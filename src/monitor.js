'use strict'

const electron = require('electron')
const readableFormat = require('./lib/readableFormat')
const CappedCollection = require('./lib/cappedCollection')


const { clipboard, nativeImage } = electron

const clipCollection = new CappedCollection('clipCollection', 50)

/**
 * Checks to see if the current item in your clipboard should be added to the
 * capped collection or not. If so, adds it.
 */
electron.app.on('will-quit', () => {
  clipCollection.last().then((lastClip) => {
    const clip = {}
    clip.type = clipboard.readImage().isEmpty() ? 'text' : 'image'

    if (clip.type === 'image') {
      const image = clipboard.readImage()
      const dimensions = image.getSize()
      const size = readableFormat(image.toDataURL().length * 0.75)
      clip.title = `Image: ${dimensions.width}x${dimensions.height} (${size.value}${size.unit})`
      clip.raw = image.toDataURL()
    } else {
      clip.raw = clipboard.readText()
    }
    if (!lastClip || lastClip.type !== clip.type || lastClip.raw !== clip.raw) {
      return clipCollection.insert(clip)
    }
  }).then(() => {
    process.exit(0)
  }).catch((err) => {
    console.log(err, err.stack)
    process.exit(1)
  })
  require('deasync').loopWhile(() => true)
})

console.log('going')
electron.app.quit()
