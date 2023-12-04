import config from 'src/constants/config'
import http from 'src/utils/http'

const URL = 'https://api.opencagedata.com/geocode/v1/json'

const locationApi = {
  getAddress(latitude: number, longitude: number) {
    return http.get(`${URL}?q=${latitude}+${longitude}&key=${config.geocodingKey}`)
  }
}
export default locationApi
