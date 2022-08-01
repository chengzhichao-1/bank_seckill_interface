const Router = require("koa-router")
const {
  login,
  test,
  sendMessage,
  register
} = require("../controller/user.controller")
const {
  verifyLoginInfo,
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

module.exports = userRouter
