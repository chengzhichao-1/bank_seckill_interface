
const Router = require("koa-router")
const {
  queryUsersByNPC,
  queryBlacklistByNPC,
  removeTheBlacklist,
  pullIntoTheBlacklist
} = require("../controller/customerManage.controller")

const adminManageRouter = new Router()

adminManageRouter.post("/queryUsersByNPC", queryUsersByNPC)
adminManageRouter.post("/queryBlacklistByNPC", queryBlacklistByNPC)
adminManageRouter.post("/removeTheBlacklist/:phone", removeTheBlacklist)
adminManageRouter.post("/pullIntoTheBlacklist/:phone", pullIntoTheBlacklist)

module.exports = adminManageRouter
