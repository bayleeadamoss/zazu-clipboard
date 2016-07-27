const dnode = require('dnode')

class CappedClient {
  constructor () {
    this.client = dnode(null, {weak: false}).connect(26126);
    this.client.on('remote', (cappedCollection) => {
      this.cappedCollection = cappedCollection
    })
  }

  close () {
    this.client.end()
  }

  _connection () {
    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        if (this.cappedCollection) {
          clearInterval(interval)
          resolve()
        }
      }, 100)
    })
  }

  last () {
    return this._connection().then(() => {
      return new Promise((resolve, reject) => {
        this.cappedCollection.last(resolve)
      })
    })
  }

  findOne (_id) {
    return this._connection().then(() => {
      return new Promise((resolve, reject) => {
        this.cappedCollection.findOne(_id, resolve)
      })
    })
  }

  upsert (doc, userOptions) {
    return this._connection().then(() => {
      return new Promise((resolve, reject) => {
        this.cappedCollection.upsert(doc, userOptions, resolve)
      })
    })
  }

  all () {
    return this._connection().then(() => {
      return new Promise((resolve, reject) => {
        this.cappedCollection.all(resolve)
      })
    })
  }
}

module.exports = CappedClient
