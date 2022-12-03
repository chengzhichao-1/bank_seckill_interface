
const Router = require("koa-router")
const {
  loadAllProducts,
  deleteProduct,
  addNewProduct,
  loadSelectedProduct,
  updateProduct
} = require("../controller/productManage.controller")

const productManageRouter = new Router({
  prefix: "/productdetail"
})

productManageRouter.post("/loadAllProducts", loadAllProducts)
productManageRouter.delete("/deleteProduct/:productID", deleteProduct)
productManageRouter.post("/addNewProduct", addNewProduct)
productManageRouter.get("/loadSelectedProduct/:productID", loadSelectedProduct)
productManageRouter.put("/updateProduct", updateProduct)

module.exports = productManageRouter
