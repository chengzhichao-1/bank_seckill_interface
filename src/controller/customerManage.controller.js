const customerManageService = require("../service/customerManage.service")
const { objWordNameFormat } = require("../utils/word-handle")

class customerManageController {
  // 分页查询用户信息
  async queryUsersByNPC(ctx, next) {
    try {
      const response = await customerManageService.queryUsersByNPC(
        ctx.request.body
      )
      const { total_records, total_pages } =
        await customerManageService.queryUsersByNPCGetTotal(ctx.request.body)
      const res = {
        total_records: Number(total_records),
        total_pages: Number(total_pages),
        data: response
      }
      ctx.body = {
        status: 200,
        message: res
      }
    } catch (error) {
      console.log(error)
    }
  }

   // 分页查询黑名单信息
   async queryBlacklistByNPC(ctx, next) {
    try {
      const response = await customerManageService.queryBlacklistByNPC(
        ctx.request.body
      )
      const { total_records, total_pages } =
        await customerManageService.queryBlacklistByNPCGetTotal(ctx.request.body)
      const res = {
        total_records: Number(total_records),
        total_pages: Number(total_pages),
        data: response
      }
      ctx.body = {
        status: 200,
        message: res
      }
    } catch (error) {
      console.log(error)
    }
  }

  // 移除黑名单
  async removeTheBlacklist(ctx) {
    try {
      const response = await customerManageService.removeTheBlacklist(
        ctx.request.params.phone
      )
      if (response) {
        ctx.body = {
          status: 200,
          message: "删除成功"
        }
      }
    } catch(e) {
      console.log(e);
    }
  }

  // 拉入黑名单
  async pullIntoTheBlacklist(ctx) {
    try {
      const response = await customerManageService.pullIntoTheBlacklist(
        ctx.request.params.phone
      )
      if (response) {
        ctx.body = {
          status: 200,
          message: "删除成功"
        }
      }
    } catch(e) {
      console.log(e);
    }
  }

}

module.exports = new customerManageController()
