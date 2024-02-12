module.exports = async (client) => {
  try {
    const symbolsData = await client.futuresPrices() || {}
    return Object.keys(symbolsData)
  } catch (error) {
    console.error(`Error fetching symbols: ${error.message}`)
    throw error
  }
}
