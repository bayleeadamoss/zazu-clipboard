const CappedClient = require('./lib/cappedClient')
const search = require('./lib/search')
const present = require('./lib/present')

module.exports = (pluginContext) => {
  const { cwd } = pluginContext
  return (query, env = {}) => {
    const clipCollection = CappedClient.init(cwd, env)

    return clipCollection.all().then((allClips) => {
      return search(query, allClips)
    }).then((sortedClips) => {
      return present(sortedClips)
    })
  }
}
