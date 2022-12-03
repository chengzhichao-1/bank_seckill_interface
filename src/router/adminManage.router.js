
const Router = require("koa-router")
const {
  administratorLogin,
  selectAdministratorByGrade,
  selectAdAllInfo,
  updateAdministratorInformation,
  addAdministrators,
  deleteAdministrator,
  resetPassword
} = require("../controller/adminManage.controller")

const adminManageRouter = new Router()

adminManageRouter.post("/administratorLogin", administratorLogin)
adminManageRouter.post("/selectAdministratorByGrade", selectAdministratorByGrade)
adminManageRouter.post("/selectAdAllInfo/:id", selectAdAllInfo)
adminManageRouter.post("/updateAdministratorInformation", updateAdministratorInformation)
adminManageRouter.post("/addAdministrators", addAdministrators)
adminManageRouter.post("/deleteAdministrator", deleteAdministrator)
adminManageRouter.post("/resetPassword", resetPassword)

module.exports = adminManageRouter
