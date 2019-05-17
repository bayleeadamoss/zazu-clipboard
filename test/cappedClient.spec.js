'use strict'

const expect = require('chai').expect
const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const rmdir = require('rimraf')
const CappedClient = require('../src/lib/cappedClient')

const getTempDir = () => path.join(__dirname, 'tmp', `${Date.now()}`)

const touch = (f) => fs.closeSync(fs.openSync(f, 'w'))

describe('CappedClient', () => {
  before(() => {
    CappedClient.clear()
  })
  after((done) => {
    CappedClient.clear()
    rmdir(path.join(__dirname, 'tmp'), done)
  })

  describe('constructor', () => {
    afterEach(() => {
      CappedClient.clear()
    })
    it('default capped size should be 50', () => {
      const client = CappedClient.init(getTempDir())
      expect(client.clipCollection.MAX_SIZE).to.be.eq(50)
    })
    it('can assign a capped size', () => {
      const client = CappedClient.init(getTempDir(), { size: 123 })
      expect(client.clipCollection.MAX_SIZE).to.be.eq(123)
    })
  })
  describe('given a full capped client of 5 items', () => {
    let subject
    beforeEach((done) => {
      subject = CappedClient.init(getTempDir(), { size: 5 })
      subject
        .upsert({
          name: 'first',
          raw: path.join('images', '1.jpg'),
          createdAt: new Date(new Date() - 9 * 1000) })
        .then(() => subject.upsert({
          name: 'second',
          raw: path.join('images', '2.jpg'),
          createdAt: new Date(new Date() - 8 * 1000) }))
        .then(() => subject.upsert({
          name: 'third',
          raw: path.join('images', '3.jpg'),
          createdAt: new Date(new Date() - 7 * 1000) }))
        .then(() => subject.upsert({
          name: 'fourth',
          raw: path.join('images', '4.jpg'),
          createdAt: new Date(new Date() - 6 * 1000) }))
        .then(() => subject.upsert({
          name: 'fifth',
          raw: path.join('images', '5.jpg'),
          createdAt: new Date(new Date() - 5 * 1000) }))
        .then(() => {
          mkdirp.sync(path.join(subject.cwd, 'images'))
          touch(path.join(subject.cwd, 'images', '1.jpg'))
          touch(path.join(subject.cwd, 'images', '2.jpg'))
          touch(path.join(subject.cwd, 'images', '3.jpg'))
          touch(path.join(subject.cwd, 'images', '4.jpg'))
          touch(path.join(subject.cwd, 'images', '5.jpg'))
        })
        .then(() => done())
        .catch(done)
    })

    afterEach((done) => {
      subject.all()
        .then((docs) => subject.clipCollection.remove(docs.map(doc => doc._id)))
        .then(() => subject.all())
        .then((docs) => {
          expect(docs.length).to.eq(0)
          CappedClient.clear()
          done()
        })
        .catch(done)
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

    describe('capped', () => {
      it('calling upsert() will trigger clipCollection.reduce() and remove the extra items', (done) => {
        touch(path.join(subject.cwd, 'images', '6.jpg'))
        subject.upsert({ name: 'sixth', raw: path.join('images', '6.jpg'), createdAt: new Date(new Date() - 3 * 1000) })
          .then((nums) => {
            expect(nums).to.be.eq(1)
            return subject.all()
          })
          .then((docs) => {
            expect(docs.length).to.be.eq(5)
            expect(docs[docs.length - 1].name).to.be.eq('second')
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

    describe('removeCacheImage', () => {
      it('call removeCacheImage() on given clip will remove the image', (done) => {
        subject.all()
          .then((docs) => {
            const doc = docs[2]
            const f = path.join(subject.cwd, doc.raw)
            fs.access(f, fs.constants.R_OK | fs.constants.W_OK, (err) => {
              if (err) {
                done(err)
              } else {
                subject.removeCacheImage(doc)
                  .then(() => {
                    fs.access(f, fs.constants.R_OK | fs.constants.W_OK, (err) => {
                      err ? done() : done(new Error(`File ${f} is not removed.`))
                    })
                  }).then(() => {
                    //  create an empty file to avoid error message
                    touch(f)
                  })
                  .catch(done)
              }
            })
          })
      })
    })

    describe('all', () => {
      it('gives me all 5 items back', (done) => {
        subject.all()
          .then((docs) => {
            expect(docs.length).to.eq(5)
          })
          .then(done)
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
