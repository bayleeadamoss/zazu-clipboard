const Datastore = require('nedb')
const path = require('path')

class CappedCollection {
  constructor (name, size, options) {
    this.MAX_SIZE = size || 99999
    this.collection = new Datastore({
      filename: path.join(options.cwd, 'data', name + '.nedb'),
      autoload: true,
    })
  }

  last () {
    return new Promise((accept, reject) => {
      return this.collection
        .findOne({})
        .sort({ createdAt: -1 })
        .exec((err, docs) => {
          err ? reject(err) : accept(docs)
        })
    })
  }

  findOne (_id) {
    return new Promise((accept, reject) => {
      return this.collection.findOne({_id})
        .exec((err, doc) => {
          err ? reject(err) : accept(doc)
        })
    })
  }

  upsert (doc, userOptions) {
    const options = Object.assign({}, {
      multi: false,
      upsert: true,
    }, userOptions)
    const compiledDoc = Object.assign({}, {
      createdAt: new Date()
    }, doc)
    return new Promise((accept, reject) => {
      this.collection.update(doc, compiledDoc, options, (err, numReplaced) => {
        err ? reject(err) : accept(numReplaced)
      })
    }).then(() => {
      return this.reduce()
    })
  }

  all () {
    return new Promise((accept, reject) => {
      return this.collection
        .find({})
        .sort({ createdAt: -1 })
        .exec((err, docs) => {
          err ? reject(err) : accept(docs)
        })
    })
  }

  remove (ids) {
    return new Promise((accept, reject) => {
      this.collection.remove({ _id: { $in: ids } }, { multi: true }, (err, num) => {
        err ? reject(err) : accept(num)
      })
    })
  }

  reduce () {
    return this.all().then((docs) => {
      const excessDocs = docs.reverse().slice(0, Math.max(0, docs.length - this.MAX_SIZE))
      const excessIds = excessDocs.map((doc) => doc._id)
      return this.remove(excessIds)
    })
  }
}

module.exports = CappedCollection
