// eslint-disable-next-line import/named
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SettingType } from 'src/types/setting.type'

interface SettingsState {
  settings: SettingType
  isSettingsChanged: boolean
}

const initialState: SettingsState = {
  settings: {
    email: null,
    phoneNumber: null,
    distancePreference: 16,
    ageMin: 16,
    ageMax: 100,
    globalMatches: 0,
    hideAge: 1,
    hideDistance: null,
    distanceUnit: null,
    latitute: null,
    longtitute: null
  },
  isSettingsChanged: false
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setSettings: (state, action: PayloadAction<SettingType>) => {
      state.settings = action.payload
      state.isSettingsChanged = true
    },
    resetSettingsChangedFlag: (state) => {
      state.isSettingsChanged = false
    },
    setDistancePreferencee: (state, action: PayloadAction<number>) => {
      state.settings.distancePreference = action.payload
      state.isSettingsChanged = true
    },
    setMinPrefenceAge: (state, action: PayloadAction<number>) => {
      state.settings.ageMin = action.payload
      state.isSettingsChanged = true
    },
    setMaxPrefenceAge: (state, action: PayloadAction<number>) => {
      state.settings.ageMax = action.payload
      state.isSettingsChanged = true
    },
    setHideAge: (state, action: PayloadAction<1 | 0 | null>) => {
      state.settings.hideAge = action.payload
      state.isSettingsChanged = true
    },
    setHideDistance: (state, action: PayloadAction<1 | 0 | null>) => {
      state.settings.hideAge = action.payload
      state.isSettingsChanged = true
    },
    setGobalMatch: (state, action: PayloadAction<1 | 0 | null>) => {
      state.settings.globalMatches = action.payload
      state.isSettingsChanged = true
    },
    setLatitude: (state, action: PayloadAction<number | null>) => {
      state.settings.latitute = action.payload
      state.isSettingsChanged = true
    },
    setLongitude: (state, action: PayloadAction<number | null>) => {
      state.settings.longtitute = action.payload
      state.isSettingsChanged = true
    }
  }
})

export const {
  setSettings,
  resetSettingsChangedFlag,
  setDistancePreferencee,
  setMinPrefenceAge,
  setMaxPrefenceAge,
  setGobalMatch,
  setLatitude,
  setLongitude,
  setHideAge,
  setHideDistance
} = settingsSlice.actions
export const settingsReducer = settingsSlice.reducer
