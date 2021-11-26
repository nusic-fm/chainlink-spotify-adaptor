const ChartmetricService = require('./chartmetric.service').chartmetricService

const createRequest = require('./index').createRequest

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 8080

app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('NUSIC server is up and running')
})
app.post('/listeners', (req, res) => {
  console.log('POST Data: ', req.body)
  createRequest(req.body, (status, result) => {
    console.log('Result: ', result)
    res.status(status).json(result)
  })
})

app.post('/ids', async (req, res) => {
  console.log('POST Data: ', req.body.id)
  const service = new ChartmetricService()
  const ids = await service.getChartmetricArtistIds('spotify', req.body.id)
  console.log({ ids })
  res.send(ids)
})

app.listen(port, () => console.log(`Listening on port ${port}!`))
