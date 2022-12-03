
const Router = require("koa-router")
const {
  loadAllActivities,
  deleteActivity,
  addNewActivity,
  loadSelectedActivity,
  updateActivity
} = require("../controller/activityManage.controller")

const activityManageRouter = new Router({
  prefix: "/activity"
})

activityManageRouter.post("/loadAllActivities", loadAllActivities)
activityManageRouter.delete("/deleteActivity/:activityID", deleteActivity)
activityManageRouter.post("/addNewActivity", addNewActivity)
activityManageRouter.get("/loadSelectedActivity/:activityID", loadSelectedActivity)
activityManageRouter.put("/updateActivity", updateActivity)

module.exports = activityManageRouter
