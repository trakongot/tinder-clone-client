// signalRHubSlice.ts
import { createSlice } from '@reduxjs/toolkit'
import { HubConnection } from '@microsoft/signalr'

interface SignalRHubState {
  signalRHub: React.MutableRefObject<HubConnection | null>
  isSignalRHubUrlInitialized: boolean
}

const initialState: SignalRHubState = {
  signalRHub: { current: null },
  isSignalRHubUrlInitialized: false
}

const signalRHubSlice = createSlice({
  name: 'signalRHub',
  initialState,
  reducers: {
    setSignalRHub: (state, action) => {
      state.signalRHub.current = action.payload
      state.isSignalRHubUrlInitialized = true
    }
  }
})

export const { setSignalRHub } = signalRHubSlice.actions
export const signalRHubReducer = signalRHubSlice.reducer
