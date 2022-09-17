const productService = require("../service/product.service")
const {
  ACTIVITY_START_TIME,
  ACTIVITY_END_TIME,
  ACTIVITY_START_TIME_FORMAT,
  ACTIVITY_END_TIME_FORMAT,
} = require("../constants/format-name")

const formatDate = require("../utils/date-handle")

class ProductController {
  // 获取未来产品
  async getFutureProduct(ctx, next) {
    try {
      const response = await productService.getFutureProduct()

      // 添加时间格式化开始结束时间
      response.forEach(item => {
        item[ACTIVITY_START_TIME_FORMAT] = formatDate(item[ACTIVITY_START_TIME])
        item[ACTIVITY_END_TIME_FORMAT] = formatDate(item[ACTIVITY_END_TIME])
      })

      ctx.body = {
        status: 200,
        message: response
      }
    } catch (error) {
      console.log(error)
    }
  }

  // 获取产品详情
  async getProductDetail(ctx, next) {
    try {
      const { activityID } = ctx.request.params

      const response = await productService.getProductDetail(activityID)

      ctx.body = {
        status: 200,
        message: response
      }
    } catch (error) {
      console.log(error)
    }
  }

  // 获取产品列表
  async getProductList(ctx, next) {
    try {
      const [ {total_pages, total_records} ] = await productService.getPagesAndRecordsByPageSize(ctx.request.body)
      const products = await productService.getProductList(ctx.request.body)

      // 添加时间格式化开始结束时间
      products.forEach(item => {
        item[ACTIVITY_START_TIME_FORMAT] = formatDate(item[ACTIVITY_START_TIME])
        item[ACTIVITY_END_TIME_FORMAT] = formatDate(item[ACTIVITY_END_TIME])
      })

      ctx.body = {
        status: 200,
        message: {
          data: products,
          total_pages,
          total_records
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  // 获取当前产品
  async getProductInActivity(ctx, next) {
    try {
      const response = await productService.getProductInActivity()

      // 添加时间格式化开始结束时间
      response.forEach(item => {
        item[ACTIVITY_START_TIME_FORMAT] = formatDate(item[ACTIVITY_START_TIME])
        item[ACTIVITY_END_TIME_FORMAT] = formatDate(item[ACTIVITY_END_TIME])
      })

      ctx.body = {
        status: 200,
        message: response
      }
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = new ProductController()
