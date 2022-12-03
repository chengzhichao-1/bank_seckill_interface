const orderService = require("../service/order.service")

class OrderController {
  // 获取秒杀链接
  async getPath(ctx, next) {
    try {
      const response = await orderService.getPath(ctx.request.body)
      ctx.body = {
        status: 200,
        message: response
      }
    } catch (error) {
      console.log(error)
    }
  }

  // 获取秒杀结果
  async getSeckillResult(ctx, next) {
    const response = await orderService.getSeckillResult(ctx.request.body)
    ctx.body = {
      status: 200,
      message: response
    }
  }

  // 秒杀
  async orderSecKill(ctx, next) {
    const response = await orderService.orderSecKill(ctx.request.body)
    ctx.body = {
      status: 200,
      message: response
    }
  }

  // 获取我的秒杀
  async getMySecKill(ctx, next) {
    const response = await orderService.getMySecKill(ctx.request.body)
    ctx.body = {
      status: 200,
      message: response
    }
  }
}

module.exports = new OrderController()
