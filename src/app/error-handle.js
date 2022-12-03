const errorTypes = require('../constants/error-types');

const errorHandler = (error, ctx) => {
  let status, message;

  switch (error.message) {
    case errorTypes.PHONE_ALREADY_EXISTS:
      status = 409; // conflict
      message = "该手机号已被注册~";
      break;
    case errorTypes.NO_AUTHORIZATION:
      status = 401; // 参数错误
      message = "请先登录~";
      break;
    case errorTypes.PHONE_OR_PASSWORD_IS_INCORRECT:
      status = 400;
      message = "手机号或密码错误~"
      break;
    case errorTypes.AUTHORIZATION_EXPIRED_OR_INCORRECT:
      status = 401;
      message = "授权过期或错误，请重新登录~"
      break;
    case errorTypes.CODE_IS_EXPIRED_OR_INCORRECT:
      status = 400;
      message = "验证码过期或错误~"
      break;
    default:
      status = 404;
      message = "NOT FOUND";
  }

  ctx.status = 200;
  ctx.body = {status, message};
}

module.exports = errorHandler;
