import { UserInfoRecommendType } from 'src/types/userInfo.type'
import http from 'src/utils/http'
const URL = 'Recommend/'

const recommendApi = {
  getRecommend(id: number) {
    return http.get(URL + `RecommendList?id=${id}`)
  },
  getDetailsRecommend(id: number, data: number[]) {
    return http.post<UserInfoRecommendType[]>(URL + `GetDetailRecommend?userID=${id}`, data)
  }
}
export default recommendApi
