const ChartmetricService = require('./chartmetric.service').chartmetricService
const axios = require('axios')
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

const REVUE_BASE_URL = 'https://www.getrevue.co/api/v2/subscribers'

// var corsOptions = {
//   origin: 'https://nusic.fm',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }

// Used for NUSIC music bonds client
app.post('/add_subscriber', async (req, res) => {
  const bodyFormData = new URLSearchParams()
  bodyFormData.append('email', req.body.email)
  bodyFormData.append('first_name', req.body.firstName)
  bodyFormData.append('last_name', req.body.lastName)
  const headers = {
    Authorization: `Token ${process.env.REVUE_APIKEY}`
  }
  try {
    const revueRes = await axios({
      method: 'post',
      url: REVUE_BASE_URL,
      headers,
      data: bodyFormData
    })
    res.send(revueRes)
  } catch (e) {
    const eRes = e.response || { status: 400 }
    res.status(eRes.status).send(e)
  }
})

app.listen(port, () => console.log(`Listening on port ${port}!`))
