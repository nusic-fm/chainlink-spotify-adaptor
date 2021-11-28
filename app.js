const ChartmetricService = require('./chartmetric.service').chartmetricService

const createRequest = require('./index').createRequest

const express = require('express')
const bodyParser = require('body-parser')
var cors = require('cors')

const app = express()
const port = process.env.PORT || 8080

app.use(cors())

app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('NUSIC chartmetric service is up and running')
})

// Used for chainlink requests
app.post('/listeners', (req, res) => {
  console.log('POST Data: ', req.body)
  createRequest(req.body, (status, result) => {
    console.log('Result: ', result)
    res.status(status).json(result)
  })
})

// Used for NUSIC music bonds client
app.post('/ids', async (req, res) => {
  console.log('POST Data: ', req.body.id)
  const service = new ChartmetricService()
  const ids = await service.getChartmetricArtistIds('spotify', req.body.id)
  console.log({ ids })
  res.send(ids)
})

app.listen(port, () => console.log(`Listening on port ${port}!`))
