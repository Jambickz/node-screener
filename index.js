const startRsiScreener = require('./src/index')
const schedule = require('node-schedule')
const TelegramBot = require('./src/service/telegramBot')

const chatId = process.env.TELEGRAM_USER_ID
const start = async () => {
  const messageResponse = await TelegramBot.sendMessage('Script Start', chatId)
  TelegramBot.pinMessage(chatId, messageResponse.message_id)
  schedule.scheduleJob('0 * * * *', () => {
    startRsiScreener()
  })
}

start()
