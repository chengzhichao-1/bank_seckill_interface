const connection = require("../app/database")
const dateFormat = require("../utils/date-handle")

class InfoManageService {
  // 加载所有常见问答
  async loadAllAQs(message) {
    const statement = `SELECT ID id, question, answer FROM frequentlyaq`
    const result = await connection.execute(statement)

    return result[0]
  }

  // 删除指定常见问答
  async deleteAQ(id) {
    const statement = `DELETE FROM frequentlyaq WHERE ID = ?`
    await connection.execute(statement, [id])

    return true
  }

  // 新增常见问答
  async insertAQ(message) {
    const {
      question, answer
    } = message
    const statement = `INSERT INTO frequentlyaq(question, answer) VALUES(?, ?)`
    await connection.execute(statement, [question, answer])

    return true
  }

  // 加载指定常见问答
  async loadSelectedAQ(id) {
    const statement = `SELECT ID id, question, answer FROM frequentlyaq WHERE ID = ?`
    const result = await connection.execute(statement, [id])

    return result[0][0]
  }

  // 修改指定常见问答
  async updateAQ(message) {
    const {
      question, answer, id
    } = message
    const statement = `UPDATE frequentlyaq SET question = ?, answer = ? WHERE ID = ?`
    await connection.execute(statement, [question, answer, id])
  }


  // 加载所有公告
  async loadAllAnnouncements(message) {
    const statement = `SELECT * FROM announcement`
    const result = await connection.execute(statement)

    result[0].forEach(item => {
      item['releaseDateFormat'] = dateFormat(item['releaseDate'])
    })

    return result[0]
  }

  // 删除指定公告
  async deleteAnnouncement(id) {
    const statement = `DELETE FROM announcement WHERE ID = ?`
    await connection.execute(statement, [id])

    return true
  }

  // 新增公告
  async insertAnnouncement(message) {
    const {
      title, content, adminID
    } = message
    const statement = `INSERT INTO announcement(adminID, title, content, releaseDate, lastUpdateTime) VALUES(?, ?, ?, now(), now())`
    await connection.execute(statement, [adminID, title, content])

    return true
  }

  // 加载指定公告
  async loadSelectedAnnouncement(id) {
    const statement = `SELECT * FROM announcement WHERE ID = ?`
    const result = await connection.execute(statement, [id])

    return result[0][0]
  }

  // 修改指定公告
  async updateAnnouncement(message) {
    const {
      id,
      title,
      content,
      adminID
    } = message
    const statement = `UPDATE announcement SET adminID = ?, title = ?, content = ?, lastUpdateTime = now() WHERE ID = ?`
    await connection.execute(statement, [adminID, title, content, id])
  }


  // 加载首页所有图片
  async loadAllImages() {
    const statement = `SELECT ID id, imageUrl FROM indeximages`
    const result = await connection.execute(statement, [])

    return result[0]
  }

  // 上传图片
  async uploadImage(imageUrl) {
    const statement = `INSERT INTO indeximages(imageUrl) VALUES(?)`
    await connection.execute(statement, [imageUrl])
    return true
  }

  // 删除指定图片
  async deleteImage(id) {
    const statement = `DELETE FROM indeximages WHERE ID = ?`
    await connection.execute(statement, [id])
    return true
  }
}

module.exports = new InfoManageService()
