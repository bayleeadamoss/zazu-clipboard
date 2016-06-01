'use strict'

const clipboard = require('electron').clipboard
const CappedCollection = require('./lib/cappedCollection')

const clipCollection = new CappedCollection('clipCollection', 5)

// console.log('text', clipboard.readText())
// console.log('image empty', clipboard.readImage().isEmpty())

clipCollection.last().then((doc) => {
  const currentClip = clipboard.readText()
  if (!doc || doc.clip !== currentClip) {
    return clipCollection.insert({
      type: 'text/html',
      clip: currentClip,
    })
  }
}).then(() => {
  process.exit(0)
})
