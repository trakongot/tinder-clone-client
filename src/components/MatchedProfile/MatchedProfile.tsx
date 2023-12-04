import { useQuery } from '@tanstack/react-query'
import { forwardRef, useState, memo } from 'react'
import { useSelector } from 'react-redux'
import userApi from 'src/apis/user.api'
import { RootState } from 'src/redux/store'
import { BasicsType, LifeStylesType } from 'src/types/userInfo.type'
import { v4 as uuid } from 'uuid'

interface MatchedProfileProps {
  idUser: number | null
}
const MatchedProfile = memo(
  // eslint-disable-next-line react/prop-types
  forwardRef<HTMLDivElement, MatchedProfileProps>(({ idUser }, ref) => {
    const profile = useSelector((state: RootState) => state.user.profile)

    const [activeIndex, setActiveIndex] = useState(0)

    const nextSlide = () => {
      if (images) setActiveIndex((activeIndex + 1) % images.length)
    }
    const prevSlide = () => {
      if (images) setActiveIndex((activeIndex - 1 + images.length) % images.length)
    }
    const { data: profileData, isSuccess: successProfileData } = useQuery({
      queryKey: ['profileUser', idUser],
      queryFn: () => {
        if (idUser) return userApi.getInfoUser(idUser)
      }
    })
    const images = profileData?.data?.photos?.filter((Url) => Url !== 'https://localhost:7251/Uploads/')
    const userName = profileData?.data?.fullName
    const age = profileData?.data?.age
    const passions = profileData?.data?.passion
    const languages = profileData?.data?.languages
    const liveAt = profileData?.data?.liveAt
    const company = profileData?.data?.company
    const jobTitle = profileData?.data?.jobTitle
    const school = profileData?.data?.school
    const bio = profileData?.data?.aboutUser
    const passionsMatch = profile?.passion
    const languagesMatch = profile?.languages

    const basicsMatch: BasicsType = {
      zodiac: profile?.zodiac ?? null,
      education: profile?.education ?? null,
      futureFamily: profile?.futureFamily ?? null,
      vacxinCovid: profile?.vacxinCovid ?? null,
      personality: profile?.personality ?? null,
      communication: profile?.communication ?? null,
      loveLanguage: profile?.loveLanguage ?? null
    }

    const basics: BasicsType = {
      zodiac: profileData?.data?.zodiac ?? null,
      education: profileData?.data?.education ?? null,
      futureFamily: profileData?.data?.futureFamily ?? null,
      vacxinCovid: profileData?.data?.vacxinCovid ?? null,
      personality: profileData?.data?.personality ?? null,
      communication: profileData?.data?.communication ?? null,
      loveLanguage: profileData?.data?.loveLanguage ?? null
    }

    const lifeStyles: LifeStylesType = {
      pet: profileData?.data?.pet ?? null,
      alcolhol: profileData?.data?.alcolhol ?? null,
      smoke: profileData?.data?.smoke ?? null,
      workout: profileData?.data?.workout ?? null,
      diet: profileData?.data?.diet ?? null,
      socialMedia: profileData?.data?.socialMedia ?? null,
      sleepHabit: profileData?.data?.sleepHabit ?? null
    }
    const lifeStylesMatch: LifeStylesType = {
      pet: profile?.pet ?? null,
      alcolhol: profile?.alcolhol ?? null,
      smoke: profile?.smoke ?? null,
      workout: profile?.workout ?? null,
      diet: profile?.diet ?? null,
      socialMedia: profile?.socialMedia ?? null,
      sleepHabit: profile?.sleepHabit ?? null
    }

    return (
      <div ref={ref} className={`relative bg-white 'h-full w-full' overflow-auto hide-scrollbar shadow-lg `}>
        {successProfileData && (
          <div className='relative'>
            <div className='relative w-[360px] h-[450px] overflow-x-hidden'>
              <button className='absolute top-1/2 left-1 -translate-y-1/2 z-10' onClick={prevSlide}>
                <svg
                  className='fill-[#fcfcfc] opacity-70 hover:opacity-100 w-10 h-10 rotate-180'
                  version='1.1'
                  id='XMLID_287_'
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  stroke='#fcfcfc'
                >
                  <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
                  <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g>
                  <g id='SVGRepo_iconCarrier'>
                    <g id='next'>
                      <g>
                        <polygon points='6.8,23.7 5.4,22.3 15.7,12 5.4,1.7 6.8,0.3 18.5,12 '></polygon>
                      </g>
                    </g>
                  </g>
                </svg>
              </button>
              <button className='absolute top-1/2 right-1 -translate-y-1/2 z-10' onClick={nextSlide}>
                <svg
                  className='fill-[#fcfcfc] opacity-70 hover:opacity-100 w-10 h-10'
                  version='1.1'
                  id='XMLID_287_'
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  stroke='#fcfcfc'
                >
                  <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
                  <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g>
                  <g id='SVGRepo_iconCarrier'>
                    <g id='next'>
                      <g>
                        <polygon points='6.8,23.7 5.4,22.3 15.7,12 5.4,1.7 6.8,0.3 18.5,12 '></polygon>
                      </g>
                    </g>
                  </g>
                </svg>
              </button>
              <div className='overflow-x-hidden h-full'>
                <div
                  className='flex h-full'
                  style={{ transform: `translateX(-${activeIndex * 100}%)`, transition: 'transform 0.5s' }}
                >
                  {Array.isArray(images) &&
                    images.map((Url, index) => {
                      return (
                        <div key={uuid()} className='min-w-full'>
                          <img
                            style={{
                              objectPosition: '50% 50%'
                            }}
                            src={Url}
                            alt={`Slide ${index + 1}`}
                            className='w-full h-full object-cover'
                          />
                        </div>
                      )
                    })}
                </div>
              </div>
            </div>
            <div className='w-full flex justify-start items-center px-3 pt-4'>
              <h1 className='text-3xl'>{userName}</h1>
              <span className='text-3xl ml-2'>{age}</span>
              <svg focusable='false' aria-hidden='true' viewBox='0 0 24 24' className='w-5 h-5 fill-[#296dd3] ml-2'>
                <g clipPath='url(#verified-pending-icon-clip)'>
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M0.774772 8.72063L1.44856 8.35074C2.01453 8.03369 2.311 7.3996 2.14929 6.81835L2.01453 6.07857C1.85283 5.20669 2.52661 4.38766 3.416 4.33482L4.19759 4.28198C4.84442 4.25555 5.4104 3.80641 5.57211 3.19873L5.78772 2.45896C6.03028 1.58708 6.97358 1.13793 7.80907 1.4814L8.53675 1.77202C9.12968 2.00981 9.80347 1.85129 10.2347 1.37572L10.7468 0.794465C11.3397 0.107531 12.3908 0.107531 12.9837 0.741624L13.4958 1.32288C13.927 1.79845 14.6278 1.93055 15.2207 1.69276L16.0292 1.40214C16.8647 1.05867 17.835 1.50782 18.0775 2.35328L18.2931 3.09305C18.4548 3.70072 19.0208 4.12345 19.6677 4.14987L20.4492 4.17629C21.3656 4.20271 22.0394 5.02175 21.8777 5.89363L21.7429 6.6334C21.6351 7.24108 21.9585 7.87517 22.5245 8.16579L23.1983 8.53568C23.9799 8.93199 24.2224 9.96239 23.7104 10.6757L23.2522 11.3098C22.8749 11.8118 22.8749 12.5252 23.2522 13.0272L23.7104 13.6348C24.2494 14.3482 24.0068 15.3786 23.2252 15.8013L22.5514 16.1712C21.9855 16.4883 21.689 17.0959 21.7968 17.73L21.9316 18.4698C22.0933 19.3417 21.4195 20.1607 20.5301 20.2136L19.7485 20.2664C19.1017 20.2928 18.5357 20.742 18.374 21.3496L18.1584 22.0894C17.9158 22.9613 16.9725 23.4104 16.137 23.067L15.4093 22.7764C14.8164 22.5386 14.1426 22.6971 13.7114 23.1727L13.1993 23.7539C12.6064 24.4408 11.5284 24.4408 10.9354 23.7803L10.4233 23.1991C9.99213 22.7235 9.29139 22.5914 8.69846 22.8292L7.97078 23.1198C7.13528 23.4633 6.16504 23.0141 5.92248 22.1687L5.70687 21.4289C5.54516 20.8212 4.97918 20.3985 4.33235 20.3721L3.55076 20.3457C2.63441 20.3192 1.96063 19.5002 2.12234 18.6283L2.2571 17.8886C2.3649 17.2809 2.04148 16.6468 1.47551 16.3562L0.801724 15.9863C0.0201351 15.59 -0.222427 14.5596 0.289648 13.8462L0.747821 13.2121C1.12514 12.7101 1.12514 11.9968 0.747821 11.4948L0.289648 10.8871C-0.249378 10.1738 -0.00681618 9.14335 0.774772 8.72063ZM16.5526 6.99719C16.988 6.99719 17.3721 7.15454 17.6793 7.46925C17.9866 7.75773 18.1403 8.17733 18.1403 8.59694C18.1403 9.01655 17.961 9.43615 17.6537 9.75086L11.5337 16.5271C11.252 16.8418 10.8423 16.9991 10.4326 16.9991C10.0229 16.9991 9.63881 16.8418 9.33153 16.5271L6.25872 12.8717C5.95144 12.5832 5.7978 12.1636 5.7978 11.744C5.7978 11.3244 5.95144 10.931 6.25872 10.6163C6.566 10.3016 6.97571 10.1442 7.38542 10.1442C7.79513 10.1442 8.17923 10.3016 8.48651 10.6163L10.4326 12.3553L15.4515 7.46925C15.7332 7.15454 16.1429 6.99719 16.5526 6.99719Z'
                  ></path>
                </g>
                <defs>
                  <clipPath id='verified-pending-icon-clip'>
                    <rect width='24' height='24' fill='white'></rect>
                  </clipPath>
                </defs>
              </svg>
            </div>
            {(jobTitle || company) && (
              <div className='w-full flex justify-start items-center px-3 py-1'>
                <svg className='w-6 h-6' focusable='false' aria-hidden='true' viewBox='0 0 24 24'>
                  <g transform='translate(2 5)' stroke='#505965' strokeWidth='.936' fill='none' fillRule='evenodd'>
                    <rect x='5.006' y='3.489' width='9.988' height='9.637' rx='.936'></rect>
                    <path d='M7.15 3.434h5.7V1.452a.728.728 0 0 0-.724-.732H7.874a.737.737 0 0 0-.725.732v1.982z'></path>
                    <rect x='.72' y='3.489' width='18.56' height='9.637' rx='.936'></rect>
                  </g>
                </svg>
                <span className='text-sm ml-2 text-[#505965]'>{jobTitle ? `${jobTitle} at ${company}` : company}</span>
              </div>
            )}
            {liveAt && (
              <div className='w-full flex justify-start items-center px-3 py-1'>
                <svg className='w-6 h-6' focusable='false' aria-hidden='true' viewBox='0 0 24 24'>
                  <g stroke='#505965' strokeWidth='.936' fill='none' fillRule='evenodd'>
                    <path d='M19.695 9.518H4.427V21.15h15.268V9.52zM3.109 9.482h17.933L12.06 3.709 3.11 9.482z'></path>
                    <path d='M9.518 21.15h5.086v-6.632H9.518z'></path>
                  </g>
                </svg>
                <span className='text-sm ml-2 text-[#505965]'>{liveAt}</span>
              </div>
            )}
            {school && (
              <div className='w-full flex justify-start items-center px-3 py-1'>
                <svg focusable='false' aria-hidden='true' viewBox='0 0 24 24' className='w-6 h-6 '>
                  <path
                    fill='#505965'
                    stroke='#505965'
                    strokeWidth='.5'
                    d='M11.87 5.026L2.186 9.242c-.25.116-.25.589 0 .705l.474.204v2.622a.78.78 0 0 0-.344.657c0 .42.313.767.69.767.378 0 .692-.348.692-.767a.78.78 0 0 0-.345-.657v-2.322l2.097.921a.42.42 0 0 0-.022.144v3.83c0 .45.27.801.626 1.101.358.302.842.572 1.428.804 1.172.46 2.755.776 4.516.776 1.763 0 3.346-.317 4.518-.777.586-.23 1.07-.501 1.428-.803.355-.3.626-.65.626-1.1v-3.83a.456.456 0 0 0-.022-.145l3.264-1.425c.25-.116.25-.59 0-.705L12.13 5.025c-.082-.046-.22-.017-.26 0v.001zm.13.767l8.743 3.804L12 13.392 3.257 9.599l8.742-3.806zm-5.88 5.865l5.75 2.502a.319.319 0 0 0 .26 0l5.75-2.502v3.687c0 .077-.087.262-.358.491-.372.29-.788.52-1.232.68-1.078.426-2.604.743-4.29.743s-3.212-.317-4.29-.742c-.444-.161-.86-.39-1.232-.68-.273-.23-.358-.415-.358-.492v-3.687z'
                  ></path>
                </svg>
                <span className='text-sm ml-2 text-[#505965]'>{school}</span>
              </div>
            )}
            <div className='w-full flex justify-start items-center px-3 py-1'>
              <svg focusable='false' aria-hidden='true' viewBox='0 0 24 24' className='w-6 h-6 '>
                <g fill='#505965' stroke='#505965' strokeWidth='.5' fillRule='evenodd'>
                  <path d='M11.436 21.17l-.185-.165a35.36 35.36 0 0 1-3.615-3.801C5.222 14.244 4 11.658 4 9.524 4 5.305 7.267 2 11.436 2c4.168 0 7.437 3.305 7.437 7.524 0 4.903-6.953 11.214-7.237 11.48l-.2.167zm0-18.683c-3.869 0-6.9 3.091-6.9 7.037 0 4.401 5.771 9.927 6.897 10.972 1.12-1.054 6.902-6.694 6.902-10.95.001-3.968-3.03-7.059-6.9-7.059h.001z'></path>
                  <path d='M11.445 12.5a2.945 2.945 0 0 1-2.721-1.855 3.04 3.04 0 0 1 .641-3.269 2.905 2.905 0 0 1 3.213-.645 3.003 3.003 0 0 1 1.813 2.776c-.006 1.653-1.322 2.991-2.946 2.993zm0-5.544c-1.378 0-2.496 1.139-2.498 2.542 0 1.404 1.115 2.544 2.495 2.546a2.52 2.52 0 0 0 2.502-2.535 2.527 2.527 0 0 0-2.499-2.545v-.008z'></path>
                </g>
              </svg>
              <span className='text-sm ml-2 text-[#505965] mb-2'>8 kilometers away</span>
            </div>
            {/* end info */}
            <div className='border-t-2 border-[#d4d8de] w-full' />
            {/* bio */}
            <div className='w-full px-3 pt-4'>
              <span className='text-sm ml-2 text-left text-[#505965] w-full block mb-2'>{bio}</span>
              {/* card */}
              <div className='flex items-center w-1/2 bg-[#c0dbd1] px-3 py-2 rounded-xl mb-3'>
                <img
                  className='w-5 h-5'
                  src='https://static-assets.gotinder.com/icons/descriptors/relationship_intent_tada@3x.png'
                  alt=''
                />
                <div className='flex flex-col text-[#0B7D58] text-sm'>
                  <span>Looking for</span>
                  <span className='font-semibold'>Short-term fun</span>
                </div>
              </div>
            </div>
            <div className='border-t-2 border-[#d4d8de] w-full' />
            <div className='w-full mb-20'>
              {Array.isArray(passions) && (
                <div className='w-full  px-3 pt-4 text-[#21262E]'>
                  <h2 className='text-xl text-left mx-2 font-semibold'>passions</h2>
                  <div className='flex flex-wrap'>
                    {passions.map((item) => (
                      <span
                        key={uuid()}
                        className={`py-1 px-3 mx-2 my-2 border-[#7c8591] border rounded-full ${
                          passionsMatch?.includes(item) ? 'border-red-500' : ''
                        }`}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {Array.isArray(languages) && (
                <div className='w-full  px-3 pt-4 text-[#21262E]'>
                  <h2 className='text-xl text-left mx-2 font-semibold'>languages I Know</h2>
                  <div className='flex flex-wrap'>
                    {languages.map((item) => (
                      <span
                        key={uuid()}
                        className={`py-1 px-3 mx-2 my-2 border-[#7c8591] border rounded-full ${
                          languagesMatch?.includes(item) ? 'border-red-500' : ''
                        }`}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {basics && (
                <div className='w-full  px-3 pt-4 text-[#21262E]'>
                  <h2 className='text-xl text-left mx-2 font-semibold'>basics</h2>
                  <div className='flex flex-wrap'>
                    {Object.keys(basics).map((key) => {
                      const item = basics[key as keyof BasicsType]
                      if (item !== null) {
                        const isMatch = basicsMatch && item in basicsMatch
                        return (
                          <span
                            key={uuid()}
                            className={`py-1 px-3 mx-2 my-2 border-[#7c8591] border rounded-full ${
                              isMatch ? 'border-red-500' : ''
                            }`}
                          >
                            {item}
                          </span>
                        )
                      }
                    })}
                  </div>
                </div>
              )}

              {lifeStyles && (
                <div className='w-full  px-3 pt-4 text-[#21262E]'>
                  <h2 className='text-xl text-left mx-2 font-semibold'>LifeStyles</h2>
                  <div className='flex flex-wrap'>
                    {Object.keys(lifeStyles).map((key) => {
                      const item = lifeStyles[key as keyof LifeStylesType]
                      if (item !== null) {
                        const isMatch = lifeStylesMatch && item in lifeStylesMatch
                        return (
                          <span
                            key={uuid()}
                            className={`py-1 px-3 mx-2 my-2 border-[#7c8591] border rounded-full ${
                              isMatch ? 'border-red-500' : ''
                            }`}
                          >
                            {item}
                          </span>
                        )
                      }
                    })}
                  </div>
                </div>
              )}
            </div>
            <div className='border-t-2 border-[#dddedf] w-full' />
            <button className='w-full px-3 py-7 text-[#505965]'>
              <span className='block font-semibold'>Block {userName}</span>
              <span className='block text-sm'>You won’t see them, they won’t see you.</span>
            </button>
            <div className='border-t-2 border-[#dddedf] w-full' />
            <button className='w-full px-3 py-7 mb-20 text-[#505965]'>
              <span className='block font-semibold'>Report {userName}</span>
              <span className='block text-sm'>Don&apos;t worry - we won&apos;t tell them.</span>
            </button>
          </div>
        )}
      </div>
    )
  })
)

MatchedProfile.displayName = 'MatchedProfile'
export default MatchedProfile
