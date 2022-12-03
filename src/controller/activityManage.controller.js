const activityManageService = require("../service/activityManage.service")
const { objWordNameFormat } = require("../utils/word-handle")

class ActivityManageController {
  // 加载所有活动
  async loadAllActivities(ctx, next) {
    try {
      const list = await activityManageService.loadAllActivities(ctx.request.body)

      const { total_pages, total_records } =
        await activityManageService.loadAllActivitiesGetTotal(ctx.request.body)

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

  // 删除指定活动
  async deleteActivity(ctx) {
    try {
      const response = await activityManageService.deleteActivity(
        ctx.request.params.activityID
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

  // 添加新活动
  async addNewActivity(ctx) {
    try {
      const response = await activityManageService.addNewActivity(
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

  // 加载指定活动
  async loadSelectedActivity(ctx) {
    try {
      const response = await activityManageService.loadSelectedActivity(
        ctx.request.params.activityID
      )

      ctx.body = {
        status: 200,
        message: response
      }
    } catch (error) {
      console.log(error)
    }
  }

  // 修改指定活动
  async updateActivity(ctx) {
    try {
      const response = await activityManageService.updateActivity(
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

module.exports = new ActivityManageController()
