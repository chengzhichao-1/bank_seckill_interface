const connection = require("../app/database")

class UserService {
  async login(account) {
    const {
      customerPhoneNumber,
      customerPassword
    } = account
    const statement = `SELECT * FROM customer WHERE customer_phone_number = ? AND customer_password = ?`
    const result = await connection.execute(statement, [customerPhoneNumber, customerPassword])

    return result[0]
  }

  async saveSMSCode(message) {
    const {
      customerPhoneNumber,
      code,
      expirationTime
    } = message
    let statement = `SELECT * FROM smscode WHERE customerPhoneNumber = ?`
    let result = await connection.execute(statement, [customerPhoneNumber])
    // 如果查不到就插入新的数据 查到了就更新替换短信验证码 + 过期时间
    if (result[0].length === 0) {
      statement = `INSERT INTO smscode (customerPhoneNumber, code, ExpirationTime) VALUES(?, ?, ?)`
      result = await connection.execute(statement, [customerPhoneNumber, code, expirationTime])
    } else {
      statement = `UPDATE smscode SET code = ? , ExpirationTime = ? WHERE customerPhoneNumber = ?`
      result = await connection.execute(statement, [code, expirationTime, customerPhoneNumber])
    }
  }

  async getPhone(customerPhoneNumber) {
    let statement = `SELECT * FROM customer WHERE customer_phone_number = ?`
    let result = await connection.execute(statement, [customerPhoneNumber])

    return result[0]
  }

  async checkCode(message) {
    const {
      customerPhoneNumber,
      code,
      curTime
    } = message
    const statement = `SELECT * FROM smscode WHERE customerPhoneNumber = ? AND code = ? AND expirationTime >= ?`
    const result = await connection.execute(statement, [customerPhoneNumber, code, curTime])

    return result[0]
  }

  async register(message) {
    const {
      customerPhoneNumber,
      customerPassword
    } = message
    let statement = `INSERT INTO customer (customer_phone_number, customer_password) VALUES(?, ?)`
    const result = await connection.execute(statement, [customerPhoneNumber, customerPassword])

    return result[0]
  }

}

module.exports = new UserService()
