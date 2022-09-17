const moment = require("moment")

function dateFormat(date) {
  return moment(date).format("YYYY-MM-DD HH:mm:ss")
}

module.exports = dateFormat
