// eslint-disable-next-line import/named
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AnimationTrickState {
  showCommingCallModal: boolean
  showCallingModal: boolean
  showVideoCallModal: boolean
}

const initialState: AnimationTrickState = {
  showCommingCallModal: false,
  showCallingModal: false,
  showVideoCallModal: false
}

const animationTrickSlice = createSlice({
  name: 'animationTrick',
  initialState,
  reducers: {
    setShowCommingCallModal: (state, action: PayloadAction<boolean>) => {
      state.showCommingCallModal = action.payload
    },
    setShowCallingModal: (state, action: PayloadAction<boolean>) => {
      state.showCallingModal = action.payload
    },
    setShowVideoCallModal: (state, action: PayloadAction<boolean>) => {
      state.showVideoCallModal = action.payload
    }
  }
})

export const { setShowCallingModal, setShowCommingCallModal, setShowVideoCallModal } = animationTrickSlice.actions
export const animationTrickReducer = animationTrickSlice.reducer
