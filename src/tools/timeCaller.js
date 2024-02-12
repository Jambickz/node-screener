const TelegramBot = require('../service/telegramBot')
const chatId = process.env.TELEGRAM_USER_ID
function formatTime (milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes} minutes ${seconds} seconds`
}

class TimeCaller {
  constructor () {
    this.startTime = 0
  }

  start () {
    this.startTime = new Date()
    TelegramBot.sendMessage('<b>Поиск сигнала</b>', chatId)
  }

  end (symbols) {
    const endTime = new Date()
    const elapsedTime = endTime - this.startTime
    const formattedTime = formatTime(elapsedTime)

    TelegramBot.sendMessage(`<b>Поиск окончен</b>\nПотрачено времени: ${formattedTime}\n\nПроверенно ${symbols.length} монет`, chatId)
  }
}

module.exports = new TimeCaller()
