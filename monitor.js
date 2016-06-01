'use strict';

const Datastore = require('nedb')

class CappedCollection {
  constructor (name, size) {
    this.MAX_SIZE = size
    this.collection = new Datastore({
      filename: './' + name + '.nedb',
      autoload: true,
    });
  }

  all () {
    return new Promise((accept) => {
      return this.collection
        .find({})
        .sort({ createdAt: 1 })
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
      const excessDocs = docs.slice(0, Math.max(0, docs.length - this.MAX_SIZE))
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

/*
  const clipboard = require('electron').clipboard
  setInterval(() => {
    console.log('text', clipboard.readText())
    console.log('html', clipboard.readHTML())
    console.log('rtf', clipboard.readRTF())
  }, 500)
*/
var clipboard = new CappedCollection('clipboard', 5)
clipboard.all().then((docs) => {
  console.log({docs})
  clipboard.insert({
    type: 'meow',
  })
})
