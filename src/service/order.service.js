const connection = require("../app/database")
const dateFormat = require("../utils/date-handle")

class OrderService {
  // 支付
  async bankPay(message) {
    const {
      orderID,
      phoneNumber,
      customerBankCard,
      bankCardPassword,
      money,
      deadLine
    } = message

    // 查看银行卡密码是否正确 若正确就修改余额
    let statement = `UPDATE
    customer
    SET
    balance = balance - ?
    WHERE customer_phone_number = ?
    AND customer_bank_card = ?
    AND bank_card_password = ?
    AND balance >= ?`
    let [result] = await connection.execute(statement, [money, phoneNumber, customerBankCard, bankCardPassword, money])
    console.log(result);

    if (result.changedRows == 0) return false

    // 修改订单状态
    statement = `UPDATE
    `+ '`order`' +`
    SET
    status = 1,
    payDate = now(),
    startDate = now(),
    endDate = ?
    WHERE ID = ?`
    await connection.execute(statement, [new Date(new Date().getTime() + Number(deadLine) * 1000 * 60 * 60 * 24) ,orderID])
    return true
  }

  // 减库存 新增订单
  async insertOrder(message) {
    console.log("减库存 更新订单sql")
    const { activityID, orderChannel, userId } = message
    // 根据活动id查找产品信息
    let statement = `SELECT p.ID, p.initialAmount, ROUND(rateOfReturn * deadLine * initialAmount * 0.01) as estimatedEarnings
      FROM productdetail p
      INNER JOIN activity a
      ON p.ID = a.productID
      WHERE a.ID = ?`
    let result = await connection.execute(statement, [activityID])

    const { ID, initialAmount, estimatedEarnings } = result[0][0]

    // 插入订单
    statement =
      `INSERT INTO ` +
      "`order`" +
      ` VALUES(?, ?, ?, ?, ?, ?, ?, 0, now(), NULL, NULL, NULL)
    `

    const orderID = `${new Date().getTime()}${userId}`
    await connection.execute(statement, [
      orderID,
      userId,
      activityID,
      ID,
      initialAmount,
      estimatedEarnings,
      orderChannel
    ])

    // 减库存
    statement = `UPDATE activity SET remainAmount = remainAmount - 1 WHERE ID = ?`
    await connection.execute(statement, [activityID])

    return orderID
  }

  // 获取所有活动信息
  async getActivities(message) {
    const statement = "SELECT * FROM `activity` "
    const result = await connection.execute(statement)

    return result[0]
  }

  // 获取秒杀结果
  async getSeckillResult(message) {
    const { phoneNumber, activityID } = message
    const statement = ``
    const result = await connection.execute(statement)

    return result[0]
  }

  // 秒杀
  async orderSecKill(message) {
    const { phoneNumber, activityID, orderChannel, path } = message
    const statement = ``
    const result = await connection.execute(statement)

    return result[0]
  }

  // 获取我的秒杀
  async getMySecKill(message) {
    const {
      customerID,
      orderTimeState,
      orderPaymentState,
      startDate,
      endDate,
      curPage,
      pageSize
    } = message
    let statement = `SELECT p.deadLine, o.activityID, o.customerID, o.endDate, o.estimatedEarnings, o.ID id,
    o.orderChannel, o.payDate, o.productID, o.productPrice, o.startDate, o.status, p.name productName, p.rateOfReturn
    FROM
    ` + '`order`' + ` o
    INNER JOIN
    productdetail p
    ON o.productID = p.ID
    WHERE o.customerID = ?
    ${!!startDate ? ('AND payDate >= ' + startDate) : ''}
    ${!!endDate ? ('AND payDate <= ' + endDate) : ''}
    ${orderPaymentState == 0 ? '' : orderPaymentState == 1 ? 'AND status = 1' : 'AND status = 0'}
    ${orderTimeState == 0 ? '' : orderTimeState == 1 ? 'AND endDate > now()' : 'AND endDate <= now()'}
    LIMIT ?, ?`
    let [data] = await connection.execute(statement, [customerID, (curPage - 1) * pageSize, pageSize])
    data.forEach(item => {
      item.startDateFormat = dateFormat(item.startDate)
      item.endDateFormat = dateFormat(item.endDate)
      item.payDateFormat = dateFormat(item.payDate)
    })

    statement = `SELECT count(*) total_records, CEIL(COUNT(*) / ?) total_pages
    FROM
    ` + '`order`' + ` o
    INNER JOIN
    productdetail p
    ON o.productID = p.ID
    WHERE o.customerID = ?
    ${!!startDate ? ('AND payDate >= ' + startDate) : ''}
    ${!!endDate ? ('AND payDate <= ' + endDate) : ''}
    ${orderPaymentState == 0 ? '' : orderPaymentState == 1 ? 'AND status = 1' : 'AND status = 0'}
    ${orderTimeState == 0 ? '' : orderTimeState == 1 ? 'AND endDate > now()' : 'AND endDate <= now()'}
    `
    const [[{total_records, total_pages}]] = await connection.execute(statement, [pageSize, customerID])
    console.log(total_records, total_pages);

    return {
      data,
      total_records,
      total_pages
    }
  }
}

module.exports = new OrderService()
