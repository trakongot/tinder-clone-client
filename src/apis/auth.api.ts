import http from 'src/utils/http'

export const URL_LoginAccount = 'LoginSignUp/Login'
export const URL_loginFacebook = 'LoginSignUp/FacebookLogin'
export const URL_loginGoogle = 'LoginSignUp/GoogleLogin'
const authApi = {
  loginAccount(body: { username: string; pass: string }) {
    return http.post(URL_LoginAccount, body)
  },
  getInfoUserFacebook(credential: string) {
    return http.post(URL_loginFacebook + `?credential=${credential}`)
  },
  getInfoUserGoogle(credential: string) {
    return http.get(URL_loginGoogle + `?credential=${credential}`)
  }
}

export default authApi
