const expect = require('chai').expect
const search = require('../src/lib/search')

const clips = [
  { raw: 'Pigeonholer' },
  { raw: 'Polemically' },
  { raw: 'Quadrupoles' },
]

describe('Search', () => {
  describe('given three items that contain pole', () => {
    it('finds the literal pole', () => {
      const results = search('pole', clips)
      expect(results).to.include({ raw: 'Quadrupoles' })
    })

    it('finds the case insensntive pole', () => {
      const results = search('pole', clips)
      expect(results).to.include({ raw: 'Polemically' })
    })

    it('does not find the pole with extra characters', () => {
      const results = search('pole', clips)
      expect(results).to.not.include({ raw: 'Pigeonholer' })
    })
  })
})
