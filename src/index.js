const TelegramBot = require('./service/telegramBot')
const Binance = require('binance-api-node').default
const fetchSymbols = require('./tools/fetchSymbols')
const processSignals = require('./service/processSignals')
const TimeCaller = require('./tools/timeCaller')

// eslint-disable-next-line no-unused-vars
const testSymbols = [
  'XTZUSDT', 'ZENUSDT', 'EOSUSDT', 'STPTUSDT',
  'MINAUSDT', 'BNXUSDT', 'ORDIUSDT', 'GLMRUSDT',
  'ETHUSDT_240329', 'MANAUSDT', 'BICOUSDT', 'KSMUSDT',
  'GMXUSDT', 'HIGHUSDT', 'SXPUSDT', 'ZILUSDT',
  'NEOUSDT', 'COMPUSDT', 'SNXUSDT', 'RENUSDT',
  'PENDLEUSDT', 'BLURUSDT', 'POLYXUSDT', 'NEARUSDT',
  'NKNUSDT', 'BELUSDT', 'RDNTUSDT', 'GMTUSDT',
  'SKLUSDT', 'ZRXUSDT', 'ROSEUSDT', 'ARPAUSDT',
  '1INCHUSDT', 'AUCTIONUSDT', '1000SHIBUSDT', 'AMBUSDT',
  'ENJUSDT', 'AAVEUSDT', 'ILVUSDT', 'RIFUSDT',
  'ANKRUSDT', 'ATOMUSDT', 'SSVUSDT', 'BATUSDT',
  'ASTRUSDT', 'MATICUSDT', 'OPUSDT', 'MBLUSDT',
  'ARUSDT', 'LRCUSDT', 'ACHUSDT', 'FETUSDT',
  'XMRUSDT', 'BADGERUSDT', 'WIFUSDT', 'BLUEBIRDUSDT',
  'COMBOUSDT', 'PEOPLEUSDT', 'BAKEUSDT', 'XAIUSDT',
  'OXTUSDT', 'ZECUSDT', 'XEMUSDT', 'TOMOUSDT',
  'AXSUSDT', 'YFIUSDT', 'MAVUSDT', 'ICXUSDT',
  'TRBUSDT', 'IDEXUSDT', 'LOOMUSDT', 'DODOXUSDT',
  'ALGOUSDT', 'ADAUSDT', 'CTSIUSDT', 'KEYUSDT',
  'STORJUSDT', 'BTCUSDC', 'WAVESUSDT', 'ETHBTC',
  'XLMUSDT', '1000SATSUSDT', 'ALPHAUSDT', 'KASUSDT',
  'CKBUSDT', 'DOTUSDT', 'MDTUSDT', '1000XECUSDT',
  'EDUUSDT', 'WOOUSDT', 'IOSTUSDT', 'API3USDT',
  'ENSUSDT', 'BSVUSDT', 'IDUSDT', 'BONDUSDT',
  'OGNUSDT', 'FOOTBALLUSDT', 'UNFIUSDT', 'LITUSDT']
const chatId = process.env.TELEGRAM_USER_ID

module.exports = async () => {
  try {
    const client = await new Binance()
    client.time().then(time => {
      console.error(`Connected to Binance. Time: ${time}`)
      // TelegramBot.sendMessage(`Connected to Binance. Time: ${new Date(time)}`, chatId)
    }).catch(e => {
      console.error(`Error connecting to Binance: ${e}`)
      TelegramBot.sendMessage(`Error connecting to Binance: ${e}`, chatId)
    })
    const symbols = await fetchSymbols(client)
    TimeCaller.start()
    const workerSignals = await processSignals(symbols, client)
    if (!workerSignals) throw new Error('workerSignals is false')
    TimeCaller.end(symbols)
  } catch (error) {
    console.error('Error during execution:', error.message)
    TelegramBot.sendMessage(`Error during execution: ${error.message}`, chatId)
  }
}
