const productManageService = require("../service/productManage.service")
const { objWordNameFormat } = require("../utils/word-handle")

class ProductManageController {
  // 加载所有产品
  async loadAllProducts(ctx, next) {
    try {
      const list = await productManageService.loadAllProducts(ctx.request.body)

      const { total_pages, total_records } =
        await productManageService.loadAllProductsGetTotal(ctx.request.body)

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

  // 删除指定产品
  async deleteProduct(ctx) {
    try {
      const response = await productManageService.deleteProduct(
        ctx.request.params.productID
      )

      if (response) {
        ctx.body = {
          status: 200,
          message: "删除成功"
        }
      } else {
        ctx.body = {
          status: 400,
          message: "删除失败"
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  // 添加新产品
  async addNewProduct(ctx) {
    try {
      const response = await productManageService.addNewProduct(
        ctx.request.body
      )
      if (response) {
        ctx.body = {
          status: 200,
          message: "添加成功"
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  // 加载指定产品
  async loadSelectedProduct(ctx) {
    try {
      const response = await productManageService.loadSelectedProduct(
        ctx.request.params.productID
      )

      ctx.body = {
        status: 200,
        message: response
      }
    } catch (error) {
      console.log(error)
    }
  }

  // 修改指定产品
  async updateProduct(ctx) {
    try {
      const response = await productManageService.updateProduct(
        ctx.request.body
      )

      if (response)
        ctx.body = {
          status: 200,
          message: "修改成功"
        }
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = new ProductManageController()
