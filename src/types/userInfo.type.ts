export type BasicsType = {
  zodiac: string | null
  education: string | null
  futureFamily: string | null
  vacxinCovid: string | null
  personality: string | null
  communication: string | null
  loveLanguage: string | null
}

export type LifeStylesType = {
  pet: string | null
  alcolhol: string | null
  smoke: string | null
  workout: string | null
  diet: string | null
  socialMedia: string | null
  sleepHabit: string | null
}

export type UserInfoType = {
  id: number | null
  fullName: string | null
  tagName: string | null
  likeAmount: number | null
  aboutUser: string | null
  purposeDate: string | null
  gender: boolean | null
  sexsualOrientation: string | null
  height: number | null
  jobTitle: string | null
  company: string | null
  school: string | null
  liveAt: string | null
  passion: string[] | null
  languages: string[] | null
  photos: string[] | null
  age: number | null
} & BasicsType &
  LifeStylesType

export type UserInfoRecommendType = {
  id: number | null
  fullName: string | null
  liveAt: string | null
  age: number | null
  imagePath: string[] | null
  distance: number | null
}
