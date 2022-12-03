
const Router = require("koa-router")
const {
  getOrderList,
  getSalesCondition,
  getLineChart,

  getRiskBlockInfo,
  updateRiskBlockInfo
} = require("../controller/orderManage.controller")

const orderManageRouter = new Router({
  prefix: "/order"
})

orderManageRouter.post("/getOrderList", getOrderList)
orderManageRouter.post("/getSalesCondition", getSalesCondition)
orderManageRouter.post("/getLineChart", getLineChart)

orderManageRouter.post("/getRiskBlockInfo", getRiskBlockInfo)
orderManageRouter.post("/updateRiskBlockInfo", updateRiskBlockInfo)

module.exports = orderManageRouter
