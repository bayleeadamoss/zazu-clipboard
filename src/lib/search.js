const search = require('fast-fuzzy').search
const pinyin = require('pinyin')

module.exports = (query, allClips) => {
  const filteredList =
    query.length === 0
      ? allClips
      : search(query, allClips, {
        keySelector: item => [item.raw, pinyin(item.raw, { heteronym: true, // 启用多音字模式
          segment: true, // 启用分词，以解决多音字问题。
          style: pinyin.STYLE_NORMAL }).join('')],
      })
  return filteredList
}
