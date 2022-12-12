const Router = require("koa-router")
const OrderController = {
  getPath,
  getSeckillResult,
  orderSecKill,
  getMySecKill,
  bankPay
} = require("../controller/order.controller")
const {
  verifyAuth
} = require("../middleware/user.middleware")

const orderRouter = new Router({
  prefix: "/order"
})

orderRouter.post("/getPath", verifyAuth, getPath.bind(OrderController))
// orderRouter.post("/getPath", verifyAuth, OrderController.getPath.bind(OrderController))
orderRouter.post("/getSeckillResult", verifyAuth, getSeckillResult.bind(OrderController))
orderRouter.post("/:path/orderSecKill", verifyAuth, orderSecKill.bind(OrderController))
orderRouter.post("/getMySecKill", verifyAuth, getMySecKill.bind(OrderController))
orderRouter.post("/bankPay", verifyAuth, bankPay)

module.exports = orderRouter
