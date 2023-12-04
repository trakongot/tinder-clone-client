import { useMutation } from '@tanstack/react-query'
import { useAnimation, motion, useMotionValue, useTransform } from 'framer-motion'
import { forwardRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import swipeApi from 'src/apis/swipe.api'
import { addChatNewPreviewItem } from 'src/redux/slices/chatPreviews.slice'
import { RootState } from 'src/redux/store'
import { UserInfoRecommendType } from 'src/types/userInfo.type'
import { v4 as uuid } from 'uuid'

type CardProps = {
  hanldeShowProfile: (id: number) => void
  data: UserInfoRecommendType
}
const Card = forwardRef<HTMLDivElement, CardProps>(({ hanldeShowProfile, data }, ref) => {
  const userID = useSelector((state: RootState) => state.user?.profile?.id)
  const dispatch = useDispatch()
  const [activeIndex, setActiveIndex] = useState(0)
  const images = data.imagePath
  const nextSlide = () => {
    if (images) setActiveIndex((activeIndex + 1) % images.length)
  }

  const prevSlide = () => {
    if (images) setActiveIndex((activeIndex - 1 + images.length) % images.length)
  }

  const animControls = useAnimation()
  const motionValue = useMotionValue(0)
  const rotateValue = useTransform(motionValue, [-200, 200], [-50, 50])
  const opacityValue = useTransform(motionValue, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0])
  const [isCardVisible, setIsCardVisible] = useState(true)

  const swipeLikeMutation = useMutation({
    mutationFn: ({ fromID, toID }: { fromID: number; toID: number }) => swipeApi.swipeLike(fromID, toID),
    onSuccess: (data) => {
      if (data?.data?.userID) {
        dispatch(addChatNewPreviewItem(data?.data))
      }
    }
  })
  const swipeUnlikeMutation = useMutation({
    mutationFn: ({ fromID, toID }: { fromID: number; toID: number }) => swipeApi.swipeUnlike(fromID, toID)
  })
  return (
    <>
      {isCardVisible && (
        <motion.div
          ref={ref}
          className={`absolute card rounded-lg h-[600px] w-[360px] overflow-hidden ]`}
          style={{
            x: motionValue,
            rotate: rotateValue,
            opacity: opacityValue
          }}
          drag='x'
          dragConstraints={{ left: -1000, right: 1000 }}
          onDragEnd={(_, info) => {
            if (info.offset.x > 0 && userID && data.id) {
              swipeLikeMutation.mutate({ fromID: userID, toID: data.id })
            } else if (userID && data.id) {
              swipeUnlikeMutation.mutate({ fromID: userID, toID: data.id })
            }
            if (Math.abs(info.point.x) > 150) {
              setIsCardVisible(false)
            }
            if (Math.abs(info.point.x) <= 150) {
              animControls.start({ x: 0 })
            } else {
              // If card is dragged beyond 150
              // make it disappear

              // Making use of ternary operator
              animControls.start({ x: info.point.x < 0 ? -200 : 200 })
            }
          }}
          animate={animControls}
        >
          <div
            className='flex h-full'
            style={{ transform: `translateX(-${activeIndex * 100}%)`, transition: 'transform 0.5s' }}
          >
            {Array.isArray(images) &&
              images.map((image) => (
                <div
                  key={uuid()}
                  className='min-w-full'
                  style={{
                    backgroundImage: `url(${image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                >
                  {/* You can add other content or styles within this div if needed */}
                </div>
              ))}
          </div>
          <div className='-rotate-[20deg] absolute top-10 left-10 rounded-md p-1 z-10 border-2 border-solid border-[#21d07c] text-[#21d07c] text-3xl uppercase'>
            Like
          </div>
          <div className='rotate-[20deg] absolute top-10 right-10 rounded-md p-1 z-10 border-2 border-solid border-[#c62c1e] text-[#c62c1e] text-3xl uppercase'>
            Nope
          </div>

          <button className='absolute top-1/2 left-1 -translate-y-1/2 z-100' onClick={prevSlide}>
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
          <button className='absolute top-1/2 right-1 -translate-y-1/2 z-100' onClick={nextSlide}>
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
          <div className='absolute bottom-0 w-full '>
            <div className='p-5 flex justify-between items-center'>
              <div className='info text-white'>
                <div className='text-sm text-left'>Recently Active</div>
                <div className='flex items-center'>
                  <span>{data.fullName}</span> <span className='ml-2'>{data.age}</span>
                </div>
                <div className='flex items-center'>
                  <svg className='w-5 h-5' focusable='false' aria-hidden='true' viewBox='0 0 24 24'>
                    <g fill='#fff' stroke='#fff' strokeWidth='.5' fillRule='evenodd'>
                      <path d='M11.436 21.17l-.185-.165a35.36 35.36 0 0 1-3.615-3.801C5.222 14.244 4 11.658 4 9.524 4 5.305 7.267 2 11.436 2c4.168 0 7.437 3.305 7.437 7.524 0 4.903-6.953 11.214-7.237 11.48l-.2.167zm0-18.683c-3.869 0-6.9 3.091-6.9 7.037 0 4.401 5.771 9.927 6.897 10.972 1.12-1.054 6.902-6.694 6.902-10.95.001-3.968-3.03-7.059-6.9-7.059h.001z'></path>
                      <path d='M11.445 12.5a2.945 2.945 0 0 1-2.721-1.855 3.04 3.04 0 0 1 .641-3.269 2.905 2.905 0 0 1 3.213-.645 3.003 3.003 0 0 1 1.813 2.776c-.006 1.653-1.322 2.991-2.946 2.993zm0-5.544c-1.378 0-2.496 1.139-2.498 2.542 0 1.404 1.115 2.544 2.495 2.546a2.52 2.52 0 0 0 2.502-2.535 2.527 2.527 0 0 0-2.499-2.545v-.008z'></path>
                    </g>
                  </svg>
                  <span>{data.distance} kilometers away</span>
                </div>
              </div>
              <button
                className='hover:scale-105'
                onClick={() => {
                  if (data?.id) hanldeShowProfile(data.id)
                }}
              >
                <svg className='w-5 h-5' focusable='false' aria-hidden='true' viewBox='0 0 24 24'>
                  <path
                    fill='#fff'
                    d='M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z'
                  ></path>
                </svg>
              </button>
            </div>
            <div
              style={{
                background: 'linear-gradient(to bottom, transparent, rgb(0, 0, 0) 20%)'
              }}
              className='h-[80px] w-full flex items-center'
            ></div>
          </div>
        </motion.div>
      )}
    </>
  )
})
Card.displayName = 'card'
export default Card
