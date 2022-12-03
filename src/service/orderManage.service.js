const connection = require("../app/database")
const moment = require("moment")

class orderManageService {
  // 获取订单列表
  async getOrderList(message) {
    const {
      curPage,
      pageSize,
      startDate,
      endDate,
      productName,
      userName = ""
    } = message
    const statement =
      "SELECT o.ID id, c.customer_name customerName, p.name, p.initialAmount, date_format(o.generateDate,'%Y-%m-%d %H:%I:%s') generateDate, o.status FROM `order` " +
      `o LEFT JOIN customer c ON c.customer_number = o.customerID LEFT JOIN productdetail p ON p.ID = o.productID
      WHERE c.customer_name LIKE '%${userName ?? ""}%'
      ${productName ? " AND p.name = '" + productName + "'" : ""}
      ${startDate ? " AND o.generateDate > '" + startDate + "'" : ""}
      ${endDate ? " AND o.generateDate < '" + endDate + "'" : ""}
       LIMIT ?, ?`
    const result = await connection.execute(statement, [
      curPage == 0 ? 0 : (curPage - 1) * pageSize,
      pageSize
    ])

    return result[0]
  }

  // 获取订单列表记录数和页码
  async getOrderListGetTotal(message) {
    const {
      curPage,
      pageSize,
      startDate,
      endDate,
      productName,
      userName = ""
    } = message
    const statement =
      "SELECT count(*) total_records, CEIL(COUNT(*) / ?) total_pages FROM `order` " +
      `o LEFT JOIN customer c ON c.customer_number = o.customerID LEFT JOIN productdetail p ON p.ID = o.productID
      WHERE c.customer_name LIKE '%${userName ?? ""}%'
      ${productName ? " AND p.name = '" + productName + "'" : ""}
      ${startDate ? " AND o.generateDate > '" + startDate + "'" : ""}
      ${endDate ? " AND o.generateDate < '" + endDate + "'" : ""}`
    const result = await connection.execute(statement, [pageSize])

    return result[0][0]
  }

  // 统计订单的成交详情
  async getSalesCondition(message) {
    const statement =
      `SELECT p.name productName, SUM(p.initialAmount) profitCount, COUNT(*) ordersCount
    FROM ` +
      "`order`" +
      ` o
    LEFT JOIN productdetail p
    ON o.productID = p.ID
    GROUP BY p.ID`
    const result = await connection.execute(statement, [])

    return result[0]
  }

  // 统计产品的抢购情况 - 某年每月
  async getLineChartY(productName, selectDate) {
    const year = moment(new Date(selectDate)).format("YYYY")
    const statement =
      `SELECT
        COUNT( o.productID ) AS count,
        DATE_FORMAT( o.generateDate, "%m") AS generateDate
      FROM
        productdetail AS p
      LEFT JOIN
        ` +
      "`order`" +
      ` AS o
      ON
        p.ID = o.productID
      WHERE
        p.name = ?
      AND
        o.generateDate >= '${year}-01-01 00:00:00'
      AND
        o.generateDate < '${year + 1}-01-01 00:00:00'
      GROUP BY
        DATE_FORMAT( o.generateDate, "%m" )`
    const result = await connection.execute(statement, [productName])

    const res = {}
    for (let i = 1; i <= 12; i++) {
      res[i] = 0
    }
    result[0].forEach((item) => {
      res[Number(item.generateDate)] = item.count
    })

    return res
  }

  // 统计产品的抢购情况 - 某月每天
  async getLineChartM(productName, selectDate) {
    const start = moment(new Date(selectDate)).format("YYYY-MM-DD 00:00:00")
    const year = Number(start.substring(0, 4))
    const month = Number(start.substring(5, 7))
    let end
    if (month == 12) {
      end = `${year + 1}-01-01 00:00:00`
    } else {
      const curMonth = month + 1
      end = `${year}-${curMonth < 10 ? "0" + curMonth : curMonth}-01 00:00:00`
    }
    const statement =
      `SELECT
        COUNT( o.productID ) AS count,
        DATE_FORMAT( o.generateDate, "%d") AS generateDate
      FROM
        productdetail AS p
      LEFT JOIN
        ` +
      "`order`" +
      ` AS o
      ON
        p.ID = o.productID
      WHERE
        p.name = ?
      AND
        o.generateDate >= ?
      AND
        o.generateDate < ?
      GROUP BY
        DATE_FORMAT( o.generateDate, "%d" )`
    const result = await connection.execute(statement, [
      productName,
      start,
      end
    ])

    const res = {}
    for (let i = 0; i <= 28; i++) {
      res[i] = 0
    }
    if (
      month == 1 ||
      month == 3 ||
      month == 5 ||
      month == 7 ||
      month == 8 ||
      month == 10 ||
      month == 12
    ) {
      for (let i = 29; i <= 31; i++) {
        res[i] = 0
      }
    } else if (month == 2) {
      if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
        res[29] = 0
      }
    } else {
      for (let i = 29; i <= 30; i++) {
        res[i] = 0
      }
    }
    result[0].forEach((item) => {
      res[Number(item.generateDate)] = item.count
    })

    return res
  }

  // 统计产品的抢购情况 - 某天每时
  async getLineChartD(productName, selectDate) {
    const start = moment(new Date(selectDate)).format("YYYY-MM-DD 00:00:00")
    const end = moment(
      new Date(new Date(selectDate).getTime() + 1000 * 60 * 60 * 24)
    ).format("YYYY-MM-DD 00:00:00")
    const statement =
      `SELECT
        COUNT( o.productID ) AS count,
        DATE_FORMAT( o.generateDate, "%H") AS generateDate
      FROM
        productdetail AS p
      LEFT JOIN
        ` +
      "`order`" +
      ` AS o
      ON
        p.ID = o.productID
      WHERE
        p.name = ?
      AND
        o.generateDate >= ?
      AND
        o.generateDate < ?
      GROUP BY
        DATE_FORMAT( o.generateDate, "%H" )`
    const result = await connection.execute(statement, [
      productName,
      start,
      end
    ])

    const res = {}
    for (let i = 0; i <= 23; i++) {
      res[i] = 0
    }
    result[0].forEach((item) => {
      res[Number(item.generateDate)] = item.count
    })

    return res
  }

  // 获取风险拦截条目
  async getRiskBlockInfo() {
    const statement = `SELECT list.description, list.id, list.name, list.state, parent.name pName, parent.id pID, parent.description pDesc
    FROM riskblocklist list
    INNER JOIN riskblockparents parent
    ON list.parentID = parent.id`
    const result = await connection.execute(statement)

    const handleRes = result[0].reduce((prev, cur) => {
      const { pID, pName, pDesc, ...restProps } = cur
      const index = prev.findIndex((v) => v.id === cur.pID)
      if (index === -1) {
        prev.push({
          children: [
            {
              ...restProps
            }
          ],
          id: pID,
          desc: pDesc,
          name: pName
        })
      } else {
        prev[index].children.push({ ...restProps })
      }
      return prev
    }, [])

    return handleRes
  }

  // 修改风险拦截条目信息
  async updateRiskBlockInfo(message) {
    const {
      id,
      state
    } = message
    const statement = `UPDATE riskblocklist
    SET state = ?
    WHERE id = ?`
    const response = await connection.execute(statement, [state, id])
    return response ? true : false
  }
}

module.exports = new orderManageService()
