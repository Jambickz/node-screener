const { RsiKeeper } = require('talib-stream')

const rsiOptions = { period: 14 }
module.exports = (prices) => {
  const rsi = new RsiKeeper(rsiOptions)
  for (const price of prices) rsi.add(price)
  return Math.round(rsi.get())
}
