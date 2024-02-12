const TelegramBot = require('node-telegram-bot-api')

class MyTelegramBot {
  constructor (token) {
    this.bot = new TelegramBot(token, { polling: true })
    this.setupHandlers()
    this.opts = { parse_mode: 'HTML' }
  }

  setupHandlers () {
    this.bot.onText(/\/echo (.+)/, (msg, match) => {
      const chatId = msg.chat.id
      const resp = match[1]
      this.bot.sendMessage(chatId, resp)
    })

    this.bot.on('message', (msg) => {
      const chatId = msg.chat.id
      this.bot.sendMessage(chatId, msg.text)
    })
  }

  sendMessage (message, chatId) {
    this.bot.sendMessage(chatId || process.env.TELEGRAM_CHAT_ID, message, this.opts)
  }
}

const token = process.env.TELEGRAM_TOKEN
module.exports = new MyTelegramBot(token)
