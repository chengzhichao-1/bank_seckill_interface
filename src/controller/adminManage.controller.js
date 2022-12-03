const adminManageService = require("../service/adminManage.service")
const { objWordNameFormat } = require("../utils/word-handle")

class AdminManageController {
  // 管理员登录
  async administratorLogin(ctx, next) {
    try {
      const response = await adminManageService.administratorLogin(ctx.request.query)
      if (response) {
        ctx.body = {
          status: 200,
          message: response
        }
      } else {
        ctx.body = {
          status: 400
        }
      }

    } catch (error) {
      console.log(error)
    }
  }

  // 获取管理员列表
  async selectAdministratorByGrade(ctx, next) {
    try {
      const {total_pages, total_records} = await adminManageService.getPagesAndRecordsByPageSize(ctx.request.query)
      const products = await adminManageService.selectAdministratorByGrade(ctx.request.query)

      ctx.body = {
        status: 200,
        message: {
          data: products,
          total_pages: Number(total_pages),
          total_records
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  // 根据身份证获取管理员详细信息
  async selectAdAllInfo(ctx, next) {
    try {
      const response = await adminManageService.selectAdAllInfo(ctx.request.params.id)
      const res = objWordNameFormat(response)
      console.log(res);

      ctx.body = {
        status: 200,
        message: res
      }
    } catch (error) {
      console.log(error)
    }
  }

  // 更新管理员信息
  async updateAdministratorInformation(ctx) {
    try {
      const response = await adminManageService.updateAdministratorInformation(ctx.request.query)

      ctx.body = {
        status: 200,
        message: '更新成功'
      }
    } catch (error) {
      console.log(error);
    }
  }

  // 添加分管理员
  async addAdministrators(ctx) {
    try {
      const response = await adminManageService.addAdministrators(ctx.request.query)

      if (response) {
        ctx.body = {
          status: 200,
          message: '添加成功'
        }
      } else {
        ctx.body = {
          status: 400,
          message: '身份证或手机号重复'
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  // 删除分管理员
  async deleteAdministrator(ctx) {
    try {
      const response = await adminManageService.deleteAdministrator(ctx.request.query)

      if (response) {
        ctx.body = {
          status: 200,
          message: '删除成功'
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  // 重置分管理员的密码
  async resetPassword(ctx) {
    try {
      const response = await adminManageService.resetPassword(ctx.request.query)

      if (response) {
        ctx.body = {
          status: 200,
          message: '重置成功'
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

}

module.exports = new AdminManageController()
