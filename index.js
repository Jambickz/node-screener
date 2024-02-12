const startRsiScreener = require('./src/index')
const schedule = require('node-schedule')

const start = () => {
  schedule.scheduleJob('0 * * * *', () => {
    startRsiScreener()
  })
}

start()
