import { SettingType } from 'src/types/setting.type'
import http from 'src/utils/http'

const URL = 'Setting/'
const settingApi = {
  getSettingUser(id: number) {
    return http.get<SettingType>(URL + `GetUserSettingById?Id=${id}`)
  },
  updateSettingUser(body: SettingType) {
    return http.put<SettingType>(URL + `UpdateSetting`, body)
  }
}
export default settingApi
