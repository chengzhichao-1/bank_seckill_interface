const Router = require("koa-router")
const {
  loadAllAQs,
  deleteAQ,
  insertAQ,
  loadSelectedAQ,
  updateAQ,

  loadAllAnnouncements,
  deleteAnnouncement,
  insertAnnouncement,
  loadSelectedAnnouncement,
  updateAnnouncement,

  loadAllImages,
  uploadImage,
  deleteImage
} = require("../controller/infoManage.controller")

const infoManageRouter = new Router()

infoManageRouter.get("/frequentlyaq/loadAllAQs", loadAllAQs)
infoManageRouter.delete("/frequentlyaq/deleteAQ/:id", deleteAQ)
infoManageRouter.post("/frequentlyaq/insertAQ", insertAQ)
infoManageRouter.get("/frequentlyaq/loadSelectedAQ/:id", loadSelectedAQ)
infoManageRouter.put("/frequentlyaq/updateAQ", updateAQ)

infoManageRouter.get("/announcement/getAllAnnouncements", loadAllAnnouncements)
infoManageRouter.delete("/announcement/deleteAnnouncement/:id", deleteAnnouncement)
infoManageRouter.post("/announcement/insertAnnouncement", insertAnnouncement)
infoManageRouter.get("/announcement/loadSelectedAnnouncement/:id", loadSelectedAnnouncement)
infoManageRouter.put("/announcement/updateAnnouncement", updateAnnouncement)

infoManageRouter.get("/indeximages/loadAllImages", loadAllImages)
infoManageRouter.post("/indeximages/uploadImages", uploadImage)
infoManageRouter.delete("/indeximages/deleteImage/:id", deleteImage)

module.exports = infoManageRouter
