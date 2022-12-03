const connection = require("../app/database")

class customerManageService {
  // 分页查询用户信息
  async queryUsersByNPC(message) {
    const {
      customerName,
      customerPhoneNumber,
      credibility,
      currentPage,
      pageSize
    } = message
    const statement =
      `SELECT c.customer_name customerName, c.customer_phone_number customerPhoneNumber, c.credibility, COUNT(o.customerID) orderNumber, o.customerID
    FROM customer c LEFT JOIN ` +
      "`order`" +
      ` o ON c.customer_number = o.customerID
    WHERE c.customer_name LIKE '%${customerName}%' AND c.customer_phone_number LIKE '%${customerPhoneNumber}%' ${
        credibility ? "AND c.credibility =  '" + credibility + "'" : ""
      }
    GROUP BY c.customer_number
    LIMIT ?, ?`
    const start = currentPage === 0 ? 0 : (currentPage - 1) * pageSize
    const result = await connection.execute(statement, [start, pageSize])

    return result[0]
  }

  // 分页查询用户total
  async queryUsersByNPCGetTotal(message) {
    const {
      customerName,
      customerPhoneNumber,
      credibility,
      currentPage,
      pageSize
    } = message
    const statement = `SELECT count(*) total_records, CEIL(COUNT(*) / ?) total_pages
      FROM customer c
      WHERE c.customer_name LIKE '%${customerName}%' AND c.customer_phone_number LIKE '%${customerPhoneNumber}%' ${
      credibility ? "AND c.credibility =  '" + credibility + "'" : ""
    }`
    const result = await connection.execute(statement, [pageSize])

    return result[0][0]
  }

  // 分页查询黑名单信息
  async queryBlacklistByNPC(message) {
    const {
      customerName,
      customerPhoneNumber,
      credibility,
      currentPage,
      pageSize
    } = message
    const statement =
      `SELECT c.customer_name customerName, c.customer_phone_number customerPhoneNumber, c.credibility, COUNT(o.customerID) orderNumber, o.customerID
    FROM blacklist c LEFT JOIN ` +
      "`order`" +
      ` o ON c.customer_number = o.customerID
    WHERE c.customer_name LIKE '%${customerName}%' AND c.customer_phone_number LIKE '%${customerPhoneNumber}%' ${
        credibility ? "AND c.credibility =  '" + credibility + "'" : ""
      }
    GROUP BY c.customer_number
    LIMIT ?, ?`
    const start = currentPage === 0 ? 0 : (currentPage - 1) * pageSize
    const result = await connection.execute(statement, [start, pageSize])

    return result[0]
  }

  // 分页查询黑名单total
  async queryBlacklistByNPCGetTotal(message) {
    const {
      customerName,
      customerPhoneNumber,
      credibility,
      currentPage,
      pageSize
    } = message
    const statement = `SELECT count(*) total_records, CEIL(COUNT(*) / ?) total_pages
      FROM blacklist c
      WHERE c.customer_name LIKE '%${customerName}%' AND c.customer_phone_number LIKE '%${customerPhoneNumber}%' ${
      credibility ? "AND c.credibility =  '" + credibility + "'" : ""
    }`
    const result = await connection.execute(statement, [pageSize])

    return result[0][0]
  }

  // 移除黑名单
  async removeTheBlacklist(phone) {
    // 1.查询出用户插入到customer
    let statement = `INSERT INTO customer
    SELECT * FROM blacklist b
    WHERE b.customer_phone_number = ?`
    await connection.execute(statement, [phone])

    // 2.在blacklist中删除该用户
    statement = `DELETE FROM blacklist WHERE customer_phone_number = ?`
    await connection.execute(statement, [phone])

    return true
  }

  // 拉入黑名单
  async pullIntoTheBlacklist(phone) {
    // 1.查询出用户插入到customer
    let statement = `INSERT INTO blacklist
    SELECT * FROM customer c
    WHERE c.customer_phone_number = ?`
    await connection.execute(statement, [phone])

    // 2.在blacklist中删除该用户
    statement = `DELETE FROM customer WHERE customer_phone_number = ?`
    await connection.execute(statement, [phone])

    return true
  }
}

module.exports = new customerManageService()
