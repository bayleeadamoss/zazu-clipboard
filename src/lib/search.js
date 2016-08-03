module.exports = (query, allClips) => {
  const regexQuery = new RegExp(query, 'i')
  if (query === '') {
    return allClips.slice(0, 10)
  }
  return allClips.filter((clip) => {
    return clip.raw.match(regexQuery)
  })
}
