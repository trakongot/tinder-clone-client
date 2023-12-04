import http from 'src/utils/http'
const URL = 'Swipe/'

const swipeApi = {
  swipeLike(fromID: number, toID: number) {
    return http.post(URL + `Like?LikeID=${fromID}&LikedID=${toID}`)
  },
  swipeUnlike(fromID: number, toID: number) {
    return http.post(URL + `Unlike?unlikeID=${fromID}&unlikedID=${toID}`)
  }
}
export default swipeApi
