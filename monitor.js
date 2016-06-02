'use strict'

const clipboard = require('electron').clipboard
const CappedCollection = require('./lib/cappedCollection')

const clipCollection = new CappedCollection('clipCollection', 50)

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
  process.exit(0)
})


PrefixScript
  connectiosn ['UserScript']
[
  {
    title: 'Image',
    subtitle: '<img src="base64" />',
    value: clip._id
  }
]
