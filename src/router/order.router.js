const Router = require("koa-router")
const {
  getPath,
  getSeckillResult,
  orderSecKill,
  getMySecKill
} = require("../controller/order.controller")
const {
  verifyAuth
} = require("../middleware/user.middleware")

const orderRouter = new Router({
  prefix: "/order"
})

orderRouter.post("/getPath", verifyAuth, getPath)
orderRouter.get("/getSeckillResult", verifyAuth, getSeckillResult)
orderRouter.post("/:path/orderSecKill", verifyAuth, orderSecKill)
orderRouter.post("/getMySecKill", verifyAuth, getMySecKill)

module.exports = orderRouter
