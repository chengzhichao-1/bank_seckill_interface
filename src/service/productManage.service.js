const connection = require("../app/database")

class productManageService {
  // 产品列表获取
  async loadAllProducts(message) {
    const { curPage, pageSize } = message
    const statement = `SELECT * FROM productdetail LIMIT ?, ?`
    const p = pageSize == -1 ? 99999 : pageSize
    const result = await connection.execute(statement, [
      curPage == 0 ? curPage : (curPage - 1) * p,
      p
    ])

    return result[0]
  }

  // 产品总条数和总数目获取
  async loadAllProductsGetTotal(message) {
    const { pageSize } = message
    const statement = `SELECT count(*) total_records, CEIL(COUNT(*) / ?) total_pages
    FROM productdetail`
    const result = await connection.execute(statement, [
      pageSize == -1 ? 99999 : pageSize
    ])

    return result[0][0]
  }

  // 删除指定产品
  async deleteProduct(productID) {
    let statement = `SELECT * FROM ` + "`order`" + ` o WHERE o.productID = ?`
    const result = await connection.execute(statement, [productID])

    if (result[0].length !== 0) return false
    statement = `DELETE FROM productdetail WHERE ID = ?`
    await connection.execute(statement, [productID])

    return true
  }

  // 添加新产品
  async addNewProduct(message) {
    const {
      name,
      initialAmount,
      deadLine,
      rateOfComparative,
      rateOfReturn,
      salesChannels,
      riskRating
    } = message

    let statement = `INSERT INTO productdetail(name, salesChannels, initialAmount, deadLine, rateOfReturn, rateOfComparative, riskRating)
    VALUES(?, ?, ?, ?, ?, ?, ?
    )`
    const result = await connection.execute(statement, [
      name,
      salesChannels,
      initialAmount,
      deadLine,
      rateOfReturn,
      rateOfComparative,
      riskRating
    ])
    if (result[0]) {
      return true
    }
  }

  // 加载指定产品
  async loadSelectedProduct(ID) {
    const statement = `SELECT * FROM productdetail WHERE ID = ?`
    const result = await connection.execute(statement, [ID])

    return result[0][0]
  }

  // 修改指定产品
  async updateProduct(message) {
    const {
      id,
      name,
      initialAmount,
      deadLine,
      rateOfComparative,
      rateOfReturn,
      salesChannels,
      riskRating
    } = message
    const statement = `UPDATE productdetail SET
    name = ?, salesChannels = ?, initialAmount = ?, deadLine = ?, rateOfReturn = ?, rateOfComparative = ?, riskRating = ?
    WHERE ID = ? `
    await connection.execute(statement, [name, salesChannels, initialAmount, deadLine, rateOfReturn, rateOfComparative, riskRating, id])
    return true
  }
}

module.exports = new productManageService()
