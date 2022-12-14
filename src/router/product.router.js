const Router = require("koa-router")
const {
  getFutureProduct,
  getProductDetail,
  getProductList,
  getProductInActivity
} = require("../controller/product.controller")
const { verifyAuth } = require("../middleware/user.middleware")

const productRouter = new Router({
  prefix: "/product"
})

productRouter.post("/getFutureProduct", getFutureProduct)
productRouter.post("/getProductDetail/:activityID", getProductDetail)
productRouter.post("/getProductList", getProductList)
productRouter.post("/getProductInActivity", getProductInActivity)

module.exports = productRouter
