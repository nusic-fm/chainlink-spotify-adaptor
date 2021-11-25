const { Requester } = require('@chainlink/external-adapter')
const ChartmetricService = require('./chartmetric.service').chartmetricService

const createRequest = async (input, callback) => {
  const spotifyId = input.id
  const service = new ChartmetricService()
  const ids = await service.getChartmetricArtistIds('spotify', spotifyId)
  const chartmetricId = ids[0].cm_artist
  const listeners = await service.getChartmetricArtistYoutubeMetrics(chartmetricId)
  console.log({ listeners })
  const lastMonthListeners = listeners[listeners.length - 1]
  callback(200, Requester.success(0, { data: { lastMonthListeners, result: lastMonthListeners.value } }))
}

// This is a wrapper to allow the function to work with
// GCP Functions
exports.gcpservice = (req, res) => {
  createRequest(req.body, (statusCode, data) => {
    res.status(statusCode).send(data)
  })
}

// This is a wrapper to allow the function to work with
// AWS Lambda
exports.handler = (event, context, callback) => {
  createRequest(event, (statusCode, data) => {
    callback(null, data)
  })
}

// This is a wrapper to allow the function to work with
// newer AWS Lambda implementations
exports.handlerv2 = (event, context, callback) => {
  createRequest(JSON.parse(event.body), (statusCode, data) => {
    callback(null, {
      statusCode: statusCode,
      body: JSON.stringify(data),
      isBase64Encoded: false
    })
  })
}

// This allows the function to be exported for testing
// or for running in express
module.exports.createRequest = createRequest
