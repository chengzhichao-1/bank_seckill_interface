const errorType = require("../constants/error-types")
const userService = require("../service/user.service")
const jwt = require("jsonwebtoken")
const {
  PUBLIC_KEY
} = require('../app/config')

const verifyLoginInfo = async (ctx, next) => {
  const loginInfo = ctx.request.body

  const result = await userService.login(loginInfo)
  console.log(loginInfo)
  console.log("verifyLoginInfo", result);

  if (result.length === 0) {
    const error = new Error(errorType.PHONE_OR_PASSWORD_IS_INCORRECT)
    return ctx.app.emit("error", error, ctx)
  }

  ctx.userInfo = result[0]

  next()
}

const verifyRegisterInfo = async (ctx, next) => {
  const {
    customerPhoneNumber,
    code
  } = ctx.request.body
  console.log(ctx.request.body)
  try {
    // 1. 判断用户填入信息是否合法
    // 前端已经判断

    // 2. 查询手机号是否被注册过
    let result = await userService.getPhone(customerPhoneNumber)
    console.log("查询手机号是否被注册过:", result);
    if (result.length !== 0) {
      const error = new Error(errorType.PHONE_ALREADY_EXISTS)
      return ctx.app.emit("error", error, ctx)
    }

    // 3. 查看验证码是否正确或过期
    const message = {
      customerPhoneNumber,
      code,
      curTime: new Date().getTime()
    }
    result = await userService.checkCode(message)
    console.log("查看验证码是否正确或过期:", result);
    if (result.length === 0) {
      const error = new Error(errorType.CODE_IS_EXPIRED_OR_INCORRECT)
      return ctx.app.emit("error", error, ctx)
    }

    await next()
  } catch (err) {
    console.log(err);
  }
}

const verifyCode = async (ctx, next) => {
  const {
    customerPhoneNumber,
    code
  } = ctx.request.body
  console.log(ctx.request.body)
  try {
    // 查看验证码是否正确或过期
    const message = {
      customerPhoneNumber,
      code,
      curTime: new Date().getTime()
    }
    result = await userService.checkCode(message)
    console.log("查看验证码是否正确或过期:", result);
    if (result.length === 0) {
      const error = new Error(errorType.CODE_IS_EXPIRED_OR_INCORRECT)
      return ctx.app.emit("error", error, ctx)
    }

    await next()
  } catch (err) {
    console.log(err);
  }
}

const verifyAuth = async (ctx, next) => {
  console.log("验证授权的middleware~");

  const authorization = ctx.header.authorization

  if (!authorization) {
    const error = new Error(errorType.NO_AUTHORIZATION)
    ctx.app.emit("error", error, ctx)
    return
  }
  const token = authorization.replace('Bearer ', '');

  // 倘若jwt的验证失败会自动抛出错误，因此需要通过try-catch包裹
  try {
    // 倘若jwt的验证成功，返回值为用户传入的payload+令牌派发时间+令牌过期时间
    const result = jwt.verify(token, PUBLIC_KEY, {
      algorithms: ["RS256"]
    })
    console.log("JWT payload:", result);
  } catch (err) {
    console.log("token过期 或 下一次中间件出错");
    console.log(error);
    const error = new Error(errorType.AUTHORIZATION_EXPIRED_OR_INCORRECT);
    ctx.app.emit('error', error, ctx);
  }
  await next();
}

module.exports = {
  verifyLoginInfo,
  verifyRegisterInfo,
  verifyAuth,
  verifyCode
}
