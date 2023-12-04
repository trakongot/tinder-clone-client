import {
  AlcolholType,
  CommunicationStyleType,
  DietaryPreferenceType,
  EducationType,
  FutureFamilyType,
  LanguageType,
  LoveLanguageType,
  PassionType,
  PersonalityType,
  PetType,
  PurposeDateType,
  SexualOrientationType,
  SleepHabitType,
  SmokingType,
  SocialMediaType,
  VacxinCovidType,
  WorkoutType,
  ZodiacType
} from 'src/types/options.type'
import {} from 'src/types/utils.type'
import http from 'src/utils/http'

const URL_Languages = 'Languages/GetAll'
const URL_Passions = 'Passion/GetAll'
const URL_PurposeDates = 'PurposeDate/GetAll'
const URL_Alcolhols = 'Alcolhol/GetAll'
// basic url api
const URL_Educations = 'Education/GetAll'
const URL_Zodiacs = 'Zodiac/GetAll'
const URL_FutureFamily = 'FutureFamily/GetAll'
const URL_VacxinCovid = 'VacxinCovid/GetAll'
const URL_Personalities = 'Personality/GetAll'
const URL_Communication = 'Communication/GetAll'
const URL_LoveLanguage = 'LoveLanguage/GetAll'
// lifestyle api
const URL_Pets = 'Pet/GetAll'
const URL_Drikings = 'Alcolhol/GetAll'
const URL_Smoking = 'Smoke/GetAll'
const URL_Workout = 'Workout/GetAll'
const URL_SocialMedia = 'SocialMedia/GetAll'
const URL_Sleeping = 'SleepHabit/GetAll'
const URL_DietPreference = 'Diet/GetAll'
// end lifestyle
const URL_SexualOrientaion = 'SexsualOrientation/GetAll'
const optionsProfileApi = {
  getLanguages() {
    return http.get<LanguageType[]>(URL_Languages)
  },
  getPassion() {
    return http.get<PassionType[]>(URL_Passions)
  },
  getPurposeDate() {
    return http.get<PurposeDateType[]>(URL_PurposeDates)
  },
  // Basic api
  getZodiacs() {
    return http.get<ZodiacType[]>(URL_Zodiacs)
  },
  getEducations() {
    return http.get<EducationType[]>(URL_Educations)
  },
  getFuturalFamilies() {
    return http.get<FutureFamilyType[]>(URL_FutureFamily)
  },
  getVacxinCovids() {
    return http.get<VacxinCovidType[]>(URL_VacxinCovid)
  },
  getPersonalities() {
    return http.get<PersonalityType[]>(URL_Personalities)
  },
  getAlcolhols() {
    return http.get<PassionType[]>(URL_Alcolhols)
  },
  getLoveLanguages() {
    return http.get<LoveLanguageType[]>(URL_LoveLanguage)
  },
  getCommunicationStyles() {
    return http.get<CommunicationStyleType[]>(URL_Communication)
  },
  // Lifestype api
  getPets() {
    return http.get<PetType[]>(URL_Pets)
  },
  getDrikings() {
    return http.get<AlcolholType[]>(URL_Drikings)
  },
  getSmokings() {
    return http.get<SmokingType[]>(URL_Smoking)
  },
  getWorkout() {
    return http.get<WorkoutType[]>(URL_Workout)
  },
  getDietPreference() {
    return http.get<DietaryPreferenceType[]>(URL_DietPreference)
  },
  getSocialMedias() {
    return http.get<SocialMediaType[]>(URL_SocialMedia)
  },
  getSleepingHabits() {
    return http.get<SleepHabitType[]>(URL_Sleeping)
  },
  // end life style
  getSexualOrientation() {
    return http.get<SexualOrientationType[]>(URL_SexualOrientaion)
  }
}
export default optionsProfileApi
