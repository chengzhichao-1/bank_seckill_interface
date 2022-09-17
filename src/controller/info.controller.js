const infoService = require("../service/info.service")

class InfoController {
  // 获取公告信息
  async getAllAnnouncements(ctx, next) {
    try {
      const response = await infoService.getAllAnnouncements()
      ctx.body = {
        status: 200,
        message: response
      }
    } catch (error) {
      console.log(error)
    }
  }

  // 获取问答信息
  async getAllAQ(ctx, next) {
    const response = await infoService.getAllAQ()
    ctx.body = {
      status: 200,
      message: response
    }
  }

  // 获取首页轮播图片
  async loadAllImages(ctx, next) {
    const response = await infoService.loadAllImages()
    ctx.body = {
      status: 200,
      message: response
    }
  }
}

module.exports = new InfoController()
