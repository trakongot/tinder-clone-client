export type MessageType = {
  id: number | null
  ofStatus: boolean | null
  sendUserId: number | null
  receiveUserId: number | null
  content: string | null
  sendTime: string | null
}
export type ChatPreviewItem = {
  userID: number | null
  imagePath: string | null
  userName: string | null
  lastMess: string | null
  lastUserChat: number | null
}
