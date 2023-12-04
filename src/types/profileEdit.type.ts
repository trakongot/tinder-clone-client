export interface UserProfileType {
  id: number | null
  settingId: number | null
  permissionId: number | null
  fullName: string | null
  userName: string | null
  tagName: string | null
  likeAmount: number | null
  pass: string | null
  googleId: null | string
  facebookId: null | string
  isBlocked: null | boolean
  isDeleted: null | boolean
  aboutUser: string | null
  purposeDateID: number | null
  gender: boolean | null
  sexsualOrientationID: null | number
  height: number | null
  zodiacID: number | null
  educationID: number | null
  futureFamilyID: number | null
  vacxinCovidID: number | null
  personalityID: number | null
  communicationID: number | null
  loveLanguageID: number | null
  petID: number | null
  alcolholID: number | null
  smokeID: number | null
  workoutID: number | null
  dietID: number | null
  socialMediaID: number | null
  sleepHabitID: number | null
  jobTitle: string | null
  company: string | null
  school: string | null
  liveAt: string | null
  ofStatus: 0 | 1 | null
  token: null | string
  tokenCreated: null | Date
  tokenExpires: null | Date
}

export type PassionUserType = {
  id: number
  ofStatus: null | string
  passionId: number
  userId: number
}
export type LanguageUserType = {
  id: number
  ofStatus: number
  lname: string
  languageId: number
}
