import { PhotoType } from './../types/photo.type'
import http from 'src/utils/http'
const URL = 'Photo/'

const photoApi = {
  getAllPhotos(id: number) {
    return http.get(URL + `GetAll?UserId=${id}`)
  },
  uploadPhoto(body: FormData) {
    return http.post<PhotoType>(URL + `AddNew`, body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  replacePhoto(body: FormData) {
    return http.put<PhotoType>(URL + `Update`, body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}
export default photoApi
