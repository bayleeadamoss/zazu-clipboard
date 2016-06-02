'use strict'

const clipboard = require('electron').clipboard
const CappedCollection = require('./lib/cappedCollection')

const clipCollection = new CappedCollection('clipCollection', 50)

/**
 * Checks to see if the current item in your clipboard should be added to the
 * capped collection or not. If so, adds it.
 */
clipCollection.last().then((lastClip) => {
  const type = clipboard.readImage().isEmpty() ? 'text' : 'image'
  const raw = type === 'text' ? clipboard.readText() : clipboard.readImage().toDataURL()

  if (!lastClip || lastClip.type !== type || lastClip.raw !== raw) {
    return clipCollection.insert({
      type,
      raw,
    })
  }
}).then(() => {
  process.exit(0)
}).catch((err) => {
  console.log(err, err.stack)
  process.exit(1)
})
