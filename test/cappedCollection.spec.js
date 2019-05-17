'use strict'

const expect = require('chai').expect
const path = require('path')
const rmdir = require('rimraf')
const CappedCollection = require('../src/lib/cappedCollection')

const getTempDir = () => path.join(__dirname, 'tmp', `${Date.now()}`)

let subject
describe('CappedCollection', () => {
  describe('given a full capped collection of 5 items', () => {
    beforeEach((done) => {
      subject = new CappedCollection('test_items', { cwd: getTempDir() })
      subject.setSize(5)
      subject.upsert({ name: 'first', createdAt: new Date(new Date() - 9 * 1000) })
        .then(() => subject.upsert({ name: 'second', createdAt: new Date(new Date() - 8 * 1000) }))
        .then(() => subject.upsert({ name: 'third', createdAt: new Date(new Date() - 7 * 1000) }))
        .then(() => subject.upsert({ name: 'fourth', createdAt: new Date(new Date() - 6 * 1000) }))
        .then(() => subject.upsert({ name: 'fifth', createdAt: new Date(new Date() - 5 * 1000) }))
        .then(() => done())
        .catch(done)
    })

    afterEach((done) => {
      subject.collection.remove({}, { multi: true }, () => {
        subject.all()
          .then((docs) => {
            expect(docs.length).to.eq(0)
            rmdir(path.join(__dirname, 'tmp'), done)
          })
          .catch(done)
      })
    })

    describe('last', (done) => {
      it('gives me back the last item added', (done) => {
        subject.last()
          .then((doc) => {
            expect(doc).to.include({
              name: 'fifth',
            })
            done()
          })
          .catch(done)
      })
    })

    describe('remove', () => {
      it('remove the last item added', (done) => {
        subject.last()
          .then((doc) => {
            expect(doc.name).to.eq('fifth')
            return subject.remove([doc._id])
          })
          .then(() => subject.last())
          .then((doc) => {
            expect(doc.name).to.eq('fourth')
            done()
          })
          .catch(done)
      })
    })

    describe('reduce', () => {
      it('calling reduce() will remove extra items', (done) => {
        subject.setSize(4)
        subject.reduce()
          .then((nums) => {
            expect(nums).to.be.eq(1)
            return subject.all()
          })
          .then((docs) => {
            expect(docs.length).to.be.eq(4)
            expect(docs[docs.length - 1].name).to.be.eq('second')
            return subject.last()
          })
          .then((doc) => {
            //  the last one shouldn't be removed
            expect(doc.name).to.be.eq('fifth')
            done()
          })
          .catch(done)
      })
      it('calling upsert() will trigger reduce() and remove extra items', (done) => {
        subject.setSize(4)
        subject.upsert({ name: 'sixth', createdAt: new Date(new Date() - 3 * 1000) })
          .then((nums) => {
            expect(nums).to.be.eq(2)
            return subject.all()
          })
          .then((docs) => {
            expect(docs.length).to.be.eq(4)
            expect(docs[docs.length - 1].name).to.be.eq('third')
            return subject.last()
          })
          .then((doc) => {
            //  the last one should be the new one
            expect(doc.name).to.be.eq('sixth')
            done()
          })
          .catch(done)
      })
    })

    describe('onRemove()', () => {
      it('call callback() for given doc: [0] => fifth', (done) => {
        subject.all()
          .then((docs) => subject.handleOnRemove([docs[0]._id], (doc) => {
            expect(doc.name).to.eq('fifth')
            done()
          }))
          .catch(done)
      })
      it('call callback() for given doc: [2] => third', (done) => {
        subject.all()
          .then((docs) => subject.handleOnRemove([docs[0]._id], (doc) => {
            expect(doc.name).to.eq('fifth')
            done()
          }))
          .catch(done)
      })
      it('call callback() for given doc: [4] => first', (done) => {
        subject.all()
          .then((docs) => subject.handleOnRemove([docs[0]._id], (doc) => {
            expect(doc.name).to.eq('fifth')
            done()
          }))
          .catch(done)
      })
      it('call callback() for given docs', (done) => {
        let count = 0
        subject.all()
          .then((docs) => subject.handleOnRemove([docs[0]._id, docs[2]._id, docs[4]._id], (doc) => {
            expect(doc.name === 'first' || doc.name === 'third' || doc.name === 'fifth').to.be.eq(true)
            ++count
          }))
          .then((ids) => {
            expect(ids.length).to.be.eq(3)
            expect(count).to.be.eq(3)
            done()
          })
          .catch(done)
      })
      it('remove() will call the given callback function', (done) => {
        subject.setOnRemove((doc) => {
          expect(doc.name).to.be.eq('fifth')
        })
        subject.all()
          .then((docs) => subject.remove([docs[0]._id]))
          .then((nums) => {
            expect(nums).to.be.eq(1)
            subject.clearOnRemove()
            done()
          })
          .catch(done)
      })
      it('remove() will call the given callback function multiple times for multiple ids', (done) => {
        let count = 0
        subject.setOnRemove((doc) => {
          expect(doc.name === 'fifth' || doc.name === 'third' || doc.name === 'second').to.be.eq(true)
          ++count
        })
        subject.all()
          .then((docs) => subject.remove([docs[0]._id, docs[2]._id, docs[3]._id]))
          .then((nums) => {
            expect(nums).to.be.eq(3)
            expect(count).to.be.eq(3)
            subject.clearOnRemove()
            done()
          })
          .catch(done)
      })
    })

    describe('all', () => {
      it('gives me all 5 items back', (done) => {
        subject.all()
          .then((docs) => {
            expect(docs.length).to.eq(5)
          })
          .then(() => done())
          .catch(done)
      })

      it('is in the correct order', (done) => {
        subject.all()
          .then((docs) => {
            expect(docs[0].name).to.eq('fifth')
            expect(docs[1].name).to.eq('fourth')
            expect(docs[2].name).to.eq('third')
            expect(docs[3].name).to.eq('second')
            expect(docs[4].name).to.eq('first')
          })
          .then(() => done())
          .catch(done)
      })
    })
  })
})
