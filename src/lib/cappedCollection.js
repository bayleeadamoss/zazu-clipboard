const Datastore = require('nestdb')
const path = require('path')

class CappedCollection {
  constructor (name, options = {}) {
    this.MAX_SIZE = 99999
    this.collection = new Datastore({
      filename: path.join(options.cwd || '', 'data', name + '.nedb'),
      autoload: true,
    })
  }

  setSize (size) {
    this.MAX_SIZE = size
  }

  last () {
    return new Promise((resolve, reject) => {
      this.collection
        .findOne({})
        .sort({ createdAt: -1 })
        .exec((err, docs) => err ? reject(err) : resolve(docs))
    })
  }

  findOne (_id) {
    return new Promise((resolve, reject) => {
      this.collection
        .findOne({ _id })
        .exec((err, doc) => err ? reject(err) : resolve(doc))
    })
  }

  upsert (doc, userOptions) {
    const options = Object.assign({}, { multi: false, upsert: true }, userOptions)
    const compiledDoc = Object.assign({}, { createdAt: new Date() }, doc)
    return new Promise((resolve, reject) => {
      this.collection.update(
        doc,
        compiledDoc,
        options,
        (err, numReplaced) => err ? reject(err) : resolve(numReplaced))
    }).then(() => this.reduce())
  }

  all () {
    return new Promise((resolve, reject) => {
      this.collection
        .find({})
        .sort({ createdAt: -1 })
        .exec((err, docs) => err ? reject(err) : resolve(docs))
    })
  }

  setOnRemove (callback) {
    this.onRemove = callback
  }

  clearOnRemove () {
    this.onRemove = null
  }

  handleOnRemove (ids, callback) {
    return new Promise((resolve, reject) => {
      if (callback) {
        this.collection
          .find({ _id: { $in: ids } })
          .exec((err, docs) => {
            if (err) {
              reject(err)
            } else {
              //  the 'callback()' should return a Promise
              resolve(Promise.all(docs.map(doc => callback(doc))).then(() => ids))
            }
          })
      } else {
        resolve(ids)
      }
    })
  }

  remove (ids) {
    return this.handleOnRemove(ids, this.onRemove)
      .then(ids => new Promise((resolve, reject) => {
        this.collection.remove(
          { _id: { $in: ids } },
          { multi: true },
          (err, num) => err ? reject(err) : resolve(num))
      }))
  }

  reduce () {
    return this.all()
      .then((docs) => {
        const excessDocs = docs.reverse().slice(0, Math.max(0, docs.length - this.MAX_SIZE))
        const excessIds = excessDocs.map((doc) => doc._id)
        return this.remove(excessIds)
      })
  }
}

module.exports = CappedCollection
