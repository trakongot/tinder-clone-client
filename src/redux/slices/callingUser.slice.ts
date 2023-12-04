// eslint-disable-next-line import/named
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface CallingUserState {
  id: number | null
  fullName: string | null
  imagePath: string | null
}

const initialState: CallingUserState = {
  id: null,
  fullName: null,
  imagePath: null
}

const callSlice = createSlice({
  name: 'call',
  initialState,
  reducers: {
    setCallingUser: (state, action: PayloadAction<CallingUserState>) => {
      // Assuming action.payload is an object with id, fullName, and imagePath properties
      state.id = action.payload.id
      state.fullName = action.payload.fullName
      state.imagePath = action.payload.imagePath
    }
  }
})

export const { setCallingUser } = callSlice.actions
export const callReducer = callSlice.reducer
