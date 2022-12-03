const connection = require("../app/database")

class OrderService {
  // 获取秒杀链接
  async getPath(message) {
    const { phoneNumber, activityID, orderChannel } = message
    const statement = ``
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
    const { customerID, orderTimeState, orderPaymentState, startDate, endDate, curPage, pageSize } = message
    const statement = ``
    const result = await connection.execute(statement)

    return result[0]
  }


}

module.exports = new OrderService()
