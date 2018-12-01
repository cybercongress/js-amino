const toHex = (buffer) => {
  let s = ''
  buffer.forEach((b) => {
      b = b.toString(16)
      if (b.length == 1) {
          b = '0' + b
      }
      s += b
  })
  return s
}

module.exports = {
  toHex
}
