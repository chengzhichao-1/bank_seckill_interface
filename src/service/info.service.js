const connection = require("../app/database")

class InfoService {
  // 获取公告信息
  async getAllAnnouncements() {
    const statement = `SELECT * FROM announcement`
    const result = await connection.execute(statement)

    return result[0]
  }

  // 获取问答信息
  async getAllAQ() {
    const statement = `SELECT * FROM frequentlyaq`
    const result = await connection.execute(statement)

    return result[0]
  }

  // 获取首页轮播图片
  async loadAllImages() {
    const statement = `SELECT * FROM indeximages`
    const result = await connection.execute(statement)

    return result[0]
  }
}

module.exports = new InfoService()
