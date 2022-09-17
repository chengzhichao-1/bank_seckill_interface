const Router = require("koa-router")
const {
  getAllAnnouncements,
  getAllAQ,
  loadAllImages
} = require("../controller/info.controller")
const {
  verifyAuth
} = require("../middleware/user.middleware")

const infoRouter = new Router()

infoRouter.post("/announcement/getAllAnnouncements", verifyAuth, getAllAnnouncements)
infoRouter.get("/frequently-aq/getAllAQ", verifyAuth, getAllAQ)
infoRouter.post("/indeximages/loadAllImages", verifyAuth, loadAllImages)

module.exports = infoRouter
