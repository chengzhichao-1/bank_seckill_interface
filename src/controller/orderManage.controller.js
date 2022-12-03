const orderManageService = require("../service/orderManage.service")

class OrderManageController {
  // 分页加载订单
  async getOrderList(ctx, next) {
    try {
      const list = await orderManageService.getOrderList(ctx.request.body)

      const { total_pages, total_records } =
        await orderManageService.getOrderListGetTotal(ctx.request.body)

      ctx.body = {
        status: 200,
        message: {
          data: list,
          total_pages: Number(total_pages),
          total_records: Number(total_records)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  // 统计订单的成交详情
  async getSalesCondition(ctx) {
    try {
      const list = await orderManageService.getSalesCondition()
      let countCnt = 0
      let profitCnt = 0

      list.forEach((item) => {
        countCnt += item.ordersCount
        profitCnt += item.profitCount
      })

      list.forEach((item) => {
        item.countPercent = (item.ordersCount / countCnt).toFixed(15)
        item.profitPercent = (item.profitCount / profitCnt).toFixed(15)
      })

      ctx.body = {
        status: 200,
        message: list
      }
    } catch (error) {
      console.log(error)
    }
  }

  // 统计产品的抢购情况
  async getLineChart(ctx) {
    try {
      const { productName, selectDate, time } = ctx.request.body
      let list
      if (time == 0) list = await orderManageService.getLineChartD(productName, selectDate)
      else if (time == 1) list = await orderManageService.getLineChartM(productName, selectDate)
      else if (time == 2) list = await orderManageService.getLineChartY(productName, selectDate)

      ctx.body = {
        status: 200,
        message: list
      }
    } catch (error) {
      console.log(error)
    }
  }

  // 获取风险拦截条目
  async getRiskBlockInfo(ctx) {
    try {
      const response = await orderManageService.getRiskBlockInfo()

      ctx.body = {
        status: 200,
        message: response
      }
    } catch (error) {
      console.log(error);
    }
  }

  // 修改风险拦截条目信息
  async updateRiskBlockInfo(ctx) {
    try {
      const response = await orderManageService.updateRiskBlockInfo(ctx.request.query)

      ctx.body = {
        status: 200,
        message: "修改成功"
      }
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new OrderManageController()
