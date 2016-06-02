const expect = require('chai').expect
const Score = require('../src/lib/score')

describe('Score', () => {
  describe('given an accuracy of 0.5', () => {
    const query = new Score('tinytaco', 0.5)

    describe('score', () => {
      it('ranks in relation to other items', () => {
        const actual = [
          query.score('new Foo("tinytaco", 0.5)'),
          query.score('new Foo("tiny", "taco")'),
          query.score('new Foo("ytac")'),
          query.score('new Foo("tiny")'),
          query.score('new Foo("taco")'),
          query.score('new Foo("ti", "ny")'),
          query.score('new Foo("ta", "co")'),
        ]
        const expected = actual.sort((a, b) => b - a)
        expect(actual).to.eq(expected)
      })
    })

    describe('grams', () => {
      it('gives me a gram for a large word', () => {
        expect(query.grams('tinytaco')).to.eql([
          'tinytaco',
          'tinytac',
          'inytaco',
          'tinyta',
          'inytac',
          'nytaco',
          'tinyt',
          'inyta',
          'nytac',
          'ytaco',
          'tiny',
          'inyt',
          'nyta',
          'ytac',
          'taco',
        ])
      })

      it('rounds up for a odd length word', () => {
        expect(query.grams('tin')).to.eql([
          'tin',
          'ti',
          'in',
        ])
      })
    })
  })
})
