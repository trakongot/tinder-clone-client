/* eslint-disable import/named */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UserInfoType } from 'src/types/userInfo.type'
import { getUserIDFromLS } from 'src/utils/auth'

interface UserState {
  currentChatUserID: number | null
  profile: UserInfoType | null
}

const initialState: UserState = {
  currentChatUserID: null,
  profile: {
    id: getUserIDFromLS(),
    fullName: null,
    age: null,
    tagName: null,
    likeAmount: null,
    aboutUser: null,
    purposeDate: null,
    gender: null,
    sexsualOrientation: '',
    height: null,
    zodiac: null,
    education: null,
    futureFamily: null,
    vacxinCovid: null,
    personality: null,
    communication: '',
    loveLanguage: '',
    pet: null,
    alcolhol: null,
    smoke: null,
    workout: null,
    diet: null,
    socialMedia: null,
    sleepHabit: null,
    jobTitle: null,
    company: null,
    school: null,
    liveAt: null,
    passion: null,
    languages: null,
    photos: null
  }
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserID: (state, action: PayloadAction<number | null>) => {
      if (state.profile) {
        state.profile.id = action.payload
      }
    },
    setProfile: (state, action: PayloadAction<UserInfoType | null>) => {
      state.profile = action.payload
    },
    setCurrentChatUserID: (state, action: PayloadAction<number | null>) => {
      if (state.profile) {
        state.currentChatUserID = action.payload
      }
    }
  }
})

export const { setUserID, setProfile, setCurrentChatUserID } = userSlice.actions
export const userReducer = userSlice.reducer
