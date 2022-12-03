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

infoRouter.post("/announcement/getAllAnnouncements", getAllAnnouncements)
infoRouter.get("/frequently-aq/getAllAQ", getAllAQ)
infoRouter.post("/indeximages/loadAllImages", loadAllImages)

module.exports = infoRouter
