import { UserProfileType, PassionUserType, LanguageUserType } from 'src/types/profileEdit.type'
import { UserInfoType } from 'src/types/userInfo.type'
import http from 'src/utils/http'
const URL = 'Users/'
const userApi = {
  getInfoUser(id: number) {
    return http.get<UserInfoType>(URL + `GetDetailUser?id=${id}`)
  },
  getProfileUser(id: number) {
    return http.get<UserProfileType>(URL + `GetByID?id=${id}`)
  },
  updateProfileUser(body: UserProfileType) {
    return http.put(URL + `UpdateUser`, body)
  },
  getPassionUser(id: number) {
    return http.get<PassionUserType[]>(`UsersPassion/GetByUserId?userId=${id}`)
  },
  updatePassionUser(id: number, body: number[]) {
    return http.put(`UsersPassion/UpdatePassions?id=${id}`, body)
  },
  updateLanguageUser(id: number, body: number[]) {
    return http.put(`UsersLanguages/UpdateLanguages?id=${id}`, body)
  },
  getLanguageUser(id: number) {
    return http.get<LanguageUserType[]>(`UsersLanguages/GetByUserId?userId=${id}`)
  }
}
export default userApi
