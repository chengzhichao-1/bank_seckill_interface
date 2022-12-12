const schedule = require("node-schedule")
const Redis = require("ioredis")
const md5 = require("js-md5")
const fs = require("fs")

const MQ = require("../utils/abmqlib")
const orderService = require("../service/order.service")
const { MQ_CONNECTION, CHANNEL_NAME } = require("../app/config")

const redisLuaScript = fs.readFileSync(
  process.cwd() + "/src/utils/sec-kill.lua"
)

const redis = new Redis({
  host: "127.0.0.1",
  port: 6379,
  password: "123456"
})

class OrderController {
  constructor() {
    this.activities = []
    this.activityMap = new Map()
    this.MQ = new MQ()

    this.MQ.initial(MQ_CONNECTION)
      .then(() => {
        // 消息队列消费者处理
        this.MQListening()
      })
      .catch((err) => {
        console.log("mq initial error", err)
      })

    // 请求产品数据
    this.updateActivities(true)

    // 每小时的59分30秒请求产品数据
    schedule.scheduleJob("30 59 * * * *", () => {
      this.updateActivities(false)
      console.log(new Date())
    })
  }
  // 消息队列消费者处理
  MQListening() {
    this.MQ.receiver(CHANNEL_NAME, async (payload, channel, msg) => {
      console.log("receiver", payload)
      const { result, userId, activityID } = payload
      let message // 提示语
      , orderID = "" // 订单编号

      if (result == -1) {
        message = "redis中出错"
      }
      // 2.判断专属秒杀链接是否正确
      else if (result == 2) {
        // TODO 因为在生成秒杀链接的阶段已经判断过 但凡不符合秒杀条件的很有可能是黄牛 一律加入小黑屋
        // 有没有可能是黄牛用别人的手机号乱请求呢？不可能的 还有一层中间件判断token token正确后才能来到这里
        message = "秒杀链接错误"
      }
      // 3.判断是否重复购买该商品
      else if (result == 3) {
        message = "您已购买过此商品"
      }
      // 4.判断库存是否充足
      else if (result == 0) {
        message = "库存不足"
      }
      // 5.购买成功
      else if (result == 1) {
        message = "抢购成功"
        try {
          orderID = await orderService.insertOrder(payload)
        } catch (error) {
          console.log(error)
        }
      }
      const key = `sec-kill-result:${userId}:${activityID}`
      redis.set(key, `${message}${orderID}`)
      redis.expire(key, 36000)
    })
  }
  // 更新活动信息
  async updateActivities(immediate) {
    try {
      const activities = await orderService.getActivities() // 查数据库查询所有产品
      this.activityMap.clear()
      activities.forEach((activity) => {
        const startTime = new Date(activity.startDate).getTime()
        const endTime = new Date(activity.endDate).getTime()
        const curTime = new Date(
          new Date().getTime() + (immediate ? 0 : 30000)
        ).getTime() // 59分30秒查询数据库 则加30秒模拟整点
        this.activityMap.set(activity.ID, { ...activity, startTime, endTime }) // 加入map便于之后用户秒杀快速判断是否在秒杀期间内

        if (startTime <= curTime && curTime <= endTime) {
          // 在抢购范围内
          // 计算过期秒数 +2秒是因为我认为 查数据库有时延 整除完可能也有时延 redis里
          const expireSecond = Math.floor((endTime - curTime) / 1000 + 2)
          const activityKey = `activity:${activity.ID}` // 存入redis的key
          // 设置产品过期时间 为了防止重复设置库存用setnx
          redis.setnx(activityKey, activity.remainAmount, (err, result) => {
            if (err) throw new Error(String(err))
            if (result) {
              redis.expire(activityKey, expireSecond)
            }
          })
          const orderKey = `order:${activity.ID}`
          redis.sadd(orderKey, "")
          // 设置订单set的过期时间
          redis.expire(orderKey, expireSecond)
        }
      })
      // console.log(this.activityMap);
    } catch (error) {
      console.log(error)
    }
  }

  // 获取秒杀链接
  async getPath(ctx, next) {
    try {
      const { phoneNumber, activityID } = ctx.request.body

      // 1.判断是否在秒杀期限内
      // 1.1活动是否存在
      const activity = this.activityMap.get(activityID)
      if (!activity) {
        ctx.body = {
          status: 400,
          message: "活动不存在"
        }
        return
      }

      // 1.2活动还没开始
      const curTime = new Date().getTime()
      if (activity.startTime > curTime) {
        ctx.body = {
          status: 400,
          message: "活动还未开始"
        }
        return
      }
      // 1.3活动已经结束
      else if (activity.endTime < curTime) {
        ctx.body = {
          status: 400,
          message: "活动已经结束"
        }
        return
      }

      // 2.判断是否重复购买该商品
      const orderKey = `order:${activity}`
      const orderValue = phoneNumber
      const isExist = await redis.sismember(orderKey, orderValue)
      if (isExist) {
        ctx.body = {
          status: 400,
          message: "您已购买过此商品"
        }
        return
      }

      const path = md5(`${phoneNumber}:${activity}:${new Date().getTime()}`)
      const pathKey = `path:${phoneNumber}:${activityID}`
      redis.set(pathKey, path)
      redis.expire(pathKey, 60) // 设置秒杀链接一分钟内过期

      ctx.body = {
        status: 200,
        message: path
      }
    } catch (error) {
      console.log(error)
    }
  }

  // 获取秒杀结果
  async getSeckillResult(ctx, next) {
    const { activityID, customerNumber } = ctx.request.body
    const key = `sec-kill-result:${customerNumber}:${activityID}`
    // 若没有缓存 则说明秒杀还没出结果
    const result = await redis.get(key)
    ctx.body = {
      status: 200,
      message: result ?? "正在秒杀中"
    }
  }

  // 秒杀
  async orderSecKill(ctx, next) {
    try {
      const { phoneNumber, activityID, customerNumber, orderChannel } =
        ctx.request.body
      const { path } = ctx.request.params

      // 1.判断是否在秒杀期限内
      // 1.1活动是否存在
      const activity = this.activityMap.get(activityID)
      if (!activity) {
        ctx.body = {
          status: 400,
          message: "活动不存在"
        }
        return
      }

      // 1.2活动还没开始
      const curTime = new Date().getTime()
      if (activity.startTime > curTime) {
        ctx.body = {
          status: 400,
          message: "活动还未开始"
        }
        return
      }
      // 1.3活动已经结束
      else if (activity.endTime < curTime) {
        ctx.body = {
          status: 400,
          message: "活动已经结束"
        }
        return
      }

      const pathKey = `path:${phoneNumber}:${activityID}`
      const orderKey = `order:${activityID}`
      const activityKey = `activity:${activityID}`

      // EVAL script numkeys key [key ...] arg [arg ...]
      // lua脚本 键名参数个数 Redis键key  附加参数
      redis.eval(
        redisLuaScript,
        5,
        pathKey,
        orderKey,
        customerNumber,
        activityKey,
        path,
        (err, result) => {
          const payload = {
            result: null,
            userId: customerNumber,
            activityID,
            orderChannel
          }
          if (err) {
            console.log("redis中出错", err)
            payload.result = -1
          } else {
            payload.result = result
          }
          this.MQ.send(CHANNEL_NAME, payload)
        }
      )

      ctx.body = {
        status: 200,
        message: "排队中"
      }
    } catch (error) {
      console.log(error)
    }
  }

  // 获取我的秒杀
  async getMySecKill(ctx, next) {
    const response = await orderService.getMySecKill(ctx.request.body)
    ctx.body = {
      status: 200,
      message: response
    }
  }

  // 支付
  async bankPay(ctx) {
    try {
      const response = await orderService.bankPay(ctx.request.body)
      ctx.body = {
        status: response ? 200 : 400,
        message: response ? "支付成功" : "银行卡密码错误或余额不足"
      }
    } catch (error) {
      console.log(error);
    }
  }
}

const orderController = new OrderController()

module.exports = orderController
