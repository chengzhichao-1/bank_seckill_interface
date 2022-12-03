const moment = require("moment")

function dateFormat(date) {
  const res = moment(date).format("YYYY-MM-DD HH:mm:ss")
  return res === "Invalid date" ? null : res
}

module.exports = dateFormat
