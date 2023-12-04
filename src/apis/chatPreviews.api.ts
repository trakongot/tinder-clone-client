import http from 'src/utils/http'

const URL = 'Likes/'
const chatPreviewsApi = {
  getNewChatPreviews(id: number) {
    return http.get(URL + `GetLikeNotMess?userId=${id}`)
  },
  getCountLike(id: number) {
    return http.get(URL + `GetCountLike?userId=${id}`)
  },
  getChatPreviews(id: number) {
    return http.get(URL + `GetLikeMess?userId=${id}`)
  },
  getTitleForMess(fromId: number, toId: number) {
    return http.get(URL + `GetTitleForMess?fromId=${fromId}&toId=${toId}`)
  }
}
export default chatPreviewsApi
