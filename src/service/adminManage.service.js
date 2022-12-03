const connection = require("../app/database")
const md5 = require("js-md5")

class adminManageService {
  // 管理员登录
  async administratorLogin(message) {
    const { administratorPhoneNumber, administratorPassword } = message
    const statement = `SELECT administrator_name administratorName, administrator_grade administratorGrade, administrator_id_type administratorIdType, administrator_email administratorEmail, administrator_number administratorNumber, administrator_password administratorPassword, administrator_phone_number administratorPhoneNumber
    FROM administrator WHERE administrator_phone_number = ? AND administrator_password = ?`
    const result = await connection.execute(statement, [
      administratorPhoneNumber,
      administratorPassword
    ])

    return result[0][0]
  }

  // 获取管理员列表
  async selectAdministratorByGrade(search) {
    try {
      const {
        administratorGrade = 1,
        currentPage = 1,
        pageSize = 10 // 当前页面显示多少页
      } = search
      const statement = `SELECT administrator_name administratorName, administrator_grade administratorGrade, administrator_id_number administratorIdNumber, administrator_email administratorEmail, administrator_number administratorNumber, administrator_password administratorPassword, administrator_phone_number administratorPhoneNumber
      FROM administrator WHERE administrator_grade = ?
      LIMIT ?, ?`
      const result = await connection.execute(statement, [
        administratorGrade,
        currentPage === 0 ? 0 : (currentPage - 1) * pageSize,
        pageSize
      ])

      return result[0]
    } catch (error) {
      console.error(error)
    }
  }

  // 获取管理员的总记录数与分页页数
  async getPagesAndRecordsByPageSize(search) {
    try {
      const {
        administratorGrade = 1,
        pageSize = 10 // 当前页面显示多少页
      } = search
      const statement = `SELECT count(*) total_records, CEIL(COUNT(*) / ${pageSize}) total_pages
      FROM administrator WHERE administrator_grade = ?`
      const result = await connection.execute(statement, [administratorGrade])

      return result[0][0]
    } catch (error) {
      console.error(error)
    }
  }

  // 根据身份证获取管理员信息
  async selectAdAllInfo(search) {
    try {
      const id = search
      const statement = `SELECT * FROM administrator WHERE administrator_id_number = ?`
      const result = await connection.execute(statement, [id])

      return result[0][0]
    } catch (error) {
      console.error(error)
    }
  }

  // 更新管理员信息
  async updateAdministratorInformation(search) {
    try {
      const {
        administratorEmail = null,
        administratorIdNumber = null,
        administratorName = null,
        administratorPhoneNumber = null,
        administratorIdType = null
      } = search
      const statement = `UPDATE administrator SET administrator_name = ?, administrator_email = ?, administrator_phone_number = ?, administrator_id_type = ? WHERE administrator_id_number = ?`
      await connection.execute(statement, [administratorName, administratorEmail, administratorPhoneNumber, administratorIdType, administratorIdNumber])

      return true
    } catch (error) {
      console.error(error)
    }
  }

  // 添加分管理员
  async addAdministrators(search) {
    try {
      const {
        administratorEmail = null,
        administratorIdNumber = null,
        administratorName = null,
        administratorPhoneNumber = null,
        administratorIdType = null
      } = search
      let statement = `SELECT * FROM administrator WHERE administrator_phone_number = ? OR administrator_id_number = ?`
      const result = await connection.execute(statement, [administratorPhoneNumber, administratorIdNumber])
      if (result[0].length !== 0) {
        return false
      }

      statement = `INSERT INTO administrator (administrator_name, administrator_id_type, administrator_id_number, administrator_email, administrator_phone_number, administrator_password, administrator_grade) VALUES(?, ?, ?, ?, ?, ?, 2)`
      await connection.execute(statement, [administratorName, administratorIdType, administratorIdNumber, administratorEmail, administratorPhoneNumber, md5(md5(administratorIdNumber.slice(-6)))])

      return true
    } catch (error) {
      console.log(error);
    }
  }

  // 删除分管理员
  async deleteAdministrator(search) {
    const { administratorIdNumber } = search
    let statement = `DELETE FROM administrator WHERE administrator_id_number = ?`
    await connection.execute(statement, [administratorIdNumber])
    return true
  }

  // 重置分管理员的密码
  async resetPassword(search) {
    const { administratorIdNumber } = search
    let statement = `UPDATE administrator SET administrator_password = ? WHERE administrator_id_number = ?`
    await connection.execute(statement, [md5(md5(administratorIdNumber.slice(-6))), administratorIdNumber])
    return true
  }
}

module.exports = new adminManageService()
