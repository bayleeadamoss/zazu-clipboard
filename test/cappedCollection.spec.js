'use strict'

const expect = require('chai').expect
const CappedCollection = require('../lib/cappedCollection')
const fs = require('fs')
const path = require('path')

let subject
describe('CappedCollection', () => {
  describe('given a full capped collection of 5 items', () => {

    beforeEach((done) => {
      subject = new CappedCollection('test_items', 5)
      subject.insert({ name: 'first', createdAt: new Date(new Date() - 9 * 1000) })
        .then(() => {
          return subject.insert({ name: 'second', createdAt: new Date(new Date() - 8 * 1000) })
        })
        .then(() => {
          return subject.insert({ name: 'third', createdAt: new Date(new Date() - 7 * 1000) })
        })
        .then(() => {
          return subject.insert({ name: 'fourth', createdAt: new Date(new Date() - 6 * 1000) })
        })
        .then(() => {
          return subject.insert({ name: 'fifth', createdAt: new Date(new Date() - 5 * 1000) })
        }).then(done)
    })

    afterEach((done) => {
      subject.collection.remove({}, { multi: true }, () => {
        subject.all().then((docs) => {
          expect(docs.length).to.eq(0)
        }).then(done).catch((err) => {
          console.log(err, err.stack)
        })
      })
    })

    describe('last', (done) => {
      it('gives me back the last item added', (done) => {
        subject.last().then((doc) => {
          expect(doc).to.include({
            name: 'fifth'
          })
        }).then(done).catch((err) => {
          console.log(err, err.stack)
        })
      })
    })

    describe('remove', () => {
      it('gives me back the last item added', (done) => {
        subject.last().then((doc) => {
          expect(doc.name).to.eq('fifth')
          return subject.remove([doc._id])
        }).then(() => {
          return subject.last()
        }).then((doc) => {
          expect(doc.name).to.eq('fourth')
        }).then(done).catch((err) => {
          console.log(err, err.stack)
        })
      })
    })

    describe('all', () => {
      it('gives me all 5 items back', () => {
        subject.all().then((docs) => {
          expect(docs.length).to.eq(5)
        })
      })

      it('is in the correct order', (done) => {
        subject.all().then((docs) => {
          expect(docs[0].name).to.eq('fifth')
          expect(docs[1].name).to.eq('fourth')
          expect(docs[2].name).to.eq('third')
          expect(docs[3].name).to.eq('second')
          expect(docs[4].name).to.eq('first')
        }).then(done).catch((err) => {
          console.log(err, err.stack)
        })
      })
    })

    describe('insert', () => {
      describe('given I add one past the capacity', () => {
        beforeEach(() => {
          subject.insert({ name: 'sixth' })
        })

        it('is in the correct order', (done) => {
          subject.all().then((docs) => {
            expect(docs[0].name).to.eq('sixth')
            expect(docs[1].name).to.eq('fifth')
            expect(docs[2].name).to.eq('fourth')
            expect(docs[3].name).to.eq('third')
            expect(docs[4].name).to.eq('second')
          }).then(done).catch((err) => {
            console.log(err, err.stack)
          })
        })
      })

    })
  })
})
