const connection = require("../app/database")
const dateFormat =  require("../utils/date-handle")

class activityManageService {
  // 活动列表获取
  async loadAllActivities(message) {
    const { curPage, pageSize } = message
    const statement = `SELECT a.ID, a.endDate, a.startDate, a.purchaseEachOf, a.remainAmount, a.totalAmount, p.name productName FROM activity a
    LEFT JOIN productdetail p
    ON a.productID = p.ID
    LIMIT ?, ?`
    const p = pageSize == -1 ? 99999 : pageSize
    const result = await connection.execute(statement, [
      curPage == 0 ? curPage : (curPage - 1) * p,
      p
    ])

    result[0].forEach(item => {
      item['startDateFormat'] = dateFormat(item['startDate'])
      item['endDateFormat'] = dateFormat(item['endDate'])
    })

    return result[0]
  }

  // 活动总条数和总数目获取
  async loadAllActivitiesGetTotal(message) {
    const { pageSize } = message
    const statement = `SELECT count(*) total_records, CEIL(COUNT(*) / ?) total_pages
    FROM activity`
    const result = await connection.execute(statement, [
      pageSize == -1 ? 99999 : pageSize
    ])

    return result[0][0]
  }

  // 删除指定活动
  async deleteActivity(activityID) {
    let statement = `SELECT * FROM ` + "`order`" + ` o WHERE o.activityID = ?`
    const result = await connection.execute(statement, [activityID])

    if (result[0].length !== 0) return false
    statement = `DELETE FROM activity WHERE ID = ?`
    await connection.execute(statement, [activityID])

    return true
  }

  // 添加新活动
  async addNewActivity(message) {
    const { productID, startDate, endDate, totalAmount, purchaseEachOf } =
      message

    let statement = `INSERT INTO activity(productID, startDate, endDate, totalAmount, remainAmount, purchaseEachOf)
    VALUES(?, ?, ?, ?, 0, ?
    )`
    const result = await connection.execute(statement, [
      productID,
      dateFormat(startDate),
      dateFormat(endDate),
      totalAmount,
      purchaseEachOf
    ])
    if (result[0]) {
      return true
    }
  }

  // 加载指定活动
  async loadSelectedActivity(ID) {
    const statement = `SELECT * FROM activity WHERE ID = ?`
    const result = await connection.execute(statement, [ID])

    return result[0][0]
  }

  // 修改指定活动
  async updateActivity(message) {
    const {
      activityID,
      productID,
      startDate,
      endDate,
      totalAmount,
      remainAmount,
      purchaseEachOf
    } = message
    const statement = `UPDATE activity SET
    productID = ?, startDate = ?, endDate = ?, totalAmount = ?, remainAmount = ?, purchaseEachOf = ?
    WHERE ID = ? `
    await connection.execute(statement, [
      productID,
      startDate,
      endDate,
      totalAmount,
      remainAmount,
      purchaseEachOf,
      activityID
    ])
    return true
  }
}

module.exports = new activityManageService()
