const expect = require('chai').expect
const search = require('../src/lib/search')

const clips = [
  { raw: 'Pigeonholer' },
  { raw: 'Polemically' },
  { raw: 'Quadrupoles' },
]

const chineseClips = [
  { raw: 'Pige测试字符串onhole' },
  { raw: '测试字符二' },
  { raw: '拼音二' },
]

describe('Search', () => {
  describe('given three items that contain pole', () => {
    it('finds the literal pole', () => {
      const results = search('pole', clips)
      expect(results).to.deep.include.members([{ raw: 'Polemically' }, { raw: 'Pigeonholer' }, { raw: 'Quadrupoles' }])
    })

    it('finds the case insensntive pole', () => {
      const results = search('pole', clips)
      expect(results).to.deep.include.members([{ raw: 'Polemically' }])
    })
  })

  describe('given pole with 中文', () => {
    it('finds the literal pole', () => {
      const results = search('测试', chineseClips)
      expect(results).to.deep.include.members([{ raw: '测试字符二' }, { raw: 'Pige测试字符串onhole' },
      ])
    })

    it('finds the pole with pinyin', () => {
      const results = search('er', chineseClips)
      expect(results).to.deep.include.members([{ raw: '测试字符二' },
        { raw: '拼音二' }])
    })
  })
})
