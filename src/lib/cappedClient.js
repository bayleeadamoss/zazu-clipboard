const ipc = require('./ipc')

class CappedClient {
  last () {
    return new Promise((resolve, reject) => {
      ipc.emit('last', resolve)
    })
  }

  findOne (_id) {
    return new Promise((resolve, reject) => {
      ipc.emit('findOne', _id, resolve)
    })
  }

  upsert (doc, userOptions) {
    return new Promise((resolve, reject) => {
      ipc.emit('upsert', doc, userOptions, resolve)
    })
  }

  all () {
    return new Promise((resolve, reject) => {
      ipc.emit('all', resolve)
    })
  }
}

module.exports = CappedClient
