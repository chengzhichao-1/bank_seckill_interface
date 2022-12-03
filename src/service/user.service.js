const connection = require("../app/database")

class UserService {
  // 登录
  async login(account) {
    const {
      customerPhoneNumber,
      customerPassword
    } = account
    const statement = `SELECT customer_bank_card customerBankCard, customer_number customerNumber, customer_password customerPassword, customer_name customerName, customer_id_type customerIdType, customer_id_number customerIdNumber, customer_phone_number customerPhoneNumber, customer_email customerEmail, customer_address customerAddress, customer_sex customerSex, customer_occupation customerOccupation, customer_birthday customerBirthday, customer_register_day customerRegisterDay, customer_bank_card customerBankCard, balance FROM customer WHERE customer_phone_number = ? AND customer_password = ?`
    const result = await connection.execute(statement, [customerPhoneNumber, customerPassword])

    return result[0]
  }

  // 保存验证码
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

  // 查询是否存在某手机号
  async getPhone(customerPhoneNumber) {
    let statement = `SELECT * FROM customer WHERE customer_phone_number = ?`
    let result = await connection.execute(statement, [customerPhoneNumber])

    return result[0]
  }

  // 查看验证码是否正确并且未过期
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

  // 注册
  async register(message) {
    const {
      customerPhoneNumber,
      customerPassword
    } = message
    let statement = `INSERT INTO customer (customer_phone_number, customer_password, customer_register_day) VALUES(?, ?, now())`
    const result = await connection.execute(statement, [customerPhoneNumber, customerPassword])

    return result[0]
  }

  // 获取当前登陆用户
  async getCustomerByPhoneNumber(message) {
    const {
      customerPhoneNumber
    } = message
    let statement = `SELECT customer_bank_card customerBankCard, customer_number customerNumber, customer_password customerPassword, customer_name customerName, customer_id_type customerIdType, customer_id_number customerIdNumber, customer_phone_number customerPhoneNumber, customer_email customerEmail, customer_address customerAddress, customer_sex customerSex, customer_occupation customerOccupation, customer_birthday customerBirthday, customer_register_day customerRegisterDay, customer_bank_card customerBankCard, balance
    FROM customer WHERE customer_phone_number = ?`
    const result = await connection.execute(statement, [customerPhoneNumber])

    return result[0]
  }

  // 获取当前登陆用户的注册时长和已购产品数量
  async getMyInfo(message) {
    const {
      customerPhoneNumber
    } = message
    let statement = "SELECT COUNT(*) purchasedProductNum, c.customer_phone_number customerPhoneNumber, TIMESTAMPDIFF(DAY,c.customer_register_day ,NOW()) registerTime, o.productPrice FROM customer c left JOIN `order` o ON c.customer_number = o.customerID where c.customer_phone_number = ?"
    const result = await connection.execute(statement, [customerPhoneNumber])

    return result[0][0]
  }

  // 获取银行卡卡号
  async sendCardByPhone(message) {
    const {
      customerPhoneNumber
    } = message
    let statement = `SELECT customer_bank_card FROM customer WHERE customer_phone_number = '19858192905'`
    const result = await connection.execute(statement, [customerPhoneNumber])

    return result[0]
  }

  // 完善用户基本信息
  async refineInfo(message) {
    const {
      customerPhoneNumber = null,
      customerName = null,
      customerIdType = null,
      customerIdNumber = null,
      customerEmail = null,
      customerAddress = null,
    } = message
    let statement = `UPDATE customer SET customer_name = ?, customer_id_type = ?, customer_id_number = ?, customer_email = ?, customer_address = ? WHERE customer_phone_number = ? `
    const result = await connection.execute(statement, [customerName, customerIdType, customerIdNumber, customerEmail, customerAddress, customerPhoneNumber])

    return true
  }

  // 绑定银行卡
  async bindCard(message) {
    const {
      customerPhoneNumber,
      customerBankCard,
      bankCardPassword,
    } = message
    // 判断银行卡是否被绑定过
    let statement = `SELECT COUNT(*) count FROM customer WHERE customer_bank_card = ?`
    let result = await connection.execute(statement, [customerBankCard])

    if (result[0][0].count !== 0) {
      return false
    }
    // 绑定银行卡
    statement = `UPDATE customer SET customer_bank_card = ?, bank_card_password = ? WHERE customer_phone_number = ?`
    await connection.execute(statement, [customerBankCard, bankCardPassword, customerPhoneNumber])

    return true
  }

  // 解绑银行卡
  async unBindCard(message) {
    try {
      const {
        customerPhoneNumber,
        bankCardPassword,
      } = message
      // 解绑银行卡
      const statement = `UPDATE customer SET bank_card_password = null, customer_bank_card = null WHERE bank_card_password = ? AND customer_phone_number = ?`
      const result = await connection.execute(statement, [bankCardPassword, customerPhoneNumber])
      if (result[0].changedRows == 0) return false // 密码错误
      return true // 密码和手机号正确
    } catch (error) {
      console.log("error", error);
    }

    return true
  }

}

module.exports = new UserService()
