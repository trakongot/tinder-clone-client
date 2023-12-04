import { configureStore } from '@reduxjs/toolkit'
import { chatPreviewsReducer } from './slices/chatPreviews.slice'
import { settingsReducer } from './slices/settings.slice'
import { userReducer } from './slices/userProfile.slice'
import { animationTrickReducer } from './slices/animationTrick.slice'
import { callReducer } from './slices/callingUser.slice'
import { signalRHubReducer } from './slices/signalRHub.slice'

export const store = configureStore({
  reducer: {
    chatPreviews: chatPreviewsReducer,
    settings: settingsReducer,
    user: userReducer,
    animationTrick: animationTrickReducer,
    callingUser: callReducer,
    signalRHub: signalRHubReducer
  }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
