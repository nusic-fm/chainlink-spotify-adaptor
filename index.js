const { Requester } = require('@chainlink/external-adapter')
const ChartmetricService = require('./chartmetric.service').chartmetricService

const createRequest = async (input, callback) => {
  const spotifyId = input.data.id
  const service = new ChartmetricService()
  const ids = await service.getChartmetricArtistIds('spotify', spotifyId)
  if (ids.length === 0) {
    callback(500, { error: new Error('Invalid spotify id or data not exist in chartmetric.') })
  }
  const chartmetricId = ids[0].cm_artist
  const listeners = await service.getChartmetricArtistYoutubeMetrics(chartmetricId)
  console.log({ listeners })
  const lastMonthListeners = listeners[listeners.length - 1]
  callback(200, Requester.success(0, { data: { lastMonthListeners, result: lastMonthListeners.value } }))
}

// This allows the function to be exported for testing
// or for running in express
module.exports.createRequest = createRequest
