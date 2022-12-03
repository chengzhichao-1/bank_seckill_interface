const Router = require("koa-router")
const {
  login,
  test,
  sendMessage,
  register,
  getCustomerByPhoneNumber,
  getMyInfo,
  sendCardByPhone,
  refineInfo,
  bindCard,
  unBindCard
} = require("../controller/user.controller")
const {
  verifyLoginInfo,
  verifyCode,
  verifyAuth,
  verifyRegisterInfo
} = require("../middleware/user.middleware")

const userRouter = new Router({
  prefix: "/users"
})

userRouter.post("/login", verifyLoginInfo, login)
userRouter.get("/test", verifyAuth, test)
userRouter.post("/sendMessage", sendMessage)
userRouter.post("/register", verifyRegisterInfo, register)

userRouter.post("/getCustomerByPhoneNumber/:customerPhoneNumber", verifyAuth, getCustomerByPhoneNumber)
userRouter.post("/getMyInfo/:customerPhoneNumber", verifyAuth, getMyInfo)
userRouter.post("/sendCard", verifyAuth, sendCardByPhone)
userRouter.post("/refineInfo", verifyAuth, refineInfo)
userRouter.post("/bindCard", verifyAuth, verifyCode, bindCard)
userRouter.post("/unBindCard", verifyAuth, unBindCard)

module.exports = userRouter
