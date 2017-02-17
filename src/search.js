const CappedClient = require('./lib/cappedClient')
const search = require('./lib/search')
const present = require('./lib/present')

module.exports = (pluginContext) => {
  const { cwd } = pluginContext
  return (query, env = {}) => CappedClient.init(cwd, env).all()
    .then((allClips) => search(query, allClips))
    .then((sortedClips) => present(sortedClips, pluginContext))
}
