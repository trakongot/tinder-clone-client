import MatchedProfile from 'src/components/MatchedProfile'
import { v4 as uuid } from 'uuid'
import { useEffect, useRef, useState } from 'react'
import { useClickOutsideDialog } from 'src/hooks/useClickOutsideDialog'
import Card from './Card'
import { useMutation, useQuery } from '@tanstack/react-query'
import recommendApi from 'src/apis/recommend.api'
import { RootState } from 'src/redux/store'
import { useSelector } from 'react-redux'
import { shuffleArray } from 'src/utils/until'
import { UserInfoRecommendType } from 'src/types/userInfo.type'

export default function CardBox() {
  const userID = useSelector((state: RootState) => state.user.profile?.id)
  const [showProfile, setShowProfile] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)
  const divOverlayRef = useRef<HTMLDivElement>(null)
  const [recommendList, setRecommendList] = useState<UserInfoRecommendType[] | null>(null)
  const [currentrecommendID, setCurrentrecommendID] = useState<number | null>(null)

  const hanldeShowProfile = (id: number) => {
    setShowProfile(true)
    setCurrentrecommendID(id)
  }
  const { data: recommendData } = useQuery({
    queryKey: ['recommend'],
    queryFn: () => (userID ? recommendApi.getRecommend(userID) : null)
  })
  const recommendMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: number[] }) => recommendApi.getDetailsRecommend(id, data),
    onSuccess: (data) => {
      if (data) setRecommendList(data?.data)
    }
  })
  useEffect(() => {
    if (recommendData?.data?.item1 && recommendData?.data?.item2) {
      const mergedArray = [...recommendData.data.item1, ...recommendData.data.item2]
      const filteredArray = mergedArray.filter((item) => item !== userID)
      const shuffledArray = shuffleArray([...filteredArray])
      if (userID) recommendMutation.mutate({ id: userID, data: shuffledArray })
    }
  }, [recommendData?.data])
  useEffect(() => {
    const divElement = cardRef.current
    const divOverlayElement = divOverlayRef.current

    if (divElement && divOverlayElement) {
      const divRect = divElement.getBoundingClientRect()
      const divOverlayStyle = {
        top: `${divRect.top + 600}px`,
        width: `${divRect.width}px`
      }
      Object.assign(divOverlayElement.style, divOverlayStyle)
    }
  }, [])

  useClickOutsideDialog({ dialogRef: profileRef, setShow: setShowProfile })
  return (
    <main className='w-full h-full bg-[#f0f2f4] flex items-center justify-center'>
      <div
        ref={divOverlayRef}
        style={{
          top: ' 50%',
          marginTop: '300px',
          width: '350px',
          background: showProfile ? 'linear-gradient(to bottom, transparent,rgb(255, 255, 255) 20%) ' : ''
        }}
        className='absolute -translate-y-full z-20 h-[65px] flex items-center justify-center bottom-0 w-full'
      >
        <div className='flex justify-evenly items-center py-3 w-full pb-5'>
          {!showProfile && (
            <button className='group rounded-full w-14 h-14  flex justify-center items-center border-[#eab72c] border border-solid'>
              <svg
                className='group-hover:scale-105 w-9 h-9 fill-[#efc44c]'
                focusable='false'
                aria-hidden='true'
                viewBox='0 0 24 24'
              >
                <path d='M12.119 4.599V3.307c0-1.216-.76-1.672-1.824-.988l-.608.304L6.04 5.13l-.456.304c-1.064.76-1.064 1.748 0 2.28l.38.38c.987.76 2.66 1.824 3.647 2.432l.532.304c.912.76 1.748.228 1.748-.912V8.246a5.125 5.125 0 0 1 5.167 5.167c0 2.888-2.28 5.092-5.167 5.092-3.04 0-5.32-2.28-5.32-5.168 0-.912-.76-1.671-1.747-1.671-1.064 0-1.824.76-1.824 1.671C3 18.125 6.951 22 11.815 22c4.787 0 8.738-3.8 8.738-8.663.076-4.711-3.875-8.51-8.662-8.51l.228-.228z'></path>
              </svg>
            </button>
          )}
          <button className='group rounded-full w-16 h-16 flex justify-center items-center border-[#ff4458] border border-solid'>
            <svg
              className='group-hover:scale-105 w-9 h-9 fill-[#ff4458]'
              focusable='false'
              aria-hidden='true'
              viewBox='0 0 24 24'
            >
              <path d='m15.44 12 4.768 4.708c1.056.977 1.056 2.441 0 3.499-.813 1.057-2.438 1.057-3.413 0L12 15.52l-4.713 4.605c-.975 1.058-2.438 1.058-3.495 0-1.056-.813-1.056-2.44 0-3.417L8.47 12 3.874 7.271c-1.138-.976-1.138-2.44 0-3.417a1.973 1.973 0 0 1 3.25 0L12 8.421l4.713-4.567c.975-1.139 2.438-1.139 3.413 0 1.057.814 1.057 2.44 0 3.417L15.44 12Z'></path>
            </svg>
          </button>
          <button className='group rounded-full w-16 h-16 flex justify-center items-center border-[#3cc6f7] border border-solid'>
            <svg
              className='group-hover:scale-105 w-9 h-9 fill-[#3cc6f7]'
              focusable='false'
              aria-hidden='true'
              viewBox='0 0 24 24'
            >
              <path d='M21.06 9.06l-5.47-.66c-.15 0-.39-.25-.47-.41l-2.34-5.25c-.47-.99-1.17-.99-1.56 0L8.87 7.99c0 .16-.23.4-.47.4l-5.47.66c-1.01 0-1.25.83-.46 1.65l4.06 3.77c.15.16.23.5.15.66L5.6 20.87c-.16.98.4 1.48 1.33.82l4.69-2.79h.78l4.69 2.87c.78.58 1.56 0 1.25-.98l-1.02-5.75s0-.4.23-.57l3.91-3.86c.78-.82.78-1.64-.39-1.64v.08z '></path>
            </svg>
          </button>
          <button className='group rounded-full w-16 h-16 flex justify-center items-center border-[#2be8ca] border border-solid'>
            <svg
              className='group-hover:scale-105 w-9 h-9 fill-[#2be8ca]'
              focusable='false'
              aria-hidden='true'
              viewBox='0 0 24 24'
            >
              <path d='M21.994 10.225c0-3.598-2.395-6.212-5.72-6.212-1.78 0-2.737.647-4.27 2.135C10.463 4.66 9.505 4 7.732 4 4.407 4 2 6.62 2 10.231c0 1.52.537 2.95 1.533 4.076l8.024 7.357c.246.22.647.22.886 0l7.247-6.58.44-.401.162-.182.168-.174a6.152 6.152 0 0 0 1.54-4.09 '></path>
            </svg>
          </button>
          {!showProfile && (
            <button className='group rounded-full w-14 h-14 flex justify-center items-center border-[#b64af3] border border-solid'>
              <svg
                className='group-hover:scale-105 w-9 h-9 fill-[#b64af3]'
                focusable='false'
                aria-hidden='true'
                viewBox='0 0 24 24'
              >
                <path d='M15.979 14.018c.637-.638.51-1.275-.192-1.722l-1.275-.765c-.638-.383-1.148-1.275-.956-2.104L15.15 2.73c.191-.765-.128-.956-.765-.446L6.414 9.937c-.638.638-.51 1.275.19 1.722l1.276.765c.638.382 1.148 1.275.957 2.168l-1.658 6.632c-.191.829.191 1.02.765.446l8.035-7.652z'></path>{' '}
              </svg>
            </button>
          )}
        </div>
      </div>
      {Array.isArray(recommendList) &&
        recommendList.map((data) => {
          return <Card ref={cardRef} data={data} hanldeShowProfile={hanldeShowProfile} key={uuid()}></Card>
        })}
      {showProfile && (
        <div className={`z-10 absolute rounded-lg h-[600px] w-[360px] overflow-auto hide-scrollbar`}>
          <MatchedProfile ref={profileRef} idUser={currentrecommendID}></MatchedProfile>
        </div>
      )}
    </main>
  )
}
