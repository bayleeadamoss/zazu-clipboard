function readableFormat (value) {
  var unitNames = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB']
  var unitIndex = 0

  while (value > 1000) {
    value /= 1024
    unitIndex++
  }
  return {
    value: threeDigitPrecision(value),
    unit: unitNames[unitIndex] || '??',
  }
}

function threeDigitPrecision (value) {
  if (value < 10) {
    return Math.round(value * 100) / 100
  } else if (value < 100) {
    return Math.round(value * 10) / 10
  }
  return Math.round(value)
}

module.exports = readableFormat
