import { MessageType } from 'src/types/message.type'
import http from 'src/utils/http'
const URL = 'Message/'

const messageApi = {
  getMessByUserID(idUser: number, toID: number) {
    return http.get<MessageType[]>(URL + `GetMessByUserID?userId=${idUser}&toID=${toID}`)
  }
}
export default messageApi
