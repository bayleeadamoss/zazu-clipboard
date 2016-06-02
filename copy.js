'use strict';

const clipboard = require('electron').clipboard
const nativeImage = require('electron').nativeImage
const CappedCollection = require('./lib/cappedCollection')

const id = process.argv.slice(-1)[0]
const clipCollection = new CappedCollection('clipCollection')

/**
 * Given an id, coyp the data to the clipboard.
 */
clipCollection.findOne(id).then((clip) => {
  if (clip.type === 'text') {
    clipboard.writeText(clip.raw)
  } else if(clip.type === 'image') {
    const image = nativeImage.createFromDataURL(clip.raw)
    clipboard.writeImage(image)
  }
  process.exit(0)
}).catch((err) => {
  console.log(err, err.stack)
  process.exit(1)
})
