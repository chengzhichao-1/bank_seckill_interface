// a_b_c -> aBC
function wordNameFormat(word) {
  const len = word.length
  let res = "",
    flag = false
  for (let i = 0; i < len; i++) {
    if (word[i] === "_" || word[i] === "-") {
      flag = true
    } else {
      if (flag) {
        res += word[i].toUpperCase()
        flag = false
      } else {
        res += word[i]
      }
    }
  }

  return res
}

//
function objWordNameFormat(obj) {
  if (obj instanceof Array) {
    return obj.map(item => {
      const res = {}
      Object.keys(item).forEach(key => {
        res[wordNameFormat(key)] = item[key]
      })
      return res
    })
  }
  const res = {}
  Object.keys(obj).forEach(key => {
    res[wordNameFormat(key)] = obj[key]
  })
  return res
}

module.exports = {
  wordNameFormat,
  objWordNameFormat
}
