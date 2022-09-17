const connection = require("../app/database")

class ProductService {
  // 获取未来产品
  async getFutureProduct() {
    const statement = `SELECT a.productID, a.ID activityID, p.name, p.initialAmount, p.deadLine, p.rateOfReturn, p.rateOfComparative, p.riskRating, a.startDate activityStartTime, a.endDate activityEndTime
    FROM productdetail p INNER JOIN activity a ON p.ID = a.productID
    WHERE a.startDate > now()`
    const result = await connection.execute(statement)

    return result[0]
  }

  // 获取产品详情
  async getProductDetail(activityID) {
    const statement = `SELECT a.productID, a.ID activityID, p.name, p.initialAmount, p.deadLine, p.rateOfReturn, p.rateOfComparative, p.riskRating, a.purchaseEachOf, a.totalAmount, a.remainAmount, a.startDate activityStartTime, a.endDate activityEndTime
      FROM productdetail p INNER JOIN activity a ON p.ID = a.productID
      WHERE a.ID = ?`
    const result = await connection.execute(statement, [activityID])

    return result[0]
  }

  // 获取产品列表
  async getProductList(search) {
    try {
      const {
        keyWords = "", // 关键词
        initialAmount = -1, // 起购金额[没选择返回-1]
        deadLine = -1, // 产品期限[没选择返回-1]
        riskRating = "R2", // 风险等级
        selectType, // 排序类型，七日年化收益率rateOfReturn，业绩比较基准rateOfComparative，起购金额initialAmount，有效期限deadLine
        state, // 排序状态，0代表不排序，1代表升序，2代表降序
        curPage = 1, // 当前页数
        pageSize = 5 // 当前页面显示多少页
      } = search
      const statement = `SELECT a.productID, a.ID activityID, p.name, p.initialAmount, p.deadLine, p.rateOfReturn, p.rateOfComparative, p.riskRating, a.purchaseEachOf, a.totalAmount, a.remainAmount, a.startDate activityStartTime, a.endDate activityEndTime
        FROM productdetail p INNER JOIN activity a ON p.ID = a.productID
        WHERE name LIKE "%${keyWords}%"
        ${initialAmount != -1 ? `AND P.initialAmount > ${initialAmount}` : ``}
        ${deadLine != -1 ? `AND P.deadLine = ${deadLine}` : ``}
        AND p.riskRating = ?
        ${state == 0 ? `` : state == 1 ? `ORDER BY p.${selectType} ASC ` : `ORDER BY p.${selectType} DESC `}
        LIMIT ?,?`
      const result = await connection.execute(statement, [riskRating, (curPage === 0 ? 0 : (curPage - 1) * pageSize), pageSize])

      return result[0]
    } catch (error) {
      console.error(error)
    }
  }

  // 获取产品的总记录数与分页页数
  async getPagesAndRecordsByPageSize(search) {
    try {
      const {
        keyWords = "", // 关键词
        initialAmount = -1, // 起购金额[没选择返回-1]
        deadLine = -1, // 产品期限[没选择返回-1]
        riskRating = "R2", // 风险等级
        selectType, // 排序类型，七日年化收益率rateOfReturn，业绩比较基准rateOfComparative，起购金额initialAmount，有效期限deadLine
        state, // 排序状态，0代表不排序，1代表升序，2代表降序
        curPage = 1, // 当前页数
        pageSize = 5 // 当前页面显示多少页
      } = search
      const statement = `SELECT count(*) total_records, CEIL(COUNT(*) / ${pageSize}) total_pages
        FROM productdetail p INNER JOIN activity a ON p.ID = a.productID
        WHERE name LIKE "%${keyWords}%"
        ${initialAmount != -1 ? `AND P.initialAmount > ${initialAmount}` : ``}
        ${deadLine != -1 ? `AND P.deadLine = ${deadLine}` : ``}
        AND p.riskRating = ?`
      const result = await connection.execute(statement, [riskRating])

      return result[0]
    } catch (error) {
      console.error(error)
    }
  }

  // 获取当前产品
  async getProductInActivity() {
    const statement = `SELECT a.productID, a.ID activityID, p.name, p.initialAmount, p.deadLine, p.rateOfReturn, p.rateOfComparative, p.riskRating, a.totalAmount, a.remainAmount, a.startDate activityStartTime, a.endDate activityEndTime
    FROM productdetail p INNER JOIN activity a ON p.ID = a.productID
    WHERE a.startDate <= now() AND a.endDate >= now()`
    const result = await connection.execute(statement)

    return result[0]
  }
}

module.exports = new ProductService()
