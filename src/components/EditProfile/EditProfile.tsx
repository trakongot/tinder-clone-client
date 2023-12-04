import { ChangeEvent, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import path from 'src/constants/path'
import { AppContext } from 'src/contexts/app.contexts'
import { useClickOutsideDialog } from 'src/hooks/useClickOutsideDialog'
import Modal from 'src/utils/Model'
import Webcam from 'react-webcam'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import optionsProfileApi from 'src/apis/optionsProfile.api'
import { v4 as uuid } from 'uuid'
import { toast } from 'react-toastify'
import photoApi from 'src/apis/photos.api'
import { PhotoType } from 'src/types/photo.type'
import isNumber from 'lodash'
import { UserProfileType, PassionUserType, LanguageUserType } from 'src/types/profileEdit.type'
import userApi from 'src/apis/user.api'

import {
  AlcolholType,
  CommunicationStyleType,
  DietaryPreferenceType,
  EducationType,
  FutureFamilyType,
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
import { RootState } from 'src/redux/store'
import { useSelector } from 'react-redux'
import unidecode from 'unidecode'
import { debounce } from 'src/utils/until'
type BasicType = Pick<
  UserProfileType,
  | 'zodiacID'
  | 'educationID'
  | 'futureFamilyID'
  | 'personalityID'
  | 'communicationID'
  | 'loveLanguageID'
  | 'vacxinCovidID'
>
type LifeStyleType = Pick<
  UserProfileType,
  'petID' | 'smokeID' | 'workoutID' | 'alcolholID' | 'dietID' | 'socialMediaID' | 'sleepHabitID' | 'loveLanguageID'
>

interface EditProfileProps {
  className?: string
}
interface AddPassionProps {
  setShowAddPassion?: React.Dispatch<React.SetStateAction<boolean>>
  setEditedProfile?: React.Dispatch<React.SetStateAction<object>>
  editedProfile?: UserProfileType
}
interface AddPurposeDateProps {
  setShowPurposeDate: React.Dispatch<React.SetStateAction<boolean>>
  purposeDate?: number | null
  setPurposeDate?: React.Dispatch<React.SetStateAction<null | number>>
  setEditedProfile?: React.Dispatch<React.SetStateAction<object>>
}
interface AddLanguagesProps {
  setShowAddLanguages: React.Dispatch<React.SetStateAction<boolean>>
  selectedLanguages?: string[]
  setSelectedLanguages?: React.Dispatch<React.SetStateAction<string[]>>
}
interface AddExtendedInfoProps<T> {
  setShowExtendedInfo: React.Dispatch<React.SetStateAction<boolean>>
  data?: T
  setData?: React.Dispatch<React.SetStateAction<T>>
}
interface AddGenderProps {
  setShowSelectGender: React.Dispatch<React.SetStateAction<boolean>>
  gender?: boolean | null
  setGender?: React.Dispatch<React.SetStateAction<boolean | null>>
}
interface AddSexualOrigetationProps {
  setShowSexualOrigetation: React.Dispatch<React.SetStateAction<boolean>>
  sexualOrientation?: number | null
  setSexualOrientation?: React.Dispatch<React.SetStateAction<number | null>>
}
interface EditPhotoModalProps {
  setImageIndex?: React.Dispatch<React.SetStateAction<number | null>>
  setShowEditPhotoModal: React.Dispatch<React.SetStateAction<boolean>>
  showEditPhotoModal: boolean
  setShowUploadPhotoModal: React.Dispatch<React.SetStateAction<boolean>>
}
interface UploadPhotoModalProps {
  imageIndex?: number | null
  showUploadPhotoModal: boolean
  setShowUploadPhotoModal: React.Dispatch<React.SetStateAction<boolean>>
  setShowWebcamCapture: React.Dispatch<React.SetStateAction<boolean>>
  setImageIndex: React.Dispatch<React.SetStateAction<number | null>>
}
interface WebcamCaptureProps {
  imageIndex?: number | null
  setShow: React.Dispatch<React.SetStateAction<boolean>>
  show: boolean
  setImageIndex: React.Dispatch<React.SetStateAction<number | null>>
}

export default function EditProfile({ className }: Readonly<EditProfileProps>) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { isEditProfileActive, setIsEditProfileActive } = useContext(AppContext)
  const userID = useSelector((state: RootState) => state.user.profile?.id)
  // data variable
  const [textAbout, setTextAbout] = useState<string>('')
  const [textJobTitle, setTextJobTitle] = useState<string>('')
  const [textSchool, setTextSchool] = useState<string>('')
  const [textCompany, setTextCompany] = useState<string>('')
  const [textLiveAt, setTextLiveAt] = useState<string>('')
  const [basics, setBasics] = useState({} as BasicType)
  const [lifeStyles, setLifeStyles] = useState({} as LifeStyleType)
  const [gender, setGender] = useState<boolean | null>(null)
  const [sexualOrientation, setSexualOrientation] = useState<number | null>(null)

  // animation trigger variable
  const [showEditPhotoModal, setShowEditPhotoModal] = useState<boolean>(false)
  const [showUploadPhotoModal, setShowUploadPhotoModal] = useState<boolean>(false)
  const [showWebCamera, setShowWebCamera] = useState<boolean>(false)
  const [showAddPassion, setShowAddPassion] = useState<boolean>(false)
  const [showAddLanguages, setShowAddLanguages] = useState<boolean>(false)
  const [purposeDate, setPurposeDate] = useState<number | null>(null)
  const [showPurposeDate, setShowPurposeDate] = useState<boolean>(false)
  const [showAddBasicInfo, setShowAddBasicInfo] = useState<boolean>(false)
  const [showAddLifeStyleInfo, setShowAddLifeStyleInfo] = useState<boolean>(false)
  const [showAddGender, setShowAddGender] = useState(false)
  const [showAddSexualOrientation, setShowAddSexualOrientation] = useState<boolean>(false)

  const [editedProfile, setEditedProfile] = useState<UserProfileType>({} as UserProfileType)
  const divOverlayRef = useRef<HTMLDivElement>(null)
  const divRef = useRef<HTMLDivElement>(null)
  // config valute
  const maxCharacters = 500 //  lenght of about user
  // hanlde add new, replace photo
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)

  const handleOpenEditPhotoModal = (imageIndex: number) => {
    setSelectedImageIndex(imageIndex)
    setShowEditPhotoModal(true)
  }
  const {
    data: photos,
    isLoading: isLoadingPhotos,
    isSuccess: isSuccessLoadingPhoto
  } = useQuery({
    queryKey: ['getPhotos'],
    queryFn: () => {
      if (userID) return photoApi.getAllPhotos(userID)
    },
    enabled: !!userID,
    refetchOnMount: true
  })
  let images: PhotoType[] = []
  if (isSuccessLoadingPhoto) {
    images = photos?.data
  }
  const { data: userEdit, isSuccess: isSuccesLoadingUserEdit } = useQuery({
    queryKey: ['profile'],
    queryFn: () => {
      if (userID) return userApi.getProfileUser(userID)
    },
    enabled: !!userID
  })
  const profile: UserProfileType = useMemo(() => {
    if (isSuccesLoadingUserEdit && userEdit?.data) {
      return userEdit.data
    }
    return {} as UserProfileType
  }, [isSuccesLoadingUserEdit, userEdit])
  function updateField<T>(field: keyof T, value: T[keyof T], setValue: React.Dispatch<React.SetStateAction<T>>) {
    setValue((prev) => ({
      ...prev,
      [field]: value
    }))
  }
  useEffect(() => {
    if (profile?.id) {
      setEditedProfile(profile)
      if (profile.aboutUser) setTextAbout(profile.aboutUser)
      if (profile.liveAt) setTextLiveAt(profile.liveAt)
      if (profile.school) setTextSchool(profile.school)
      if (profile.company) setTextCompany(profile.company)
      if (profile.jobTitle) setTextJobTitle(profile.jobTitle)
      if (profile.gender !== null) setGender(profile.gender)
      if (profile.sexsualOrientationID) setSexualOrientation(profile.sexsualOrientationID)
      if (profile.purposeDateID) setPurposeDate(profile.purposeDateID)
      const basicsFields: (keyof BasicType)[] = [
        'zodiacID',
        'educationID',
        'futureFamilyID',
        'personalityID',
        'communicationID',
        'loveLanguageID',
        'vacxinCovidID'
      ]
      const lifeStyleFields: (keyof LifeStyleType)[] = [
        'alcolholID',
        'dietID',
        'petID',
        'sleepHabitID',
        'smokeID',
        'socialMediaID',
        'workoutID'
      ]

      basicsFields.forEach((field) => {
        if (profile[field]) {
          updateField<BasicType>(field, profile[field], setBasics)
        }
      })
      lifeStyleFields.forEach((field) => {
        if (profile[field]) {
          updateField<LifeStyleType>(field, profile[field], setLifeStyles)
        }
      })
    }
  }, [profile])
  function autoExpandTextarea(element: HTMLTextAreaElement) {
    element.style.height = 'auto'
    element.style.height = `${element.scrollHeight}px`
  }

  useEffect(() => {
    const textareaElement = document.getElementById('aboutProfile') as HTMLTextAreaElement
    autoExpandTextarea(textareaElement)
  }, [textAbout])

  function handleChangeAboutProfile(e: ChangeEvent<HTMLTextAreaElement>) {
    const element = e.target
    autoExpandTextarea(element)
    const value = element.value
    if (value.length <= maxCharacters) {
      setTextAbout(value)
    }
  }
  useEffect(() => {
    const divElement = divRef.current
    const divOverlayElement = divOverlayRef.current

    if (divElement && divOverlayElement) {
      const divRect = divElement.getBoundingClientRect()
      const divOverlayStyle = {
        top: `${divRect.top + 600}px`,
        width: `${divRect.width}px`,
        background: 'linear-gradient(to bottom,#0000 -5%,rgb(240 242 244) 20%)'
      }
      Object.assign(divOverlayElement.style, divOverlayStyle)
    }
  }, [])
  const updateProfileMutation = useMutation({
    mutationFn: (body: UserProfileType) => userApi.updateProfileUser(body)
  })
  const updateProfile = () => {
    const updatedProfile: UserProfileType = {
      ...editedProfile,
      ...basics,
      ...lifeStyles,
      gender: gender,
      sexsualOrientationID: sexualOrientation
    }
    updatedProfile.aboutUser = textAbout ?? null
    updatedProfile.jobTitle = textJobTitle ?? null
    updatedProfile.school = textSchool ?? null
    updatedProfile.company = textCompany ?? null
    updatedProfile.liveAt = textLiveAt ?? null
    updatedProfile.purposeDateID = purposeDate?? null

    updateProfileMutation.mutate(updatedProfile, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['profile', 'infoUser'] })
        setIsEditProfileActive(!isEditProfileActive)
        navigate(path.profile)
      },
      onError: (error) => {
        console.log(error)
        toast.error('sever dang loi')
        setIsEditProfileActive(!isEditProfileActive)
        navigate(path.profile)
      }
    })
  }
  return (
    <>
      {
        // modal
        <>
          <Modal>
            <EditPhotoModal
              setImageIndex={setSelectedImageIndex}
              showEditPhotoModal={showEditPhotoModal}
              setShowUploadPhotoModal={setShowUploadPhotoModal}
              setShowEditPhotoModal={setShowEditPhotoModal}
            />
          </Modal>
          <Modal>
            <UploadPhotoModal
              imageIndex={selectedImageIndex}
              showUploadPhotoModal={showUploadPhotoModal}
              setShowWebcamCapture={setShowWebCamera}
              setShowUploadPhotoModal={setShowUploadPhotoModal}
              setImageIndex={setSelectedImageIndex}
            />
          </Modal>
          <Modal>
            <WebcamCapture
              setImageIndex={setSelectedImageIndex}
              show={showWebCamera}
              setShow={setShowWebCamera}
              imageIndex={selectedImageIndex}
            />
          </Modal>
        </>
      }
      {/* button save */}
      <div
        ref={divOverlayRef}
        className={`${
          showAddPassion ||
          showPurposeDate ||
          showAddLanguages ||
          showAddBasicInfo ||
          showAddLifeStyleInfo ||
          showAddSexualOrientation ||
          showAddGender
            ? 'h-[600px]'
            : ' h-[65px]'
        } absolute -translate-y-[100%] z-20 flex items-center justify-center`}
      >
        {!showAddPassion &&
          !showPurposeDate &&
          !showAddLanguages &&
          !showAddBasicInfo &&
          !showAddLifeStyleInfo &&
          !showAddGender &&
          !showAddSexualOrientation && (
            <button
              style={{ backgroundImage: 'linear-gradient(to top right, #fd267a, #ff6036)' }}
              onClick={() => updateProfile()}
              className='text-lg h-[45px] w-[100px] px-2 py-1 rounded-full text-white'
            >
              Save
            </button>
          )}
        {/* model EditProfileFields */}
        {showAddPassion && <AddPassion setShowAddPassion={setShowAddPassion}></AddPassion>}
        {/* model add lookingfor  */}
        {showPurposeDate && (
          <AddLookingFor
            setShowPurposeDate={setShowPurposeDate}
            purposeDate={purposeDate}
            setPurposeDate={setPurposeDate}
          />
        )}
        {/* model add language */}
        {showAddLanguages && <AddLanguages setShowAddLanguages={setShowAddLanguages}></AddLanguages>}
        {/* model extented info user */}
        {showAddBasicInfo && (
          <AddBasicInfo setShowExtendedInfo={setShowAddBasicInfo} data={basics} setData={setBasics}></AddBasicInfo>
        )}
        {/* model lifestyle info user */}
        {showAddLifeStyleInfo && (
          <AddLifeStyleInfo
            setShowExtendedInfo={setShowAddLifeStyleInfo}
            data={lifeStyles}
            setData={setLifeStyles}
          ></AddLifeStyleInfo>
        )}
        {/* model gender */}
        {showAddGender && <AddGender gender={gender} setGender={setGender} setShowSelectGender={setShowAddGender} />}
        {/* model orientation */}
        {showAddSexualOrientation && (
          <AddSexsualOrientation
            setSexualOrientation={setSexualOrientation}
            sexualOrientation={sexualOrientation}
            setShowSexualOrigetation={setShowAddSexualOrientation}
          />
        )}
      </div>
      <div
        className={`${className} relative h-[600px] w-[360px] bg-red rounded-lg  overflow-auto hide-scrollbar shadow-lg `}
        ref={divRef}
      >
        {/* EditProfileFields */}
        <div className='flex-col flex mb-20'>
          <div className='flex flex-auto bg-white'>
            <button className='w-1/2 py-3 text-center text-[#FF4485] border-t-0 border-l-0 border-b border-r border-solid border-[#c6c6c6] font-semibold text-lg'>
              Edit
            </button>
            <button className='w-1/2 py-3 text-center text-[#656E7B] border-t-0 border-l-0 border-b border-r-0 border-solid border-[#c6c6c6] font-semibold text-lg '>
              Preview
            </button>
          </div>
          <div className='flex-1 bg-[#f0f2f4] '>
            <ul className='flex flex-wrap justify-evenly'>
              {isLoadingPhotos &&
                Array(9)
                  .fill(0)
                  .map(() => (
                    <li key={uuid()} className='w-[30%] h-[150px] animate-pulse rounded-lg bg-white mt-2 relative'>
                      <div className='h-full w-full rounded-md'></div>
                      <button
                        disabled
                        className='rounded-full bg-white shadow-sm cursor-pointer w-7 h-7 absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 flex items-center justify-center'
                      >
                        {/* <svg className='w-4 h-4' focusable='false' aria-hidden='true' viewBox='0 0 24 24'>
                        <path
                          className='fill-white'
                          d='M12 0C10.8954 0 10 0.89543 10 2V10H2C0.895431 10 0 10.8954 0 12C0 13.1046 0.895431 14 2 14H10V22C10 23.1046 10.8954 24 12 24C13.1046 24 14 23.1046 14 22V14H22C23.1046 14 24 13.1046 24 12C24 10.8954 23.1046 10 22 10H14V2C14 0.895431 13.1046 0 12 0Z'
                        ></path>
                      </svg> */}
                      </button>
                    </li>
                  ))}
              {!isLoadingPhotos &&
                images?.map((item, index) => {
                  const url = item.imagePath
                  if (url == 'https://localhost:7251/Uploads/') return <></>
                  return (
                    <li key={uuid()} className='w-[30%] h-[150px] rounded-lg mt-2 relative'>
                      <div
                        style={{
                          backgroundImage: `url(${url})`,
                          backgroundPosition: '50% 50%',
                          backgroundSize: 'auto 100%'
                        }}
                        className='h-full w-full rounded-md'
                      ></div>
                      <button
                        onClick={() => {
                          console.log(index)
                          handleOpenEditPhotoModal(index)
                        }}
                        className='rounded-full bg-white border border-[#6f767f] shadow-sm cursor-pointer w-7 h-7 absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 flex items-center justify-center'
                      >
                        <svg className=' h-5 w-5' focusable='false' aria-hidden='true' viewBox='0 0 24 24'>
                          <path
                            className='fill-[#656E7B]'
                            d='M17.079 2c-.41 0-.81.158-1.125.463l-2.23 2.229 5.574 5.583 2.229-2.208c.63-.641.63-1.64 0-2.25l-3.334-3.354A1.605 1.605 0 0 0 17.08 2m-4.101 3.438L4.46 13.966l2.691.295.19 2.408 2.397.179.305 2.691 8.518-8.527M3.84 14.944L2 21.98l7.045-1.882-.252-2.272-2.43-.178-.188-2.44'
                          ></path>
                        </svg>
                      </button>
                    </li>
                  )
                })}
              {!isLoadingPhotos &&
                Array.from({
                  length: Math.max(
                    0,
                    9 - (images?.filter((item) => item.imagePath !== 'https://localhost:7251/Uploads/')?.length ?? 0)
                  )
                }).map(() => (
                  <li
                    key={uuid()}
                    className='w-[30%] h-[150px] rounded-lg border-dashed border-[#b9bfc8] border-4 mt-2 relative'
                  >
                    <div className='h-full w-full rounded-md'></div>
                    <button
                      onClick={() => setShowUploadPhotoModal(true)}
                      style={{ backgroundImage: 'linear-gradient(to top right, #fd267a, #ff6036)' }}
                      className='rounded-full border border-[#ffffff] shadow-sm cursor-pointer w-7 h-7 absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 flex items-center justify-center'
                    >
                      <svg className='w-4 h-4' focusable='false' aria-hidden='true' viewBox='0 0 24 24'>
                        <path
                          className='fill-white'
                          d='M12 0C10.8954 0 10 0.89543 10 2V10H2C0.895431 10 0 10.8954 0 12C0 13.1046 0.895431 14 2 14H10V22C10 23.1046 10.8954 24 12 24C13.1046 24 14 23.1046 14 22V14H22C23.1046 14 24 13.1046 24 12C24 10.8954 23.1046 10 22 10H14V2C14 0.895431 13.1046 0 12 0Z'
                        ></path>
                      </svg>
                    </button>
                  </li>
                ))}
            </ul>
          </div>
          <div className='pt-[65px] p-4 text-sm text-[#505965] bg-[#f0f2f4]'>
            <p>
              Add a video, pic, or Loop to get 4% closer to completing your profile and you may even get more Likes.
            </p>
            <button
              onClick={() => setShowUploadPhotoModal(true)}
              style={{ backgroundImage: 'linear-gradient(to top right, #fd267a, #ff6036)' }}
              className='text-lg mt-4 w-[80%] px-1 py-2 rounded-full text-white'
            >
              Add Media
            </button>
          </div>
          <div className='flex justify-between bg-white px-3 pb-3 pt-5'>
            <div className='flex items-center'>
              <span
                className='w-1 h-1 mr-1 inline-block rounded-full'
                style={{ backgroundImage: 'linear-gradient(to top right, #fd267a, #ff6036)' }}
              ></span>
              <label className='text-lg' htmlFor='aboutProfile'>
                About {editedProfile.fullName}
              </label>
            </div>
            <span className='text-[#d6002f]'>+22%</span>
          </div>
          <div className='px-4 py-3 bg-white text-[#505965]'>
            <textarea
              id='aboutProfile'
              className='w-full h-full outline-none resize-none'
              value={textAbout}
              onChange={handleChangeAboutProfile}
              maxLength={500}
            ></textarea>
            <div className=' flex py-2 justify-end '>{maxCharacters - textAbout.length}</div>
          </div>
          {/* passion */}
          <div className='flex justify-between px-3 pb-3 pt-5 bg-[#f0f2f4]'>
            <div className='flex items-center'>
              <span
                className='w-1 h-1 mr-1 inline-block rounded-full'
                style={{ backgroundImage: 'linear-gradient(to top right, #fd267a, #ff6036)' }}
              ></span>
              <label className='text-lg' htmlFor='aboutProfile'>
                Passions
              </label>
            </div>
            <span className='text-[#d6002f]'>+15%</span>
          </div>
          <button
            onClick={() => setShowAddPassion(true)}
            className='flex w-full bg-white justify-between px-3 py-4 text-[#505965]'
          >
            <span>Add Passions</span>
            <svg className='w-4 h-4 fill-[#505965] rotate-180' focusable='false' aria-hidden='true' viewBox='0 0 24 24'>
              <path d='M13.98 20.717a1.79 1.79 0 0 0 2.685 0 1.79 1.79 0 0 0 0-2.684l-7.158-6.62 7.158-6.8a1.79 1.79 0 0 0 0-2.684 1.79 1.79 0 0 0-2.684 0L5.929 9.98a1.79 1.79 0 0 0 0 2.684l8.052 8.052z'></path>
            </svg>
          </button>
          {/* relationship */}
          <div className='flex justify-between px-3 pb-3 pt-5 bg-[#f0f2f4]'>
            <div className='flex items-center'>
              <span
                className='w-1 h-1 mr-1 inline-block rounded-full'
                style={{ backgroundImage: 'linear-gradient(to top right, #fd267a, #ff6036)' }}
              ></span>
              <label className='text-lg' htmlFor='aboutProfile'>
                Relationship Goals
              </label>
            </div>
            <span className='text-[#d6002f]'>+15%</span>
          </div>
          <button
            onClick={() => setShowPurposeDate(true)}
            className='flex w-full bg-white justify-between px-3 py-4 text-[#505965] group'
          >
            <div className='flex items-center'>
              <img className='w-5 h-5 mr-2' src='/assets/images/looking_for.png' alt='icon' />
              <span>Looking for</span>
            </div>
            <svg
              className='w-4 h-4 fill-[#505965] rotate-180 group-hover:fill-[#d6002f]'
              focusable='false'
              aria-hidden='true'
              viewBox='0 0 24 24'
            >
              <path d='M13.98 20.717a1.79 1.79 0 0 0 2.685 0 1.79 1.79 0 0 0 0-2.684l-7.158-6.62 7.158-6.8a1.79 1.79 0 0 0 0-2.684 1.79 1.79 0 0 0-2.684 0L5.929 9.98a1.79 1.79 0 0 0 0 2.684l8.052 8.052z'></path>
            </svg>
          </button>
          {/* Languages I Know */}
          <div className='flex justify-between px-3 pb-3 pt-5 bg-[#f0f2f4]'>
            <div className='flex items-center'>
              <span
                className='w-1 h-1 mr-1 inline-block rounded-full'
                style={{ backgroundImage: 'linear-gradient(to top right, #fd267a, #ff6036)' }}
              ></span>
              <label className='text-lg' htmlFor='aboutProfile'>
                Languages I Know
              </label>
            </div>
            <span className='text-[#d6002f]'>+10%</span>
          </div>
          <button
            onClick={() => setShowAddLanguages(true)}
            className='flex w-full bg-white justify-between px-3 py-4 text-[#505965] group'
          >
            <div className='flex items-center'>
              <img className='w-5 h-5 mr-2' src='/assets/images/language.png' alt='icon' />
              <span> Add languages</span>
            </div>
            <svg
              className='w-4 h-4 fill-[#505965] rotate-180 group-hover:fill-[#d6002f]'
              focusable='false'
              aria-hidden='true'
              viewBox='0 0 24 24'
            >
              <path d='M13.98 20.717a1.79 1.79 0 0 0 2.685 0 1.79 1.79 0 0 0 0-2.684l-7.158-6.62 7.158-6.8a1.79 1.79 0 0 0 0-2.684 1.79 1.79 0 0 0-2.684 0L5.929 9.98a1.79 1.79 0 0 0 0 2.684l8.052 8.052z'></path>
            </svg>
          </button>
          {/* Basics */}
          <div className='flex justify-between px-3 pb-3 pt-5 bg-[#f0f2f4]'>
            <div className='flex items-center'>
              <span
                className='w-1 h-1 mr-1 inline-block rounded-full'
                style={{ backgroundImage: 'linear-gradient(to top right, #fd267a, #ff6036)' }}
              ></span>
              <label className='text-lg' htmlFor='aboutProfile'>
                Basics
              </label>
            </div>
            <span className='text-[#d6002f]'>+15%</span>
          </div>
          {/* zodiac */}
          <button
            onClick={() => setShowAddBasicInfo(true)}
            className='flex w-full bg-white justify-between px-3 py-4 text-[#505965] group border-b border-[#d4d8de] border-solid border-t-0 border-r-0 border-l-0'
          >
            <div className='flex items-center'>
              <img className='w-5 h-5 mr-2' src='/assets/images/astrological.png' alt='icon' />
              <span>Zodiac</span>
            </div>
            <div className='flex justify-end items-center'>
              <span className='font-semibold text-[#505965] mr-2 group-hover:text-[#d6002f] '>Add</span>
              <svg
                className='w-4 h-4 fill-[#505965] opacity-90 rotate-180 group-hover:fill-[#d6002f]'
                focusable='false'
                aria-hidden='true'
                viewBox='0 0 24 24'
              >
                <path d='M13.98 20.717a1.79 1.79 0 0 0 2.685 0 1.79 1.79 0 0 0 0-2.684l-7.158-6.62 7.158-6.8a1.79 1.79 0 0 0 0-2.684 1.79 1.79 0 0 0-2.684 0L5.929 9.98a1.79 1.79 0 0 0 0 2.684l8.052 8.052z'></path>
              </svg>
            </div>
          </button>
          {/* education */}
          <button
            onClick={() => setShowAddBasicInfo(true)}
            className='flex w-full bg-white justify-between px-3 py-4 text-[#505965] group border-b border-[#d4d8de] border-solid border-t-0 border-r-0 border-l-0'
          >
            <div className='flex items-center'>
              <img className='w-5 h-5 mr-2' src='/assets/images/education.png' alt='icon' />
              <span>Education</span>
            </div>
            <div className='flex justify-end items-center'>
              <span className='font-semibold text-[#505965] mr-2 group-hover:text-[#d6002f] '>Add</span>
              <svg
                className='w-4 h-4 fill-[#505965] opacity-90 rotate-180 group-hover:fill-[#d6002f]'
                focusable='false'
                aria-hidden='true'
                viewBox='0 0 24 24'
              >
                <path d='M13.98 20.717a1.79 1.79 0 0 0 2.685 0 1.79 1.79 0 0 0 0-2.684l-7.158-6.62 7.158-6.8a1.79 1.79 0 0 0 0-2.684 1.79 1.79 0 0 0-2.684 0L5.929 9.98a1.79 1.79 0 0 0 0 2.684l8.052 8.052z'></path>
              </svg>
            </div>
          </button>
          {/* family plans */}
          <button
            onClick={() => setShowAddBasicInfo(true)}
            className='flex w-full bg-white justify-between px-3 py-4 text-[#505965] group border-b border-[#d4d8de] border-solid border-t-0 border-r-0 border-l-0'
          >
            <div className='flex items-center'>
              <img className='w-5 h-5 mr-2' src='/assets/images/kids.png' alt='icon' />
              <span>Family Plans</span>
            </div>
            <div className='flex justify-end items-center'>
              <span className='font-semibold text-[#505965] mr-2 group-hover:text-[#d6002f] '>Add</span>
              <svg
                className='w-4 h-4 fill-[#505965] opacity-90 rotate-180 group-hover:fill-[#d6002f]'
                focusable='false'
                aria-hidden='true'
                viewBox='0 0 24 24'
              >
                <path d='M13.98 20.717a1.79 1.79 0 0 0 2.685 0 1.79 1.79 0 0 0 0-2.684l-7.158-6.62 7.158-6.8a1.79 1.79 0 0 0 0-2.684 1.79 1.79 0 0 0-2.684 0L5.929 9.98a1.79 1.79 0 0 0 0 2.684l8.052 8.052z'></path>
              </svg>
            </div>
          </button>
          {/* COVID Vaccine */}
          <button
            onClick={() => setShowAddBasicInfo(true)}
            className='flex w-full bg-white justify-between px-3 py-4 text-[#505965] group border-b border-[#d4d8de] border-solid border-t-0 border-r-0 border-l-0'
          >
            <div className='flex items-center'>
              <img className='w-5 h-5 mr-2' src='/assets/images/vacxin_covid.png' alt='icon' />
              <span>COVID Vaccine</span>
            </div>
            <div className='flex justify-end items-center'>
              <span className='font-semibold text-[#505965] mr-2 group-hover:text-[#d6002f] '>Add</span>
              <svg
                className='w-4 h-4 fill-[#505965] opacity-90 rotate-180 group-hover:fill-[#d6002f]'
                focusable='false'
                aria-hidden='true'
                viewBox='0 0 24 24'
              >
                <path d='M13.98 20.717a1.79 1.79 0 0 0 2.685 0 1.79 1.79 0 0 0 0-2.684l-7.158-6.62 7.158-6.8a1.79 1.79 0 0 0 0-2.684 1.79 1.79 0 0 0-2.684 0L5.929 9.98a1.79 1.79 0 0 0 0 2.684l8.052 8.052z'></path>
              </svg>
            </div>
          </button>
          {/* Personality Type */}
          <button
            onClick={() => setShowAddBasicInfo(true)}
            className='flex w-full bg-white justify-between px-3 py-4 text-[#505965] group border-b border-[#d4d8de] border-solid border-t-0 border-r-0 border-l-0'
          >
            <div className='flex items-center'>
              <img className='w-5 h-5 mr-2' src='/assets/images/personality.png' alt='icon' />
              <span>Personality Type</span>
            </div>
            <div className='flex justify-end items-center'>
              <span className='font-semibold text-[#505965] mr-2 group-hover:text-[#d6002f] '>Add</span>
              <svg
                className='w-4 h-4 fill-[#505965] opacity-90 rotate-180 group-hover:fill-[#d6002f]'
                focusable='false'
                aria-hidden='true'
                viewBox='0 0 24 24'
              >
                <path d='M13.98 20.717a1.79 1.79 0 0 0 2.685 0 1.79 1.79 0 0 0 0-2.684l-7.158-6.62 7.158-6.8a1.79 1.79 0 0 0 0-2.684 1.79 1.79 0 0 0-2.684 0L5.929 9.98a1.79 1.79 0 0 0 0 2.684l8.052 8.052z'></path>
              </svg>
            </div>
          </button>
          {/* Communication Style */}
          <button
            onClick={() => setShowAddBasicInfo(true)}
            className='flex w-full bg-white justify-between px-3 py-4 text-[#505965] group border-b border-[#d4d8de] border-solid border-t-0 border-r-0 border-l-0'
          >
            <div className='flex items-center'>
              <img className='w-5 h-5 mr-2' src='/assets/images/comucation_style.png' alt='icon' />
              <span>Communication Style</span>
            </div>
            <div className='flex justify-end items-center'>
              <span className='font-semibold text-[#505965] mr-2 group-hover:text-[#d6002f] '>Add</span>
              <svg
                className='w-4 h-4 fill-[#505965] opacity-90 rotate-180 group-hover:fill-[#d6002f]'
                focusable='false'
                aria-hidden='true'
                viewBox='0 0 24 24'
              >
                <path d='M13.98 20.717a1.79 1.79 0 0 0 2.685 0 1.79 1.79 0 0 0 0-2.684l-7.158-6.62 7.158-6.8a1.79 1.79 0 0 0 0-2.684 1.79 1.79 0 0 0-2.684 0L5.929 9.98a1.79 1.79 0 0 0 0 2.684l8.052 8.052z'></path>
              </svg>
            </div>
          </button>
          {/* Love Style */}
          <button
            onClick={() => setShowAddBasicInfo(true)}
            className='flex w-full bg-white justify-between px-3 py-4 text-[#505965] group border-b border-[#d4d8de] border-solid border-t-0 border-r-0 border-l-0'
          >
            <div className='flex items-center'>
              <img className='w-5 h-5 mr-2' src='/assets/images/love_language.png' alt='icon' />
              <span>Love Style</span>
            </div>
            <div className='flex justify-end items-center'>
              <span className='font-semibold text-[#505965] mr-2 group-hover:text-[#d6002f] '>Add</span>
              <svg
                className='w-4 h-4 fill-[#505965] opacity-90 rotate-180 group-hover:fill-[#d6002f]'
                focusable='false'
                aria-hidden='true'
                viewBox='0 0 24 24'
              >
                <path d='M13.98 20.717a1.79 1.79 0 0 0 2.685 0 1.79 1.79 0 0 0 0-2.684l-7.158-6.62 7.158-6.8a1.79 1.79 0 0 0 0-2.684 1.79 1.79 0 0 0-2.684 0L5.929 9.98a1.79 1.79 0 0 0 0 2.684l8.052 8.052z'></path>
              </svg>
            </div>
          </button>
          {/* Lifestyle */}
          <div className='flex justify-between px-3 pb-3 pt-5 bg-[#f0f2f4]'>
            <div className='flex items-center'>
              <span
                className='w-1 h-1 mr-1 inline-block rounded-full'
                style={{ backgroundImage: 'linear-gradient(to top right, #fd267a, #ff6036)' }}
              ></span>
              <label className='text-lg' htmlFor='aboutProfile'>
                Lifestyle
              </label>
            </div>
            <span className='text-[#d6002f]'>+15%</span>
          </div>
          {/* pet */}
          <button
            onClick={() => setShowAddLifeStyleInfo(true)}
            className='flex w-full bg-white justify-between px-3 py-4 text-[#505965] group border-b border-[#d4d8de] border-solid border-t-0 border-r-0 border-l-0'
          >
            <div className='flex items-center'>
              <img className='w-5 h-5 mr-2' src='/assets/images/pet.png' alt='icon' />
              <span>Pets</span>
            </div>
            <div className='flex justify-end items-center'>
              <span className='font-semibold text-[#505965] mr-2 group-hover:text-[#d6002f] '>Add</span>
              <svg
                className='w-4 h-4 fill-[#505965] opacity-90 rotate-180 group-hover:fill-[#d6002f]'
                focusable='false'
                aria-hidden='true'
                viewBox='0 0 24 24'
              >
                <path d='M13.98 20.717a1.79 1.79 0 0 0 2.685 0 1.79 1.79 0 0 0 0-2.684l-7.158-6.62 7.158-6.8a1.79 1.79 0 0 0 0-2.684 1.79 1.79 0 0 0-2.684 0L5.929 9.98a1.79 1.79 0 0 0 0 2.684l8.052 8.052z'></path>
              </svg>
            </div>
          </button>
          {/* dringking */}
          <button
            onClick={() => setShowAddLifeStyleInfo(true)}
            className='flex w-full bg-white justify-between px-3 py-4 text-[#505965] group border-b border-[#d4d8de] border-solid border-t-0 border-r-0 border-l-0'
          >
            <div className='flex items-center'>
              <img className='w-5 h-5 mr-2' src='/assets/images/drinking.png' alt='icon' />
              <span>Drinking</span>
            </div>
            <div className='flex justify-end items-center'>
              <span className='font-semibold text-[#505965] mr-2 group-hover:text-[#d6002f] '>Add</span>
              <svg
                className='w-4 h-4 fill-[#505965] opacity-90 rotate-180 group-hover:fill-[#d6002f]'
                focusable='false'
                aria-hidden='true'
                viewBox='0 0 24 24'
              >
                <path d='M13.98 20.717a1.79 1.79 0 0 0 2.685 0 1.79 1.79 0 0 0 0-2.684l-7.158-6.62 7.158-6.8a1.79 1.79 0 0 0 0-2.684 1.79 1.79 0 0 0-2.684 0L5.929 9.98a1.79 1.79 0 0 0 0 2.684l8.052 8.052z'></path>
              </svg>
            </div>
          </button>
          {/* Smoking */}
          <button
            onClick={() => setShowAddLifeStyleInfo(true)}
            className='flex w-full bg-white justify-between px-3 py-4 text-[#505965] group border-b border-[#d4d8de] border-solid border-t-0 border-r-0 border-l-0'
          >
            <div className='flex items-center'>
              <img className='w-5 h-5 mr-2' src='/assets/images/smoking.png' alt='icon' />
              <span>Smoking</span>
            </div>
            <div className='flex justify-end items-center'>
              <span className='font-semibold text-[#505965] mr-2 group-hover:text-[#d6002f] '>Add</span>
              <svg
                className='w-4 h-4 fill-[#505965] opacity-90 rotate-180 group-hover:fill-[#d6002f]'
                focusable='false'
                aria-hidden='true'
                viewBox='0 0 24 24'
              >
                <path d='M13.98 20.717a1.79 1.79 0 0 0 2.685 0 1.79 1.79 0 0 0 0-2.684l-7.158-6.62 7.158-6.8a1.79 1.79 0 0 0 0-2.684 1.79 1.79 0 0 0-2.684 0L5.929 9.98a1.79 1.79 0 0 0 0 2.684l8.052 8.052z'></path>
              </svg>
            </div>
          </button>
          {/* Workout */}
          <button
            onClick={() => setShowAddLifeStyleInfo(true)}
            className='flex w-full bg-white justify-between px-3 py-4 text-[#505965] group border-b border-[#d4d8de] border-solid border-t-0 border-r-0 border-l-0'
          >
            <div className='flex items-center'>
              <img className='w-5 h-5 mr-2' src='/assets/images/workout.png' alt='icon' />
              <span>Workout</span>
            </div>
            <div className='flex justify-end items-center'>
              <span className='font-semibold text-[#505965] mr-2 group-hover:text-[#d6002f] '>Add</span>
              <svg
                className='w-4 h-4 fill-[#505965] opacity-90 rotate-180 group-hover:fill-[#d6002f]'
                focusable='false'
                aria-hidden='true'
                viewBox='0 0 24 24'
              >
                <path d='M13.98 20.717a1.79 1.79 0 0 0 2.685 0 1.79 1.79 0 0 0 0-2.684l-7.158-6.62 7.158-6.8a1.79 1.79 0 0 0 0-2.684 1.79 1.79 0 0 0-2.684 0L5.929 9.98a1.79 1.79 0 0 0 0 2.684l8.052 8.052z'></path>
              </svg>
            </div>
          </button>
          {/* Dietary Preference */}
          <button
            onClick={() => setShowAddLifeStyleInfo(true)}
            className='flex w-full bg-white justify-between px-3 py-4 text-[#505965] group border-b border-[#d4d8de] border-solid border-t-0 border-r-0 border-l-0'
          >
            <div className='flex items-center'>
              <img className='w-5 h-5 mr-2' src='/assets/images/diet.png' alt='icon' />
              <span>Dietary Preference</span>
            </div>
            <div className='flex justify-end items-center'>
              <span className='font-semibold text-[#505965] mr-2 group-hover:text-[#d6002f] '>Add</span>
              <svg
                className='w-4 h-4 fill-[#505965] opacity-90 rotate-180 group-hover:fill-[#d6002f]'
                focusable='false'
                aria-hidden='true'
                viewBox='0 0 24 24'
              >
                <path d='M13.98 20.717a1.79 1.79 0 0 0 2.685 0 1.79 1.79 0 0 0 0-2.684l-7.158-6.62 7.158-6.8a1.79 1.79 0 0 0 0-2.684 1.79 1.79 0 0 0-2.684 0L5.929 9.98a1.79 1.79 0 0 0 0 2.684l8.052 8.052z'></path>
              </svg>
            </div>
          </button>
          {/* Social Media */}
          <button
            onClick={() => setShowAddLifeStyleInfo(true)}
            className='flex w-full bg-white justify-between px-3 py-4 text-[#505965] group border-b border-[#d4d8de] border-solid border-t-0 border-r-0 border-l-0'
          >
            <div className='flex items-center'>
              <img className='w-5 h-5 mr-2' src='/assets/images/social_media.png' alt='icon' />
              <span>Social Media</span>
            </div>
            <div className='flex justify-end items-center'>
              <span className='font-semibold text-[#505965] mr-2 group-hover:text-[#d6002f] '>Add</span>
              <svg
                className='w-4 h-4 fill-[#505965] opacity-90 rotate-180 group-hover:fill-[#d6002f]'
                focusable='false'
                aria-hidden='true'
                viewBox='0 0 24 24'
              >
                <path d='M13.98 20.717a1.79 1.79 0 0 0 2.685 0 1.79 1.79 0 0 0 0-2.684l-7.158-6.62 7.158-6.8a1.79 1.79 0 0 0 0-2.684 1.79 1.79 0 0 0-2.684 0L5.929 9.98a1.79 1.79 0 0 0 0 2.684l8.052 8.052z'></path>
              </svg>
            </div>
          </button>
          {/* Sleeping Habits*/}
          <button
            onClick={() => setShowAddLifeStyleInfo(true)}
            className='flex w-full bg-white justify-between px-3 py-4 text-[#505965] group border-b border-[#d4d8de] border-solid border-t-0 border-r-0 border-l-0'
          >
            <div className='flex items-center'>
              <img className='w-5 h-5 mr-2' src='/assets/images/sleeping_habits.png' alt='icon' />
              <span>Sleeping Habits</span>
            </div>
            <div className='flex justify-end items-center'>
              <span className='font-semibold text-[#505965] mr-2 group-hover:text-[#d6002f] '>Add</span>
              <svg
                className='w-4 h-4 fill-[#505965] opacity-90 rotate-180 group-hover:fill-[#d6002f]'
                focusable='false'
                aria-hidden='true'
                viewBox='0 0 24 24'
              >
                <path d='M13.98 20.717a1.79 1.79 0 0 0 2.685 0 1.79 1.79 0 0 0 0-2.684l-7.158-6.62 7.158-6.8a1.79 1.79 0 0 0 0-2.684 1.79 1.79 0 0 0-2.684 0L5.929 9.98a1.79 1.79 0 0 0 0 2.684l8.052 8.052z'></path>
              </svg>
            </div>
          </button>
          {/* Job Title */}
          <div className='flex justify-between px-3 pb-3 pt-5 bg-[#f0f2f4]'>
            <div className='flex items-center n'>
              <span
                className='w-1 h-1 mr-1 inline-block rounded-full'
                style={{ backgroundImage: 'linear-gradient(to top right, #fd267a, #ff6036)' }}
              ></span>
              <label className='text-lg' htmlFor='aboutProfile'>
                Job Title
              </label>
            </div>
            <span className='text-[#d6002f]'>+3%</span>
          </div>
          <div className='px-3 py-4 text-[#505965]'>
            <input
              className='h-7 w-full text-[#505965] leading-normal bg-[#0000] outline-none'
              type='text'
              value={textJobTitle}
              onChange={(e) => setTextJobTitle(e.target.value)}
              placeholder='Add Job Title'
            />
          </div>
          {/* company */}
          <div className='flex justify-between px-3 pb-3 pt-5 bg-[#f0f2f4]'>
            <div className='flex items-center n'>
              <span
                className='w-1 h-1 mr-1 inline-block rounded-full'
                style={{ backgroundImage: 'linear-gradient(to top right, #fd267a, #ff6036)' }}
              ></span>
              <label className='text-lg' htmlFor='aboutProfile'>
                Company
              </label>
            </div>
            <span className='text-[#d6002f]'>+3%</span>
          </div>
          <div className='px-3 py-4 text-[#505965]'>
            <input
              className='h-7 w-full text-[#505965] leading-normal bg-[#0000] outline-none'
              type='text'
              value={textCompany}
              onChange={(e) => setTextCompany(e.target.value)}
              placeholder='Add Company'
            />
          </div>
          {/* school*/}
          <div className='flex justify-between px-3 pb-3 pt-5 bg-[#f0f2f4]'>
            <div className='flex items-center n'>
              <span
                className='w-1 h-1 mr-1 inline-block rounded-full'
                style={{ backgroundImage: 'linear-gradient(to top right, #fd267a, #ff6036)' }}
              ></span>
              <label className='text-lg' htmlFor='aboutProfile'>
                School
              </label>
            </div>
            <span className='text-[#d6002f]'>+3%</span>
          </div>
          <div className='px-3 py-4 text-[#505965]'>
            <input
              className='h-7 w-full text-[#505965] leading-normal bg-[#0000] outline-none'
              type='text'
              value={textSchool}
              onChange={(e) => setTextSchool(e.target.value)}
              placeholder='Add Shool'
            />
          </div>
          {/* living in*/}
          <div className='flex justify-between px-3 pb-3 pt-5 bg-[#f0f2f4]'>
            <div className='flex items-center n'>
              <span
                className='w-1 h-1 mr-1 inline-block rounded-full'
                style={{ backgroundImage: 'linear-gradient(to top right, #fd267a, #ff6036)' }}
              ></span>
              <label className='text-lg' htmlFor='aboutProfile'>
                Living In
              </label>
            </div>
            <span className='text-[#d6002f]'>+3%</span>
          </div>
          <div className='px-3 py-4 text-[#505965]'>
            <input
              className='h-7 w-full text-[#505965] leading-normal bg-[#0000] outline-none'
              type='text'
              placeholder='Living in'
              value={textLiveAt}
              onChange={(e) => setTextLiveAt(e.target.value)}
            />
          </div>
          {/* gender*/}
          <div className='flex justify-between px-3 pb-3 pt-5 bg-[#f0f2f4]'>
            <div className='flex items-center n'>
              <span
                className='w-1 h-1 mr-1 inline-block rounded-full'
                style={{ backgroundImage: 'linear-gradient(to top right, #fd267a, #ff6036)' }}
              ></span>
              <label className='text-lg' htmlFor='aboutProfile'>
                Gender
              </label>
            </div>
            <span className='text-[#d6002f]'>+3%</span>
          </div>
          <button
            onClick={() => setShowAddGender(true)}
            className='flex w-full bg-white justify-between px-3 py-4 text-[#505965] group border-b border-[#d4d8de] border-solid border-t-0 border-r-0 border-l-0'
          >
            <div className='flex items-center'>
              <span>{gender !== null ? (gender ? 'Man' : 'Women') : 'Add Gender'}</span>
            </div>
            <div className='flex justify-end items-center'>
              <span className='font-semibold text-[#505965] mr-2 group-hover:text-[#d6002f] '>Add</span>
              <svg
                className='w-4 h-4 fill-[#505965] opacity-90 rotate-180 group-hover:fill-[#d6002f]'
                focusable='false'
                aria-hidden='true'
                viewBox='0 0 24 24'
              >
                <path d='M13.98 20.717a1.79 1.79 0 0 0 2.685 0 1.79 1.79 0 0 0 0-2.684l-7.158-6.62 7.158-6.8a1.79 1.79 0 0 0 0-2.684 1.79 1.79 0 0 0-2.684 0L5.929 9.98a1.79 1.79 0 0 0 0 2.684l8.052 8.052z'></path>
              </svg>
            </div>
          </button>
          {/* Sexual orientation */}
          <div className='flex justify-between px-3 pb-3 pt-5 bg-[#f0f2f4]'>
            <div className='flex items-center n'>
              <span
                className='w-1 h-1 mr-1 inline-block rounded-full'
                style={{ backgroundImage: 'linear-gradient(to top right, #fd267a, #ff6036)' }}
              ></span>
              <label className='text-lg' htmlFor='aboutProfile'>
                Sexual Orientation
              </label>
            </div>
            <span className='text-[#d6002f]'>+3%</span>
          </div>
          <button
            onClick={() => setShowAddSexualOrientation(true)}
            className='flex w-full bg-white justify-between px-3 py-4 text-[#505965] group border-b border-[#d4d8de] border-solid border-t-0 border-r-0 border-l-0'
          >
            <div className='flex items-center'>
              <span> Add Sexual Orientation </span>
            </div>
            <div className='flex justify-end items-center'>
              <span className='font-semibold text-[#505965] mr-2 group-hover:text-[#d6002f] '>Add</span>
              <svg
                className='w-4 h-4 fill-[#505965] opacity-90 rotate-180 group-hover:fill-[#d6002f]'
                focusable='false'
                aria-hidden='true'
                viewBox='0 0 24 24'
              >
                <path d='M13.98 20.717a1.79 1.79 0 0 0 2.685 0 1.79 1.79 0 0 0 0-2.684l-7.158-6.62 7.158-6.8a1.79 1.79 0 0 0 0-2.684 1.79 1.79 0 0 0-2.684 0L5.929 9.98a1.79 1.79 0 0 0 0 2.684l8.052 8.052z'></path>
              </svg>
            </div>
          </button>
        </div>
      </div>
    </>
  )
}

function AddPassion({ setShowAddPassion }: Readonly<AddPassionProps>) {
  const [selectedPassions, setSelectedPassions] = useState<number[]>([])
  const userID = useSelector((state: RootState) => state.user.profile?.id)
  const { data: pListRes, isLoading: pListLoading } = useQuery({
    queryKey: ['passions'],
    queryFn: () => {
      return optionsProfileApi.getPassion()
    }
  })
  const updatePassionUserMutation = useMutation({
    mutationFn: async (body: number[]) => {
      if (userID) {
        const response = await userApi.updatePassionUser(userID, body)
        if (!response) {
          if (setShowAddPassion) setShowAddPassion(false)
          throw new Error('Update failed')
        }
        return response
      } else {
        if (setShowAddPassion) setShowAddPassion(false)
        throw new Error('userID is not defined')
      }
    },
    onSuccess: () => {
      if (setShowAddPassion) setShowAddPassion(false)
    }
  })
  const usePassionsEffect = (
    passions: PassionUserType[],
    setSelectedPassions: React.Dispatch<React.SetStateAction<number[]>>
  ) => {
    useEffect(() => {
      // Clear the selected passions before updating
      setSelectedPassions([])

      passions?.forEach((item) => {
        setSelectedPassions((prev) => {
          const previousArray = prev ?? []
          return [...previousArray, item.passionId]
        })
      })

      // Clean up the effect by setting selectedPassions to an empty array when the component unmounts
      return () => {
        setSelectedPassions([])
      }
    }, [passions, setSelectedPassions])
  }

  const { data: individualPassionsRes } = useQuery({
    queryKey: ['individualPassions'],
    queryFn: () => {
      if (userID) return userApi.getPassionUser(userID)
    }
  })

  const passions = pListRes?.data
  const individualPassions = individualPassionsRes?.data ?? []
  usePassionsEffect(individualPassions, setSelectedPassions)
  function handleAddPassion(id: number) {
    if (selectedPassions) {
      console.log('list', selectedPassions)
      if (selectedPassions.includes(id)) {
        setSelectedPassions((prevSelected) => prevSelected.filter((item) => item !== id))
      } else if (selectedPassions.length < 5) {
        setSelectedPassions((prevSelected) => [...prevSelected, id])
      }
    }
  }
  const handleUpdateIndividualPassion = () => {
    if (selectedPassions) updatePassionUserMutation.mutate(selectedPassions)
  }
  return (
    <div className='absolute bg-white w-full h-full z-10 overflow-auto hide-scrollbar'>
      <div className='flex-col flex'>
        <div className='relative flex flex-auto justify-center bg-white'>
          <button className='w-full py-3 px-3 text-center text-[#21262E] font-semibold text-lg'>Edit Passions</button>
          <button
            onClick={handleUpdateIndividualPassion}
            className='absolute top-4 right-3 text-[#D6002F] font-semibold text-base '
          >
            Done
          </button>
        </div>
        <div className='bg-[#f5f5f5] px-3 text-left text-sm py-4 text-[#505965]'>
          Select passions that you’d like to share with the people you connect with. Choose a minimum of 3.
        </div>
        <div className='bg-[#f5f5f5] px-3 py-2 text-[#505965] flex justify-between font-semibold'>
          <span>Passions</span>
          <span>{selectedPassions.length}/5</span>
        </div>
        <div className='bg-[#white] px-3 text-left text-sm py-4 flex flex-wrap mb-2'>
          {pListLoading && 'Loading ....'}
          {!pListLoading &&
            Array.isArray(passions) &&
            passions.map((item: PassionType) => (
              <button
                key={item.id}
                onClick={() => handleAddPassion(item?.id)}
                className={`py-1 px-3 mx-2 my-2 border-[#7c8591] border border-solid rounded-full ${
                  selectedPassions?.includes(item.id) ? 'border-red-500' : ''
                }`}
              >
                {item.pname}
              </button>
            ))}
        </div>
      </div>
    </div>
  )
}
function AddLookingFor({ setShowPurposeDate, purposeDate, setPurposeDate }: Readonly<AddPurposeDateProps>) {
  const { data, isLoading } = useQuery({
    queryKey: ['pusposeDate'],
    queryFn: () => {
      return optionsProfileApi.getPurposeDate()
    }
  })
  const purposeDates = data?.data

  const handleAddPurpose = (purposeId: number) => {
    if (!setPurposeDate) return
    if (purposeDate === purposeId) {
      setPurposeDate(null)
    } else {
      setPurposeDate(purposeId)
    }
  }

  return (
    <div className='absolute bg-white w-full h-full z-10 overflow-auto hide-scrollbar '>
      <div className='flex-col flex mb-20'>
        <div className='relative flex flex-auto justify-center bg-white'>
          <button
            onClick={() => setShowPurposeDate(false)}
            className='absolute top-4 right-3 text-[#D6002F] font-semibold text-base '
          >
            <svg focusable='false' viewBox='0 0 24 24' className='w-6 h-6 fill-[#7c8591]'>
              <path d='M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z'></path>
            </svg>
          </button>
        </div>

        <div className=' px-3 text-center text-xl py-4 text-black'>Right now I&apos;m looking for...</div>
        <div className='text-[#505965] px-3 text-center text-xs py-4'>Increase compatibility by sharing yours!</div>

        <div className='bg-white px-3 text-left text-sm py-4 flex flex-wrap mb-2'>
          {isLoading && 'Loading ....'}
          {!isLoading &&
            Array.isArray(purposeDates) &&
            purposeDates.map((item: PurposeDateType) => {
              return (
                <button
                  onClick={() => handleAddPurpose(item.id)}
                  key={item.id}
                  className={`py-1 px-3 mx-2 my-2 border-[#7c8591] border border-solid rounded-full ${
                    purposeDate == item.id ? 'border-red-500' : ''
                  }`}
                >
                  {item.pdName}
                </button>
              )
            })}
        </div>
      </div>
    </div>
  )
}
function AddLanguages({ setShowAddLanguages }: Readonly<AddLanguagesProps>) {
  const [searchInput, setSearchInput] = useState('')
  const userID = useSelector((state: RootState) => state.user.profile?.id)
  const [selectedLanguages, setSelectedLanguages] = useState<number[]>([])

  const { data, isLoading } = useQuery({
    queryKey: ['languages'],
    queryFn: () => {
      return optionsProfileApi.getLanguages()
    }
  })
  const languageAll = data?.data
  const removeAccents = (str: string) => unidecode(str)
  const debouncedSetSearchInput = debounce((value: string) => setSearchInput(value), 500)

  const filteredLanguages = languageAll?.filter((item) =>
    removeAccents(item.lname.toLowerCase()).includes(removeAccents(searchInput.toLowerCase()))
  )

  // Define mutation for updating user languages
  const updateLanguagesUserMutation = useMutation({
    mutationFn: async (body: number[]) => {
      if (userID) {
        const response = await userApi.updateLanguageUser(userID, body)
        if (!response) {
          if (setShowAddLanguages) setShowAddLanguages(false)
          throw new Error('Update failed')
        }
        return response
      } else {
        if (setShowAddLanguages) setShowAddLanguages(false)
        throw new Error('userID is not defined')
      }
    },
    onSuccess: () => {
      if (setShowAddLanguages) setShowAddLanguages(false)
    }
  })

  // useEffect hook to update selected languages based on individual languages
  const useLanguagesEffect = (
    languageAll: LanguageUserType[],
    setSelectedLanguages: React.Dispatch<React.SetStateAction<number[]>>
  ) => {
    useEffect(() => {
      // Clear the selected languages before updating
      setSelectedLanguages([])
      console.log(individualLanguages)
      individualLanguages?.forEach((item) => {
        setSelectedLanguages((prev) => {
          const previousArray = prev ?? []
          console.log(previousArray)
          console.log(item.languageId)
          return [...previousArray, item.languageId]
        })
      })
      // Clean up the effect by setting selectedLanguages to an empty array when the component unmounts
      return () => {
        setSelectedLanguages([])
      }
    }, [languageAll, setSelectedLanguages])
  }

  // Fetch individual user languages from API
  const { data: individualLanguagesRes } = useQuery({
    queryKey: ['individualLanguages'],
    queryFn: () => {
      if (userID) return userApi.getLanguageUser(userID)
    }
  })

  const individualLanguages = individualLanguagesRes?.data ?? []
  useLanguagesEffect(individualLanguages, setSelectedLanguages)

  // Handle adding or removing a language from the selected list
  function handleAddLanguage(id: number) {
    console.log(selectedLanguages)
    if (selectedLanguages) {
      if (selectedLanguages.includes(id)) {
        setSelectedLanguages((prevSelected) => prevSelected.filter((item) => item !== id))
      } else if (selectedLanguages.length < 5) {
        setSelectedLanguages((prevSelected) => [...prevSelected, id])
      }
    }
  }

  // Handle updating user languages
  const handleUpdateIndividualLanguages = () => {
    if (selectedLanguages) updateLanguagesUserMutation.mutate(selectedLanguages)
  }

  return (
    <div className='absolute bg-white w-full h-full z-10'>
      <div className='flex-col'>
        <div className='flex-col flex mb-5'>
          <div className='flex justify-between px-2 bg-white'>
            <button
              onClick={() => setShowAddLanguages(false)}
              className='w-full py-3 px-3 text-center text-[#21262E] font-semibold text-lg'
            >
              {/* icon close */}
              <svg className='w-5 h-5 fill-[#505965]' focusable='false' aria-hidden='true' viewBox='0 0 24 24'>
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M0.585786 0.585786C1.36683 -0.195262 2.63317 -0.195262 3.41422 0.585786L12 9.17157L20.5858 0.585787C21.3668 -0.195262 22.6332 -0.195262 23.4142 0.585787C24.1953 1.36684 24.1953 2.63317 23.4142 3.41421L14.8284 12L23.4142 20.5858C24.1953 21.3668 24.1953 22.6332 23.4142 23.4142C22.6332 24.1953 21.3668 24.1953 20.5858 23.4142L12 14.8284L3.41422 23.4142C2.63317 24.1953 1.36683 24.1953 0.585786 23.4142C-0.195262 22.6332 -0.195262 21.3668 0.585786 20.5858L9.17157 12L0.585786 3.41421C-0.195262 2.63317 -0.195262 1.36683 0.585786 0.585786Z'
                ></path>
              </svg>
            </button>
            <button onClick={handleUpdateIndividualLanguages} className='text-[#D6002F] font-semibold text-base '>
              Done
            </button>
          </div>
          <div className='w-full flex justify-between items-center px-3 '>
            <div className='text-left text-3xl py-4 text-black font-semibold '>Languages I Know...</div>
            <div className='text-[#505965] flex justify-between font-semibold'>{selectedLanguages?.length}/5</div>
          </div>
          <div className='text-[#505965] px-3 text-left text-sm py-2 flex flex-wrap mb-2'>
            Select up to 5 languages you know and add them to your profile
          </div>
          <div className='px-3 py-2 flex justify-between  bg-[#e9ebee]'>
            <svg className='w-7 h-7 fill-[#505965] pr-2' focusable='false' aria-hidden='true' viewBox='0 0 24 24'>
              <path
                d='M9.429 2a7.429 7.429 0 0 1 7.428 7.429c0 1.84-.674 3.531-1.783 4.834l.309.308h.903L22 20.286 20.286 22l-5.715-5.714v-.903l-.308-.309a7.446 7.446 0 0 1-4.834 1.783A7.429 7.429 0 0 1 9.429 2m0 2.286a5.121 5.121 0 0 0-5.143 5.143 5.121 5.121 0 0 0 5.143 5.142A5.121 5.121 0 0 0 14.57 9.43 5.121 5.121 0 0 0 9.43 4.286z'
                fill=''
              ></path>
            </svg>
            <input
              className='flex-1 h-7 text-[#505965] leading-normal bg-[#0000] outline-none'
              type='text'
              placeholder='Search languages'
              onChange={(e) => debouncedSetSearchInput(e.target.value)}
            />
          </div>
        </div>
        <div className='px-3 flex-1 overflow-auto hide-scrollbar max-h-[320px]'>
          <div className='bg-white px-3 text-left text-sm py-4 flex flex-wrap mb-2'>
            {isLoading && 'Loading ....'}
            {!isLoading &&
              Array.isArray(filteredLanguages) &&
              filteredLanguages.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleAddLanguage(item?.id)}
                  className={`py-1 px-3 mx-2 my-2 border-[#7c8591] border border-solid rounded-full ${
                    selectedLanguages?.includes(item.id) ? 'border-red-500' : ''
                  }`}
                >
                  {item.lname}
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
function AddBasicInfo({
  setShowExtendedInfo,
  data: basics,
  setData: setBasics
}: Readonly<AddExtendedInfoProps<BasicType>>) {
  const { data: educationData, isLoading: isLoadingEducation } = useQuery({
    queryKey: ['educations'],
    queryFn: () => {
      return optionsProfileApi.getEducations()
    }
  })
  const { data: zodiacData, isLoading: isLoadingZodiacData } = useQuery({
    queryKey: ['zodiacs'],
    queryFn: () => {
      return optionsProfileApi.getZodiacs()
    }
  })

  const { data: VacxinData, isLoading: isloadingVacxinData } = useQuery({
    queryKey: ['vacxincovids'],
    queryFn: () => {
      return optionsProfileApi.getVacxinCovids()
    }
  })
  const { data: FutureFamilyData, isLoading: isloadingFutureFamilyData } = useQuery({
    queryKey: ['futureFamilies'],
    queryFn: () => {
      return optionsProfileApi.getFuturalFamilies()
    }
  })
  const { data: Personalitydata, isLoading: isloadingPersonalities } = useQuery({
    queryKey: ['personalies'],
    queryFn: () => {
      return optionsProfileApi.getPersonalities()
    }
  })
  const { data: communicationData, isLoading: isloadingCommunicationData } = useQuery({
    queryKey: ['communications'],
    queryFn: () => {
      return optionsProfileApi.getCommunicationStyles()
    }
  })
  const { data: LovelanguageData, isLoading: isloadingLovelanguageData } = useQuery({
    queryKey: ['loveLanguages'],
    queryFn: () => {
      return optionsProfileApi.getLoveLanguages()
    }
  })
  const educations = educationData?.data
  const zodiacs = zodiacData?.data
  const futureFamilies = FutureFamilyData?.data
  const vacxins = VacxinData?.data
  const personalites = Personalitydata?.data
  const communications = communicationData?.data
  const loveLanguages = LovelanguageData?.data

  return (
    <div className='absolute bg-white w-full h-full z-10'>
      <div className='flex-col'>
        <div className='flex-col flex mb-5'>
          <div className='flex justify-between px-2 bg-white'>
            <button
              onClick={() => {
                setShowExtendedInfo(false)
              }}
              className='w-full py-3 px-3 text-center text-[#21262E] font-semibold text-lg'
            >
              {/* icon close */}
              <svg className='w-5 h-5 fill-[#505965]' focusable='false' aria-hidden='true' viewBox='0 0 24 24'>
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M0.585786 0.585786C1.36683 -0.195262 2.63317 -0.195262 3.41422 0.585786L12 9.17157L20.5858 0.585787C21.3668 -0.195262 22.6332 -0.195262 23.4142 0.585787C24.1953 1.36684 24.1953 2.63317 23.4142 3.41421L14.8284 12L23.4142 20.5858C24.1953 21.3668 24.1953 22.6332 23.4142 23.4142C22.6332 24.1953 21.3668 24.1953 20.5858 23.4142L12 14.8284L3.41422 23.4142C2.63317 24.1953 1.36683 24.1953 0.585786 23.4142C-0.195262 22.6332 -0.195262 21.3668 0.585786 20.5858L9.17157 12L0.585786 3.41421C-0.195262 2.63317 -0.195262 1.36683 0.585786 0.585786Z'
                ></path>
              </svg>
            </button>
            <button onClick={() => setShowExtendedInfo(false)} className='text-[#D6002F] font-semibold text-base '>
              Done
            </button>
          </div>
          <div className='text-[#505965] px-3 text-left text-sm py-2 flex flex-wrap mb-2'>
            Bring your best self forward by adding more about you
          </div>
        </div>
        <div className='px-3 flex-1 overflow-auto hide-scrollbar max-h-[420px]'>
          {/* zodiac */}
          <div className='flex items-center justify-start'>
            <img className='w-5 h-5 mr-2' src='/assets/images/astrological.png' alt='icon' />
            <span className='text-base font-semibold'>What is your zodiac sign?</span>
          </div>
          <div className='bg-white text-left text-sm py-4 flex flex-wrap mb-2'>
            {isLoadingZodiacData && 'Loading ....'}
            {!isLoadingZodiacData &&
              Array.isArray(zodiacs) &&
              zodiacs.map((item: ZodiacType) => {
                return (
                  <button
                    onClick={() => {
                      if (setBasics) {
                        setBasics((prev) => ({
                          ...prev,
                          zodiacID: item.id
                        }))
                      }
                    }}
                    key={item.id}
                    className={`py-1 px-3 mx-2 my-2 border-[#7c8591] border border-solid rounded-full ${
                      basics?.zodiacID == item.id ? 'border-red-500' : ''
                    }`}
                  >
                    {item.zName}
                  </button>
                )
              })}
          </div>
          {/* education */}
          <div className='flex items-center justify-start'>
            <img className='w-5 h-5 mr-2' src='/assets/images/education.png' alt='icon' />
            <span className='text-base font-semibold'>What is your education level?</span>
          </div>
          <div className='bg-white text-left text-sm py-4 flex flex-wrap mb-2'>
            {isLoadingEducation && 'Loading ....'}
            {!isLoadingEducation &&
              Array.isArray(educations) &&
              educations.map((item: EducationType) => {
                return (
                  <button
                    onClick={() => {
                      if (setBasics) {
                        setBasics((prev) => ({
                          ...prev,
                          educationID: item.id
                        }))
                      }
                    }}
                    key={item.id}
                    className={`py-1 px-3 mx-2 my-2 border-[#7c8591] border border-solid rounded-full ${
                      basics?.educationID == item.id ? 'border-red-500' : ''
                    }`}
                  >
                    {item.eName}
                  </button>
                )
              })}
          </div>
          {/* futural Famility */}
          <div className='flex items-center justify-start'>
            <img className='w-5 h-5 mr-2' src='/assets/images/kids.png' alt='icon' />
            <span className='text-base font-semibold'>Do you want children?</span>
          </div>
          <div className='bg-white text-left text-sm py-4 flex flex-wrap mb-2'>
            {isloadingFutureFamilyData && 'Loading ....'}
            {!isloadingFutureFamilyData &&
              Array.isArray(futureFamilies) &&
              futureFamilies.map((item: FutureFamilyType) => {
                return (
                  <button
                    onClick={() => {
                      if (setBasics) {
                        setBasics((prev) => ({
                          ...prev,
                          futureFamilyID: item.id
                        }))
                      }
                    }}
                    key={item.id}
                    className={`py-1 px-3 mx-2 my-2 border-[#7c8591] border border-solid rounded-full ${
                      basics?.futureFamilyID == item.id ? 'border-red-500' : ''
                    }`}
                  >
                    {item.ffName}
                  </button>
                )
              })}
          </div>
          {/* vaxin */}
          <div className='flex items-center justify-start'>
            <img className='w-5 h-5 mr-2' src='/assets/images/vacxin_covid.png' alt='icon' />
            <span className='text-base font-semibold'>Are you vaccinated?</span>
          </div>
          <div className='bg-white text-left text-sm py-4 flex flex-wrap mb-2'>
            {isloadingVacxinData && 'Loading ....'}
            {!isloadingVacxinData &&
              Array.isArray(vacxins) &&
              vacxins.map((item: VacxinCovidType) => {
                return (
                  <button
                    onClick={() => {
                      if (setBasics) {
                        setBasics((prev) => ({
                          ...prev,
                          vacxinCovidID: item.id
                        }))
                      }
                    }}
                    key={item.id}
                    className={`py-1 px-3 mx-2 my-2 border-[#7c8591] border border-solid rounded-full ${
                      basics?.vacxinCovidID == item.id ? 'border-red-500' : ''
                    }`}
                  >
                    {item.vcName}
                  </button>
                )
              })}
          </div>
          {/* personality */}
          <div className='flex items-center justify-start'>
            <img className='w-5 h-5 mr-2' src='/assets/images/personality.png' alt='icon' />
            <span className='text-base font-semibold'>What’s your Personality Type?</span>
          </div>
          <div className='bg-white text-left text-sm py-4 flex flex-wrap mb-2'>
            {isloadingPersonalities && 'Loading ....'}
            {!isloadingPersonalities &&
              Array.isArray(personalites) &&
              personalites.map((item: PersonalityType) => {
                return (
                  <button
                    onClick={() => {
                      if (setBasics) {
                        setBasics((prev) => ({
                          ...prev,
                          personalityID: item.id
                        }))
                      }
                    }}
                    key={item.id}
                    className={`py-1 px-3 mx-2 my-2 border-[#7c8591] border border-solid rounded-full ${
                      basics?.personalityID == item.id ? 'border-red-500' : ''
                    }`}
                  >
                    {item.pName}
                  </button>
                )
              })}
          </div>
          {/* communication style */}
          <div className='flex items-center justify-start'>
            <img className='w-5 h-5 mr-2' src='/assets/images/comucation_style.png' alt='icon' />
            <span className='text-base font-semibold'>What is your communication style?</span>
          </div>
          <div className='bg-white text-left text-sm py-4 flex flex-wrap mb-2'>
            {isloadingCommunicationData && 'Loading ....'}
            {!isloadingCommunicationData &&
              Array.isArray(communications) &&
              communications.map((item: CommunicationStyleType) => {
                return (
                  <button
                    onClick={() => {
                      if (setBasics) {
                        setBasics((prev) => ({
                          ...prev,
                          communicationID: item.id
                        }))
                      }
                    }}
                    key={item.id}
                    className={`py-1 px-3 mx-2 my-2 border-[#7c8591] border border-solid rounded-full ${
                      basics?.communicationID == item.id ? 'border-red-500' : ''
                    }`}
                  >
                    {item.cName}
                  </button>
                )
              })}
          </div>

          {/* lovelangue */}
          <div className='flex items-center justify-start'>
            <img className='w-5 h-5 mr-2' src='/assets/images/love_language.png' alt='icon' />
            <span className='text-base font-semibold'>How do you receive love?</span>
          </div>
          <div className='bg-white text-left text-sm py-4 flex flex-wrap mb-2'>
            {isloadingLovelanguageData && 'Loading ....'}
            {!isloadingLovelanguageData &&
              Array.isArray(loveLanguages) &&
              loveLanguages.map((item: LoveLanguageType) => {
                return (
                  <button
                    onClick={() => {
                      if (setBasics) {
                        setBasics((prev) => ({
                          ...prev,
                          loveLanguageID: item.id
                        }))
                      }
                    }}
                    key={item.id}
                    className={`py-1 px-3 mx-2 my-2 border-[#7c8591] border border-solid rounded-full ${
                      basics?.loveLanguageID == item.id ? 'border-red-500' : ''
                    }`}
                  >
                    {item.llName}
                  </button>
                )
              })}
          </div>
        </div>
      </div>
    </div>
  )
}
function AddLifeStyleInfo({
  setShowExtendedInfo,
  data: lifeStyles,
  setData: setlifeStyles
}: Readonly<AddExtendedInfoProps<LifeStyleType>>) {
  const { data: petData, isLoading: isLoadingPetData } = useQuery({
    queryKey: ['pets'],
    queryFn: () => {
      return optionsProfileApi.getPets()
    }
  })
  const { data: drinkData, isLoading: isLoadingDrinkData } = useQuery({
    queryKey: ['drinks'],
    queryFn: () => {
      return optionsProfileApi.getDrikings()
    }
  })
  const { data: smokeData, isLoading: isloadingSmokeData } = useQuery({
    queryKey: ['smokes'],
    queryFn: () => {
      return optionsProfileApi.getSmokings()
    }
  })
  const { data: workoutData, isLoading: isloadingWorkoutData } = useQuery({
    queryKey: ['workouts'],
    queryFn: () => {
      return optionsProfileApi.getWorkout()
    }
  })
  const { data: dietData, isLoading: isloadingDietData } = useQuery({
    queryKey: ['diets'],
    queryFn: () => {
      return optionsProfileApi.getDietPreference()
    }
  })
  const { data: socialData, isLoading: isloadingSocialData } = useQuery({
    queryKey: ['socials'],
    queryFn: () => {
      return optionsProfileApi.getSocialMedias()
    }
  })
  const { data: sleepHabitsData, isLoading: isLoadingSleepHabitsData } = useQuery({
    queryKey: ['sleepHabits'],
    queryFn: () => {
      return optionsProfileApi.getSleepingHabits()
    }
  })
  const pets = petData?.data
  const drinks = drinkData?.data
  const smokes = smokeData?.data
  const workouts = workoutData?.data
  const diets = dietData?.data
  const socials = socialData?.data
  const sleepHabits = sleepHabitsData?.data

  return (
    <div className='absolute bg-white w-full h-full z-10'>
      <div className='flex-col'>
        <div className='flex-col flex mb-5'>
          <div className='flex justify-between px-2 bg-white'>
            <button
              onClick={() => setShowExtendedInfo(false)}
              className='w-full py-3 px-3 text-center text-[#21262E] font-semibold text-lg'
            >
              {/* icon close */}
              <svg className='w-5 h-5 fill-[#505965]' focusable='false' aria-hidden='true' viewBox='0 0 24 24'>
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M0.585786 0.585786C1.36683 -0.195262 2.63317 -0.195262 3.41422 0.585786L12 9.17157L20.5858 0.585787C21.3668 -0.195262 22.6332 -0.195262 23.4142 0.585787C24.1953 1.36684 24.1953 2.63317 23.4142 3.41421L14.8284 12L23.4142 20.5858C24.1953 21.3668 24.1953 22.6332 23.4142 23.4142C22.6332 24.1953 21.3668 24.1953 20.5858 23.4142L12 14.8284L3.41422 23.4142C2.63317 24.1953 1.36683 24.1953 0.585786 23.4142C-0.195262 22.6332 -0.195262 21.3668 0.585786 20.5858L9.17157 12L0.585786 3.41421C-0.195262 2.63317 -0.195262 1.36683 0.585786 0.585786Z'
                ></path>
              </svg>
            </button>
            <button onClick={() => setShowExtendedInfo(false)} className='text-[#D6002F] font-semibold text-base '>
              Done
            </button>
          </div>
          <div className='text-[#505965] px-3 text-left text-sm py-2 flex flex-wrap mb-2'>
            Bring your best self forward by adding more about you
          </div>
        </div>
        <div className='px-3 flex-1 overflow-auto hide-scrollbar max-h-[420px]'>
          {/* pets */}
          <div className='flex items-center justify-start'>
            <img className='w-5 h-5 mr-2' src='/assets/images/pet.png' alt='icon' />
            <span className='text-base font-semibold'>Do you have any pets?</span>
          </div>
          <div className='bg-white text-left text-sm py-4 flex flex-wrap mb-2'>
            {isLoadingPetData && 'Loading ....'}
            {!isLoadingPetData &&
              Array.isArray(pets) &&
              pets.map((item: PetType) => {
                return (
                  <button
                    onClick={() => {
                      if (setlifeStyles) {
                        setlifeStyles((prev) => ({
                          ...prev,
                          petID: item.id
                        }))
                      }
                    }}
                    key={item.id}
                    className={`py-1 px-3 mx-2 my-2 border-[#7c8591] border border-solid rounded-full ${
                      lifeStyles?.petID == item.id ? 'border-red-500' : ''
                    }`}
                  >
                    {item.pName}
                  </button>
                )
              })}
          </div>
          {/* drinking */}
          <div className='flex items-center justify-start'>
            <img className='w-5 h-5 mr-2' src='/assets/images/drinking.png' alt='icon' />
            <span className='text-base font-semibold'>How often do you drink?</span>
          </div>
          <div className='bg-white text-left text-sm py-4 flex flex-wrap mb-2'>
            {isLoadingDrinkData && 'Loading ....'}
            {!isLoadingDrinkData &&
              Array.isArray(drinks) &&
              drinks.map((item: AlcolholType) => {
                return (
                  <button
                    onClick={() => {
                      if (setlifeStyles) {
                        setlifeStyles((prev) => ({
                          ...prev,
                          alcolholID: item.id
                        }))
                      }
                    }}
                    key={item.id}
                    className={`py-1 px-3 mx-2 my-2 border-[#7c8591] border border-solid rounded-full ${
                      lifeStyles?.alcolholID == item.id ? 'border-red-500' : ''
                    }`}
                  >
                    {item.aName}
                  </button>
                )
              })}
          </div>
          {/* smoke*/}
          <div className='flex items-center justify-start'>
            <img className='w-5 h-5 mr-2' src='/assets/images/smoking.png' alt='icon' />
            <span className='text-base font-semibold'>How often do you smoke?</span>
          </div>
          <div className='bg-white text-left text-sm py-4 flex flex-wrap mb-2'>
            {isloadingSmokeData && 'Loading ....'}
            {!isloadingSmokeData &&
              Array.isArray(smokes) &&
              smokes.map((item: SmokingType) => {
                return (
                  <button
                    onClick={() => {
                      if (setlifeStyles) {
                        setlifeStyles((prev) => ({
                          ...prev,
                          smokeID: item.id
                        }))
                      }
                    }}
                    key={item.id}
                    className={`py-1 px-3 mx-2 my-2 border-[#7c8591] border border-solid rounded-full ${
                      lifeStyles?.smokeID == item.id ? 'border-red-500' : ''
                    }`}
                  >
                    {item.sName}
                  </button>
                )
              })}
          </div>
          {/* workout */}
          <div className='flex items-center justify-start'>
            <img className='w-5 h-5 mr-2' src='/assets/images/workout.png' alt='icon' />
            <span className='text-base font-semibold'>Do you workout?</span>
          </div>
          <div className='bg-white text-left text-sm py-4 flex flex-wrap mb-2'>
            {isloadingWorkoutData && 'Loading ....'}
            {!isloadingWorkoutData &&
              Array.isArray(workouts) &&
              workouts.map((item: WorkoutType) => {
                return (
                  <button
                    onClick={() => {
                      if (setlifeStyles) {
                        setlifeStyles((prev) => ({
                          ...prev,
                          workoutID: item.id
                        }))
                      }
                    }}
                    key={item.id}
                    className={`py-1 px-3 mx-2 my-2 border-[#7c8591] border border-solid rounded-full ${
                      lifeStyles?.workoutID == item.id ? 'border-red-500' : ''
                    }`}
                  >
                    {item.wName}
                  </button>
                )
              })}
          </div>
          {/* diets */}
          <div className='flex items-center justify-start'>
            <img className='w-5 h-5 mr-2' src='/assets/images/diet.png' alt='icon' />
            <span className='text-base font-semibold'>What are your dietary preferences?</span>
          </div>
          <div className='bg-white text-left text-sm py-4 flex flex-wrap mb-2'>
            {isloadingDietData && 'Loading ....'}
            {!isloadingDietData &&
              Array.isArray(diets) &&
              diets.map((item: DietaryPreferenceType) => {
                return (
                  <button
                    onClick={() => {
                      if (setlifeStyles) {
                        setlifeStyles((prev) => ({
                          ...prev,
                          dietID: item.id
                        }))
                      }
                    }}
                    key={item.id}
                    className={`py-1 px-3 mx-2 my-2 border-[#7c8591] border border-solid rounded-full ${
                      lifeStyles?.dietID == item.id ? 'border-red-500' : ''
                    }`}
                  >
                    {item.dName}
                  </button>
                )
              })}
          </div>
          {/* social */}
          <div className='flex items-center justify-start'>
            <img className='w-5 h-5 mr-2' src='/assets/images/comucation_style.png' alt='icon' />
            <span className='text-base font-semibold'>How active are you on social media?</span>
          </div>
          <div className='bg-white text-left text-sm py-4 flex flex-wrap mb-2'>
            {isloadingSocialData && 'Loading ....'}
            {!isloadingSocialData &&
              Array.isArray(socials) &&
              socials.map((item: SocialMediaType) => {
                return (
                  <button
                    onClick={() => {
                      if (setlifeStyles) {
                        setlifeStyles((prev) => ({
                          ...prev,
                          socialMediaID: item.id
                        }))
                      }
                    }}
                    key={item.id}
                    className={`py-1 px-3 mx-2 my-2 border-[#7c8591] border border-solid rounded-full ${
                      lifeStyles?.socialMediaID == item.id ? 'border-red-500' : ''
                    }`}
                  >
                    {item.smName}
                  </button>
                )
              })}
          </div>
          {/* lovelangue */}
          <div className='flex items-center justify-start'>
            <img className='w-5 h-5 mr-2' src='/assets/images/sleeping_habits.png' alt='icon' />
            <span className='text-base font-semibold'>What are your sleeping habits?</span>
          </div>
          <div className='bg-white text-left text-sm py-4 flex flex-wrap mb-2'>
            {isLoadingSleepHabitsData && 'Loading ....'}
            {!isLoadingSleepHabitsData &&
              Array.isArray(sleepHabits) &&
              sleepHabits.map((item: SleepHabitType) => {
                return (
                  <button
                    onClick={() => {
                      if (setlifeStyles) {
                        setlifeStyles((prev) => ({
                          ...prev,
                          loveLanguageID: item.id
                        }))
                      }
                    }}
                    key={item.id}
                    className={`py-1 px-3 mx-2 my-2 border-[#7c8591] border border-solid rounded-full ${
                      lifeStyles?.loveLanguageID == item.id ? 'border-red-500' : ''
                    }`}
                  >
                    {item.shName}
                  </button>
                )
              })}
          </div>
        </div>
      </div>
    </div>
  )
}
function AddGender({ setShowSelectGender, setGender, gender }: Readonly<AddGenderProps>) {
  return (
    <div className='absolute bg-white w-full h-full z-10 overflow-auto hide-scrollbar '>
      <div className='flex-col flex mb-20'>
        <div className='relative flex flex-auto justify-center bg-white'>
          <button
            onClick={() => setShowSelectGender(false)}
            className='absolute top-4 right-3 text-[#D6002F] font-semibold text-base '
          >
            Done
          </button>
        </div>
        <div className=' px-3 text-center text-xl py-4 text-black'>Gender</div>
        <div className='text-[#505965] px-3 text-center text-xs py-4'>Increase compatibility by sharing yours!</div>
        <button
          onClick={() => {
            if (gender === false && setGender) setGender(true)
          }}
          className='flex w-full bg-white justify-between px-3 py-4 text-[#505965] group border-b border-[#d4d8de] border-solid border-t-0 border-r-0 border-l-0'
        >
          <div className='flex items-center'>
            <span className='group-hover:text-[#d6002f] '>Man</span>
          </div>
          {gender === true && (
            <svg
              className='w-4 h-4 fill-[#505965] opacity-90 rotate-180 group-hover:fill-[#d6002f]'
              focusable='false'
              aria-hidden='true'
              viewBox='0 0 24 24'
            >
              <path d='M13.98 20.717a1.79 1.79 0 0 0 2.685 0 1.79 1.79 0 0 0 0-2.684l-7.158-6.62 7.158-6.8a1.79 1.79 0 0 0 0-2.684 1.79 1.79 0 0 0-2.684 0L5.929 9.98a1.79 1.79 0 0 0 0 2.684l8.052 8.052z'></path>
            </svg>
          )}
        </button>
        <button
          onClick={() => {
            if (gender === true && setGender) setGender(false)
          }}
          className='flex w-full bg-white justify-between px-3 py-4 text-[#505965] group border-b border-[#d4d8de] border-solid border-t-0 border-r-0 border-l-0'
        >
          <div className='flex items-center'>
            <span className='group-hover:text-[#d6002f]'>Woman</span>
          </div>
          {gender === false && (
            <svg
              className='w-4 h-4 fill-[#505965] opacity-90 rotate-180 group-hover:fill-[#d6002f]'
              focusable='false'
              aria-hidden='true'
              viewBox='0 0 24 24'
            >
              <path d='M13.98 20.717a1.79 1.79 0 0 0 2.685 0 1.79 1.79 0 0 0 0-2.684l-7.158-6.62 7.158-6.8a1.79 1.79 0 0 0 0-2.684 1.79 1.79 0 0 0-2.684 0L5.929 9.98a1.79 1.79 0 0 0 0 2.684l8.052 8.052z'></path>
            </svg>
          )}
        </button>
        <div className='mt-6 text-sm text-left text-[#505965]  px-3 '>
          Learn about
          <Link className='text-[#106bd5] ml-1' to={'https://www.tinderpressroom.com/genders'}>
            More Genders on Tinder
          </Link>
        </div>
      </div>
    </div>
  )
}
function AddSexsualOrientation({
  setShowSexualOrigetation,
  sexualOrientation,
  setSexualOrientation
}: Readonly<AddSexualOrigetationProps>) {
  const { data, isLoading } = useQuery({
    queryKey: ['sexsualOrientations'],
    queryFn: () => {
      return optionsProfileApi.getSexualOrientation()
    }
  })
  const sexualOrigentations = data?.data
  return (
    <div className='absolute bg-white w-full h-full z-10'>
      <div className='flex-col flex mb-10'>
        <div className='relative flex flex-auto justify-center bg-white'>
          <button
            onClick={() => setShowSexualOrigetation(false)}
            className='absolute top-4 right-3 text-[#D6002F] font-semibold text-base '
          >
            Done
          </button>
        </div>

        <div className=' px-3 text-center text-xl py-4 text-black'>Sexual Orientation</div>
        <div className='text-[#505965] bg-[#f0f2f4] font-semibold px-3 text-left text-sm py-4'>Select up to 3</div>
        <div className='max-h-[435px] overflow-auto hide-scrollbar '>
          {isLoading && 'Loading ....'}
          {!isLoading &&
            Array.isArray(sexualOrigentations) &&
            sexualOrigentations.map((item: SexualOrientationType) => {
              return (
                <button
                  onClick={() => {
                    if (setSexualOrientation) {
                      setSexualOrientation((prevSexualOrientation) =>
                        prevSexualOrientation === item.id ? null : item.id
                      )
                    }
                  }}
                  key={item.id}
                  className='flex w-full bg-white justify-between px-3 py-4 text-[#505965] group border-b border-[#d4d8de] border-solid border-t-0 border-r-0 border-l-0'
                >
                  <div className='flex items-center'>
                    <span className='group-hover:text-[#d6002f]'>{item.soName}</span>
                  </div>
                  {sexualOrientation === item.id && (
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      focusable='false'
                      aria-hidden='true'
                      className='fill-[#ff4458] h-5 w-5'
                    >
                      <g fill=''>
                        <path
                          fillRule='evenodd'
                          d='M23.1 2.348a2.174 2.174 0 0 1 .358 3.198L8.925 22.061.63 13.745a2.161 2.161 0 0 1 3.06-3.053l5.018 5.031 11.484-13.05a2.174 2.174 0 0 1 2.907-.325Z'
                          clipRule='evenodd'
                        ></path>
                      </g>
                    </svg>
                  )}
                </button>
              )
            })}
        </div>
      </div>
    </div>
  )
}
function EditPhotoModal({
  setShowEditPhotoModal,
  setShowUploadPhotoModal,
  showEditPhotoModal,
  setImageIndex
}: EditPhotoModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const hanldeAddNewPhoto = () => {
    if (setImageIndex) {
      setImageIndex(null)
    }
    setShowUploadPhotoModal(true)
  }
  useClickOutsideDialog({ dialogRef: modalRef, setShow: setShowEditPhotoModal })
  return (
    showEditPhotoModal && (
      <div className='absolute inset-0 z-50  bg-black bg-opacity-70 flex flex-col justify-center items-center'>
        <div ref={modalRef} className='flex flex-col '>
          <div className='bg-white shadow-sm flex flex-col text-[#D6002F] w-[360px] rounded-xl'>
            <button
              onClick={() => setShowUploadPhotoModal(true)}
              className='w-full py-5 border-solid border-[#b8b8b8] border-t-0 border-l-0 border-r-0 border-b-[0.5px]'
            >
              Replace Photo
            </button>
            <button onClick={hanldeAddNewPhoto} className='w-full py-5'>
              Add Your Photo
            </button>
          </div>
          <button
            className='text-[#505965] mt-4 bg-white w-[360px] px-2 py-4 rounded-xl'
            onClick={() => setShowEditPhotoModal(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    )
  )
}
function UploadPhotoModal({
  showUploadPhotoModal,
  setShowUploadPhotoModal,
  setShowWebcamCapture,
  imageIndex,
  setImageIndex
}: UploadPhotoModalProps) {
  const userID = useSelector((state: RootState) => state.user.profile?.id)

  const queryClient = useQueryClient()

  const uploadPhotoMutation = useMutation({
    mutationFn: photoApi.uploadPhoto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getPhotos'] })
      setShowUploadPhotoModal(false)
    }
  })

  const replacePhotoMutation = useMutation({
    mutationFn: photoApi.replacePhoto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getPhotos'] })
      setShowUploadPhotoModal(false)
    }
  })
  const modalRef = useRef<HTMLDivElement>(null)
  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const file = files[0]
      const allowedExtensions = ['jpg', 'jpeg', 'png'] // Các phần mở rộng cho phép
      const extension = file.name.split('.').pop() // Lấy phần mở rộng của tệp

      if (extension && allowedExtensions.includes(extension.toLowerCase())) {
        if (extension === 'svg' && file.type !== 'image/svg+xml') {
          toast.error('Chosen file is not a valid SVG image.')
        } else {
          const formData = new FormData()
          formData.append('image', file)
          formData.append('UserId', String(userID))
          if (imageIndex) formData.append('Id', String(imageIndex))

          if (userID === null || !isNumber(userID)) {
            return
          }
          if (userID !== undefined) {
            formData.append('UserId', userID.toString())
          }
          if (!imageIndex) uploadPhotoMutation.mutate(formData)
          if (imageIndex) replacePhotoMutation.mutate(formData)
          setImageIndex(null)
        }
      } else {
        toast.error('Chosen file is not an immutage.')
      }
    }
  }
  useClickOutsideDialog({ dialogRef: modalRef, setShow: setShowUploadPhotoModal })
  return (
    showUploadPhotoModal && (
      <div className='absolute inset-0 z-50  bg-black bg-opacity-70 flex flex-col justify-center items-center'>
        <div ref={modalRef} className='flex flex-col w-[440px] bg-white shadow-sm relative p-7 rounded-xl'>
          <button onClick={() => setShowUploadPhotoModal(false)} className='absolute top-7 right-7'>
            <svg className='w-6 h-6  fill-[#505965]' focusable='false' aria-hidden='true' viewBox='0 0 24 24'>
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M0.585786 0.585786C1.36683 -0.195262 2.63317 -0.195262 3.41422 0.585786L12 9.17157L20.5858 0.585787C21.3668 -0.195262 22.6332 -0.195262 23.4142 0.585787C24.1953 1.36684 24.1953 2.63317 23.4142 3.41421L14.8284 12L23.4142 20.5858C24.1953 21.3668 24.1953 22.6332 23.4142 23.4142C22.6332 24.1953 21.3668 24.1953 20.5858 23.4142L12 14.8284L3.41422 23.4142C2.63317 24.1953 1.36683 24.1953 0.585786 23.4142C-0.195262 22.6332 -0.195262 21.3668 0.585786 20.5858L9.17157 12L0.585786 3.41421C-0.195262 2.63317 -0.195262 1.36683 0.585786 0.585786Z'
              ></path>
            </svg>
          </button>
          <h3 className='text-3xl text-left text-[#21262E] pt-2'>Create New</h3>
          <span className='text-sx text-left text-[#505965] pt-2'>Select a content type</span>
          <div className='p-5  w-full flex flex-col items-center'>
            <label className='max-w-[320px] w-full h-[100px] block' htmlFor='imageInput'>
              <div
                className='relative max-w-[320px] w-full h-[100px] rounded-md flex items-center'
                onChange={handleUploadImage}
                style={{
                  backgroundImage: "url('/assets/images/capture_from_camera.png')",
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center'
                }}
              >
                <input className='hidden' id='imageInput' type='file' accept='image/*' />
                <span className='text-left text-white block ml-3'>
                  Upload from <span className='block text-left text-3xl font-semibold'>Gallery</span>
                </span>
              </div>
            </label>
            <button
              onClick={() => {
                setShowWebcamCapture(true)
              }}
              className='relative max-w-[320px] mt-4 w-full h-[100px] rounded-md flex items-center'
              style={{
                backgroundImage: "url('/assets/images/upload_from_gallery.png')",
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center'
              }}
            >
              <input className='hidden' id='imageInput' type='file' accept='image/*' />
              <span className='text-left text-white block ml-3'>
                Capture from <span className='block text-left text-3xl font-semibold'>Camera</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    )
  )
}
const WebcamCapture = ({ show, setShow, imageIndex, setImageIndex }: WebcamCaptureProps) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const webcamRef = useRef<Webcam>(null)
  const userID = useSelector((state: RootState) => state.user.profile?.id)

  const queryClient = useQueryClient()

  const uploadPhotoMutation = useMutation({
    mutationFn: photoApi.uploadPhoto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getPhotos'] })
      setShow(false)
    }
  })

  const replacePhotoMutation = useMutation({
    mutationFn: photoApi.replacePhoto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getPhotos'] })
      setShow(false)
    }
  })

  const videoConstraints = {
    width: 440,
    height: 590,
    facingMode: 'user'
  }
  function dataURLtoFile(dataurl: string, filename: string): File {
    const arr = dataurl.split(',')
    const mime = arr[0].match(/:(.*?);/)![1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], filename, { type: mime })
  }
  const capture = useCallback(() => {
    if (webcamRef.current) {
      const screenshot = webcamRef.current.getScreenshot()
      if (screenshot) {
        const file = dataURLtoFile(screenshot, 'screenshot.png')
        const formData = new FormData()
        formData.append('image', file)
        formData.append('UserId', String(userID))
        if (imageIndex) {
          formData.append('Id', String(imageIndex))
        }

        if (userID === undefined || userID === null || isNaN(userID)) {
          return
        }
        if (!imageIndex) {
          uploadPhotoMutation.mutate(formData)
        }
        if (imageIndex) {
          replacePhotoMutation.mutate(formData)
        }
        setImageIndex(null)
      }
    }
  }, [webcamRef, uploadPhotoMutation, replacePhotoMutation, userID, imageIndex])
  useClickOutsideDialog({ dialogRef: modalRef, setShow: setShow })
  return (
    <>
      {show && (
        <div className='absolute inset-0 z-50  bg-black bg-opacity-70 flex flex-col justify-center items-center'>
          <div ref={modalRef} className='flex flex-col w-[440px] h-[590px] bg-white shadow-sm relative rounded-2xl'>
            <Webcam
              className='-scale-x-100 relative rounded-2xl shadow-sm '
              audio={false}
              ref={webcamRef}
              screenshotFormat='image/jpeg'
              height={720}
              width={1280}
              videoConstraints={videoConstraints}
            />
            <button className='absolute top-[5%] hover:scale-105 left-[5%]' onClick={() => setShow(false)}>
              <svg
                className='w-10 h-10 fill-[#fff]'
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
                stroke='#ffffff'
                strokeWidth='0.096'
              >
                <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
                <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g>
                <g id='SVGRepo_iconCarrier'>
                  <path
                    d='M20.7457 3.32851C20.3552 2.93798 19.722 2.93798 19.3315 3.32851L12.0371 10.6229L4.74275 3.32851C4.35223 2.93798 3.71906 2.93798 3.32854 3.32851C2.93801
                    3.71903 2.93801 4.3522 3.32854 4.74272L10.6229 12.0371L3.32856 19.3314C2.93803 19.722 2.93803 20.3551 3.32856 20.7457C3.71908
                      21.1362 4.35225 21.1362 4.74277 20.7457L12.0371 13.4513L19.3315 20.7457C19.722 21.1362 20.3552 21.1362 20.7457 20.7457C21.1362 20.3551
                      21.1362 19.722 20.7457 19.3315L13.4513 12.0371L20.7457 4.74272C21.1362 4.3522 21.1362 3.71903 20.7457 3.32851Z'
                    fill='#ffffff'
                  ></path>
                </g>
              </svg>
            </button>
            <button className='absolute bottom-[15%] hover:scale-105 left-1/2 -translate-x-1/2' onClick={capture}>
              <svg className=' w-20 h-20' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
                <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g>
                <g id='SVGRepo_iconCarrier'>
                  <path
                    d='M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z'
                    stroke='#ffffff'
                    strokeWidth='1.248'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  ></path>
                </g>
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  )
}
