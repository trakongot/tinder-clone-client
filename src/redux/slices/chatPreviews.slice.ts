// eslint-disable-next-line import/named
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ChatPreviewItem } from 'src/types/message.type'

interface ChatPreviewsState {
  newChatPreviewList: Omit<ChatPreviewItem, 'lastMess' | 'lastUserChat'>[]
  chatPreviewList: ChatPreviewItem[]
}
const initialState: ChatPreviewsState = {
  newChatPreviewList: [],
  chatPreviewList: []
}

const chatPreviewsSlide = createSlice({
  name: 'chatPreviews',
  initialState,
  reducers: {
    //  Preview boxchat of someone has matched but hasn't messaged yet
    setNewChatPreviews: (state, action: PayloadAction<Omit<ChatPreviewItem, 'lastMess' | 'lastUserChat'>[]>) => {
      state.newChatPreviewList = action.payload
    },
    removeNewChatPreviewItem: (state, action: PayloadAction<{ userID: number | null }>) => {
      const { userID } = action.payload
      state.newChatPreviewList = state.newChatPreviewList.filter((item) => item.userID !== userID)
    },
    //  The person has matched and has at least one message.
    setChatPreviews: (state, action: PayloadAction<ChatPreviewItem[]>) => {
      state.chatPreviewList = action.payload
    },
    addChatPreviewItem: (state, action: PayloadAction<ChatPreviewItem>) => {
      state.chatPreviewList.unshift(action.payload)
    },
    addChatNewPreviewItem: (state, action: PayloadAction<Omit<ChatPreviewItem, 'lastMess' | 'lastUserChat'>>) => {
      state.newChatPreviewList.unshift(action.payload)
    },
    updateChatPreviewItem: (
      state,
      action: PayloadAction<{ userID: number; lastMess: string; lastUserChat: number }>
    ) => {
      const { userID, lastMess, lastUserChat } = action.payload
      const indexToUpdate = state.chatPreviewList.findIndex((item) => item.userID === userID)
      if (indexToUpdate === -1) {
        return
      }
      const updatedChatPreviews = [
        { ...state.chatPreviewList[indexToUpdate], lastMess, lastUserChat },
        ...state.chatPreviewList.slice(0, indexToUpdate),
        ...state.chatPreviewList.slice(indexToUpdate + 1)
      ]
      // Cập nhật state với mảng mới
      state.chatPreviewList = updatedChatPreviews
    }
  }
})

export const {
  setNewChatPreviews,
  removeNewChatPreviewItem,
  setChatPreviews,
  addChatPreviewItem,
  addChatNewPreviewItem,
  updateChatPreviewItem
} = chatPreviewsSlide.actions
export const chatPreviewsReducer = chatPreviewsSlide.reducer
