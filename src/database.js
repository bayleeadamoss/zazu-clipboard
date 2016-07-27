const dnode = require('dnode')
const CappedCollection = require('./lib/cappedCollection')

module.exports = (pluginContext) => {

  const cwd = pluginContext.cwd
  const clipCollection = new CappedCollection('clipCollection', 50, {
    cwd,
  })

  dnode({
    last: (cb) => {
      clipCollection.last().then(cb)
    },
    findOne: (_id, cb) => {
      clipCollection.findOne(_id).then(cb)
    },
    upsert: (doc, userOptions, cb) => {
      clipCollection.upsert(doc, userOptions).then(cb)
    },
    all: (cb) => {
      clipCollection.all().then(cb)
    },
  }, {
    weak: false,
  }).listen(26126)

  return (env = {}) => {
    return Promise.resolve('ping')
  }
}
