const expect = require('chai').expect
const present = require('../src/lib/present')

const clips = {
  short_hex: { _id: 1, type: 'text', raw: '#fff', createdAt: new Date() },
  long_hex: { _id: 2, type: 'text', raw: '#000000', createdAt: new Date() },
  word: { _id: 3, type: 'text', raw: 'Quadrupoles', createdAt: new Date() },
}

describe('Present', () => {
  describe('given a short hex color', () => {
    it('finds the literal pole', () => {
      const clip = clips.short_hex
      const results = present([clip])
      expect(results[0].preview).to.contain('color')
      expect(results[0].preview).to.contain('light')
    })
  })

  describe('given a long hex color', () => {
    it('finds the case insensntive pole', () => {
      const clip = clips.long_hex
      const results = present([clip])
      expect(results[0].preview).to.contain('color')
      expect(results[0].preview).to.contain('dark')
    })
  })

  describe('given a word', () => {
    it('does not find the pole with extra characters', () => {
      const clip = clips.word
      const results = present([clip])
      expect(results[0].preview).to.not.contain('color')
    })
  })
})
