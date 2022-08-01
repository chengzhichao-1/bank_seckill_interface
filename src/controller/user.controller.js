const jwt = require("jsonwebtoken")
const Core = require('@alicloud/pop-core');
const {
  PRIVATE_KEY
} = require("../app/config")
const userService = require("../service/user.service")
const {
  EXPIRATION_TIME
} = require("../constants/index")

class UserController {
  async login(ctx, next) {
    const userInfo = ctx.userInfo
    const {
      customer_number,
      customer_phone_number
    } = userInfo

    // 生成签名
    const token = jwt.sign({
      customer_number,
      customer_phone_number
    }, PRIVATE_KEY, {
      expiresIn: 60 * 60 * 24, // 过期时间（单位：s秒）
      algorithm: 'RS256' // 指定算法
    })

    ctx.body = {
      status: 200,
      message: {
        token: `Bearer ${token}`,
        userInfo
      }
    }
  }

  async sendMessage(ctx, next) {
    const customerPhoneNumber = ctx.request.query.customerPhoneNumber;

    const AppCode = "e3a662086c9b4f6ba12032ca2a0555cb"
    const AppKey = "204094783"
    const AppSecret = "uyre1W7CEcRjMUNN9kOHmXz4tKeXABxG"
    const Host = "https://dfsns.market.alicloudapi.com"
    const Path = "/data/send_sms"
    const templateId = "TPL_0000"

    const client = new Core({
      accessKeyId: AppKey,
      accessKeySecret: AppSecret,
      endpoint: Host + Path,
      apiVersion: '2017-05-25'
    });

    // 生成n位随机0~9的验证码
    const geneRandomCode = (n) => {
      let code = ""
      for (let i = 0; i < n; i++) {
        code += parseInt(Math.random() * 10)
      }
      return code
    }
    const code = geneRandomCode(6)

    const params = {
      content: `code:${code}`,
      ["phone_number"]: customerPhoneNumber,
      ["template_id"]: templateId
    }

    const requestOption = {
      method: 'POST',
      formatParams: false,
      headers: {
        Authorization: `APPCODE ${AppCode}`,
        ["Content-Type"]: "application/x-www-form-urlencoded; charset=UTF-8"
      }
    }

    try {
      const response = await client.request('SendSms', params, requestOption)
      // console.log('response', response)
      // const response = {
      //   status: 'OK'
      // }
      if (response.status === 'OK') {
        const message = {
          customerPhoneNumber,
          code,
          expirationTime: new Date().getTime() + EXPIRATION_TIME + ""
        }
        console.log(message);
        await userService.saveSMSCode(message)
        ctx.body = {
          code: '200',
          message: '发送成功'
        }
      } else {
        ctx.body = {
          code: '400',
          message: '发送失败'
        }
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  async register(ctx, next) {
    const {
      customerPhoneNumber,
      customerPassword
    } = ctx.request.body
    const message = {
      customerPhoneNumber,
      customerPassword
    }
    await userService.register(message)
    ctx.body = {
      status: 200,
      message: "注册成功~"
    }
  }

  test(ctx) {
    ctx.body = "test"
  }
}

module.exports = new UserController()
