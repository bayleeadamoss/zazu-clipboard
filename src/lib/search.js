const search = require('fast-fuzzy').search
const pinyin = require('pinyin')

module.exports = (query, allClips) => {
  const filteredList =
    query.length === 0
      ? allClips
      : search(query, allClips, {
        keySelector: item => [item.raw, pinyin(item.raw, { style: pinyin.STYLE_NORMAL }).join('')],
      })
  return filteredList
}
