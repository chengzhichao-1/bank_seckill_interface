const infoManageService = require("../service/infoManage.service")
const COS = require("cos-nodejs-sdk-v5")
const { SecretId, SecretKey, Bucket, Region, prefix } = require("../app/config")

const cos = new COS({
  SecretId,
  SecretKey
})

class InfoManageController {
  // 加载所有常见问答
  async loadAllAQs(ctx, next) {
    try {
      const response = await infoManageService.loadAllAQs()
      ctx.body = {
        status: 200,
        message: response
      }
    } catch (error) {
      console.log(error)
    }
  }

  // 删除指定常见问答
  async deleteAQ(ctx, next) {
    try {
      await infoManageService.deleteAQ(ctx.request.params.id)
      ctx.body = {
        status: 200,
        message: "删除成功"
      }
    } catch (error) {
      console.log(error)
    }
  }

  // 新增常见问答
  async insertAQ(ctx) {
    try {
      await infoManageService.insertAQ(ctx.request.body)
      ctx.body = {
        status: 200,
        message: "新增成功"
      }
    } catch (error) {
      console.log(error)
    }
  }

  // 加载指定常见问答
  async loadSelectedAQ(ctx) {
    try {
      const response = await infoManageService.loadSelectedAQ(
        ctx.request.params.id
      )
      ctx.body = {
        status: 200,
        message: response
      }
    } catch (error) {
      console.log(error)
    }
  }

  // 修改指定常见问答
  async updateAQ(ctx) {
    try {
      await infoManageService.updateAQ(ctx.request.body)
      ctx.body = {
        status: 200,
        message: "修改成功"
      }
    } catch (error) {
      console.log(error)
    }
  }

  // 加载所有公告
  async loadAllAnnouncements(ctx, next) {
    try {
      const response = await infoManageService.loadAllAnnouncements()
      ctx.body = {
        status: 200,
        message: response
      }
    } catch (error) {
      console.log(error)
    }
  }

  // 删除指定公告
  async deleteAnnouncement(ctx, next) {
    try {
      await infoManageService.deleteAnnouncement(ctx.request.params.id)
      ctx.body = {
        status: 200,
        message: "删除成功"
      }
    } catch (error) {
      console.log(error)
    }
  }

  // 新增公告
  async insertAnnouncement(ctx) {
    try {
      await infoManageService.insertAnnouncement(ctx.request.body)
      ctx.body = {
        status: 200,
        message: "新增成功"
      }
    } catch (error) {
      console.log(error)
    }
  }

  // 加载指定公告
  async loadSelectedAnnouncement(ctx) {
    try {
      const response = await infoManageService.loadSelectedAnnouncement(
        ctx.request.params.id
      )
      ctx.body = {
        status: 200,
        message: response
      }
    } catch (error) {
      console.log(error)
    }
  }

  // 修改指定公告
  async updateAnnouncement(ctx) {
    try {
      await infoManageService.updateAnnouncement(ctx.request.body)
      ctx.body = {
        status: 200,
        message: "修改成功"
      }
    } catch (error) {
      console.log(error)
    }
  }

  // 加载首页所有图片
  async loadAllImages(ctx) {
    try {
      const response = await infoManageService.loadAllImages()
      ctx.body = {
        status: 200,
        message: response
      }
    } catch (error) {
      console.log(error)
    }
  }

  // 上传首页图像
  async uploadImage(ctx) {
    try {
      const { base64Code, picName, picType } = ctx.request.body
      const dataBuffer = Buffer.from(base64Code, "base64")
      const data = await cos.putObject({
        Bucket,
        Region,
        Key: prefix + new Date().getTime() + `.${picType}`,
        Body: dataBuffer,
        onProgress: function (progressData) {
          console.log(progressData)
        }
      })

      const imageUrl = `https://${data.Location}`
      console.log("上传图片的url为", imageUrl)
      await infoManageService.uploadImage(imageUrl)
      ctx.body = {
        status: 200,
        message: imageUrl
      }
    } catch (error) {
      console.log(error)
    }
  }

  // 删除指定图片
  async deleteImage(ctx) {
    try {
      const response = await infoManageService.deleteImage(
        ctx.request.params.id
      )
      if (response) {
        ctx.body = {
          status: 200,
          message: "删除成功"
        }
      }
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = new InfoManageController()
