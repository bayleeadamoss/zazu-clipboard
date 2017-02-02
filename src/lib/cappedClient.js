const CappedCollection = require('./cappedCollection')

class CappedClient {
  constructor (cwd, env) {
    this.clipCollection = new CappedCollection('clipCollection', {
      cwd,
    })
    this.clipCollection.setSize(env.size || 50)
  }

  last () {
    return this.clipCollection.last()
  }

  findOne (_id) {
    return this.clipCollection.findOne(_id)
  }

  upsert (doc, userOptions) {
    return this.clipCollection.upsert(doc, userOptions)
  }

  all () {
    return this.clipCollection.all()
  }
}

var client = null
module.exports = {
  init: (cwd, env) => {
    if (!client) {
      client = new CappedClient(cwd, env)
    }
    return client
  },
}
