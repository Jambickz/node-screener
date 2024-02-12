const TelegramBot = require('./telegramBot')
const calculateRsi = require('../tools/calculatorRsi')

const FIRST_INTERVAL = process.env.FIRST_INTERVAL || '12h'
const SECOND_INTERVAL = process.env.SECOND_INTERVAL || '1h'

const HIGH_RSI_THRESHOLD = process.env.HIGH_RSI_THRESHOLD || 60
const LOW_RSI_THRESHOLD = process.env.LOW_RSI_THRESHOLD || 60

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

module.exports = async (symbols, client) => {
  try {
    for (let i = 0; i < symbols.length; i++) {
      try {
        // console.log(i + ' ' + symbols[i])
        const ohlcFirstInterval = await client.futuresCandles({
          symbol: symbols[i],
          interval: FIRST_INTERVAL,
          limit: process.env.LIMIT
        })
        const ohlcSecondInterval = await client.futuresCandles({
          symbol: symbols[i],
          interval: SECOND_INTERVAL,
          limit: process.env.LIMIT
        })

        const closingPricesFirstInterval = ohlcFirstInterval.map((candle) => parseFloat(candle.close))
        const closingPricesSecondInterval = ohlcSecondInterval.map((candle) => parseFloat(candle.close))

        const firstRsi = calculateRsi(closingPricesFirstInterval)
        const secondRsi = calculateRsi(closingPricesSecondInterval)

        if (firstRsi >= HIGH_RSI_THRESHOLD && secondRsi <= LOW_RSI_THRESHOLD) {
          const text = `<b>Signal: ${symbols[i]}</b>\nRSI 12h = <b>${firstRsi}</b>\nRSI 1h = <b>${secondRsi}</b>\n\nLink:\nhttps://ru.tradingview.com/chart/?symbol=BINANCE%3A${symbols[i]}.P\n\nLink:\nhttps://www.coinglass.com/tv/ru/Binance_${symbols[i]}`
          TelegramBot.sendMessage(text)
        }
        await delay(10)
      } catch (error) {
        const text = `Error processing symbol "${symbols[i]}":`
        console.error(text, error.message)
        TelegramBot.sendMessage(text + ' ' + error.message)
      }
    }
    return true
  } catch (error) {
    const text = 'Error processing symbols:'
    console.error(text, error.message)
    TelegramBot.sendMessage(text + ' ' + error.message)
    throw error
  }
}

//! !! Сделать обработчик ошибок в телеграмм
