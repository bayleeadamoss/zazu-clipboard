const CappedClient = require('./lib/cappedClient')
const search = require('./lib/search')
const present = require('./lib/present')

module.exports = (pluginContext) => {
  return (query, env = {}) => {
    const clipCollection = new CappedClient()

    return clipCollection.all().then((allClips) => {
      return search(query, allClips)
    }).then((sortedClips) => {
      return present(sortedClips)
    })
  }
}
