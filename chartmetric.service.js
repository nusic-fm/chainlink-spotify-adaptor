const axios = require('axios')

// Trial API Refresh token from chartmetrics.com
const refreshtoken = '0OVNrilX2MOJLq7fQijEfcdvv9rTnsqehxEA7PiSS8nLOqve9KHVrPDzcQnhB6SL'

class ChartmetricService {
  static accessToken
  static accessTokenExpiryDate

  async getAccessToken() {
    const response = await axios('https://api.chartmetric.com/api/token', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      data: { refreshtoken }
    })
    const data = response.data
    const expiry = new Date()
    expiry.setSeconds(expiry.getSeconds() + data.expires_in)
    ChartmetricService.accessToken = data.token
    ChartmetricService.accessTokenExpiryDate = expiry
    return response
  }

  async getChartmetricData(url) {
    if (ChartmetricService.accessToken == undefined || new Date() > ChartmetricService.accessTokenExpiryDate) {
      await this.getAccessToken()
    }
    const response = await axios.get(url, {
      headers: {
        // 'Content-Type': 'application/json',
        Authorization: `Bearer ${ChartmetricService.accessToken}`
      }
    })
    return response.data.obj
  }
  async getChartmetricArtistIds(idType, artistId) {
    const artistIds = await this.getChartmetricData(`https://api.chartmetric.com/api/artist/${idType}/${artistId}/get-ids`)
    return artistIds
  }
  async getChartmetricArtistMetadata(artistId) {
    const metadata = await this.getChartmetricData(`https://api.chartmetric.com/api/artist/${artistId}`)
    return metadata
  }

  async getChartmetricArtistYoutubeMetrics(artistId) {
    // const query = field === 'all' ? '' : `?field=${field}`;
    const apiUrl = `https://api.chartmetric.com/api/artist/${artistId}/stat/spotify?field=listeners`
    try {
      const metrics = await this.getChartmetricData(apiUrl)
      return metrics.listeners
    } catch (e) {
      console.error(e)
    }
  }
}
module.exports.chartmetricService = ChartmetricService
