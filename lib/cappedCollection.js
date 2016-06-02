'use strict'

const Datastore = require('nedb')

class CappedCollection {
  constructor (name, size) {
    this.MAX_SIZE = size || 99999
    this.collection = new Datastore({
      filename: './data/' + name + '.nedb',
      autoload: true,
    });
  }

  last () {
    return new Promise((accept) => {
      return this.collection
        .findOne({})
        .sort({ createdAt: -1 })
        .exec((err, docs) => {
          err ? reject(err) : accept(docs)
        })
    })
  }

  all () {
    return new Promise((accept) => {
      return this.collection
        .find({})
        .sort({ createdAt: -1 })
        .exec((err, docs) => {
          err ? reject(err) : accept(docs)
        })
    })
  }

  remove (ids) {
    return new Promise((accept) => {
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

  insert (doc) {
    doc.createdAt = doc.createdAt || new Date()
    return new Promise((accept) => {
      this.collection.insert(doc, (err) => {
        err ? reject(err) : accept()
      })
    }).then(() => {
      return this.reduce()
    })
  }
}

module.exports = CappedCollection
