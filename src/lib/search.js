module.exports = (query, allClips) => {
  const regexQuery = new RegExp(query, 'i')
  if (query === '') {
    return allClips
  }
  return allClips.filter((clip) => {
    return clip.raw.match(regexQuery)
  })
}
