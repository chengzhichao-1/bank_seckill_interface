const mqLib = require("amqplib/callback_api")

class MQ {
  constructor() {
    this.connection = null
    this.pChannel = null
    this.cChannel = null
  }

  initial(connectionSetting) {
    return new Promise((resolve, reject) => {
      mqLib.connect(connectionSetting, (err, connection) => {
        if (err) {
          reject(err)
          return
        }
        this.connection = connection
        const p1 = new Promise((resolve, reject) => {
          connection.createChannel((err, channel) => {
            if (err) {
              reject(err)
              return
            }
            this.pChannel = channel
            resolve(null)
          })
        })
        const p2 = new Promise((resolve, reject) => {
          connection.createChannel((err, channel) => {
            if (err) {
              reject(err)
              return
            }
            this.cChannel = channel
            resolve(null)
          })
        })
        Promise.all([p1, p2]).then(() => {
          resolve(null)
        }).catch((err) => {
          reject(err)
        })
      })
    })
  }

  send(channelName, payload) {
    return new Promise((resolve, reject) => {
      if (!this.connection || !this.pChannel) {
        reject(new Error("connection or channel not ready!"))
        return
      }
      console.log("post", payload)
      this.pChannel.assertQueue(channelName, {
        durable: true
      })
      this.pChannel.sendToQueue(
        channelName,
        Buffer.from(JSON.stringify(payload)),
        {
          persistent: true
        }
      )
      resolve(null)
    })
  }

  receiver(channelName, handler) {
    return new Promise((resolve, reject) => {
      if (!this.cChannel) {
        reject(new Error("channel not ready!"))
      }
      this.cChannel.assertQueue(channelName, {
        durable: true
      })
      // this.cChannel.prefetch(1)
      this.cChannel.consume(
        channelName,
        (msg) => {
          handler(JSON.parse(msg.content.toString()), this.cChannel, msg)
        },
        {
          noAck: true
        }
      )
      resolve(null)
    })
  }
}

module.exports = MQ
