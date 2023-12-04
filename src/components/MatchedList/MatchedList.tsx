import { useQuery } from '@tanstack/react-query'
import isNumber from 'lodash'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import chatPreviewsApi from 'src/apis/chatPreviews.api'
import path from 'src/constants/path'
import { RootState } from 'src/redux/store'
import { useSelector, useDispatch } from 'react-redux'
import { v4 as uuid } from 'uuid'
import { setNewChatPreviews } from 'src/redux/slices/chatPreviews.slice'
import { setCurrentChatUserID } from 'src/redux/slices/userProfile.slice'

export default function MatchedList() {
  const userID = useSelector((state: RootState) => state.user.profile?.id)
  const newChatPreviews = useSelector((state: RootState) => state.chatPreviews.newChatPreviewList)
  const dispatch = useDispatch()

  const { data: newChatPreviewsData, isSuccess: successNewChatPreviewsData } = useQuery({
    queryKey: ['newChatPreviews'],
    queryFn: () => {
      if (userID) return chatPreviewsApi.getNewChatPreviews(userID)
    }
  })
  const { data: countLikeData } = useQuery({
    queryKey: ['amountLike'],
    queryFn: () => {
      if (userID) return chatPreviewsApi.getCountLike(userID)
    }
  })
  useEffect(() => {
    if (newChatPreviewsData?.data) {
      dispatch(setNewChatPreviews(newChatPreviewsData.data))
    }
  }, [newChatPreviewsData, successNewChatPreviewsData, dispatch])
  const countLike = countLikeData?.data as number
  return (
    <ul className='flex flex-wrap'>
      {isNumber(countLike) && (
        <li className='w-1/3'>
          <Link
            className='inline-block relative h-[140px] w-full transition-transform transform duration-300 hover:scale-110 hover:opacity-100'
            to={'#'}
          >
            <div className='bg-white rounded-md h-full relative p-2'>
              <svg className='w-full h-full' preserveAspectRatio='none' viewBox='0 0 100 100'>
                <mask
                  id='SVG_RECT___7e39f4ee-544f-4ad0-8a1d-b42fe9ec1d61--outer'
                  maskUnits='userSpaceOnUse'
                  maskContentUnits='userSpaceOnUse'
                >
                  <rect x='0' y='0' width='100' height='100' rx='4' ry='4' fill='#ffffff'></rect>
                </mask>
                <mask
                  id='SVG_RECT___7e39f4ee-544f-4ad0-8a1d-b42fe9ec1d61--inner'
                  maskUnits='userSpaceOnUse'
                  maskContentUnits='userSpaceOnUse'
                >
                  <rect
                    x='0'
                    y='0'
                    width='100'
                    height='100'
                    rx='4'
                    ry='4'
                    fill='transparent'
                    stroke='#ffffff'
                    strokeWidth='6'
                    vectorEffect='non-scaling-stroke'
                  ></rect>
                </mask>
                <g mask='url(#SVG_RECT___7e39f4ee-544f-4ad0-8a1d-b42fe9ec1d61--outer)'>
                  <rect x='0' y='0' fill='transparent' width='100' height='100'></rect>
                  <rect
                    mask='url(#SVG_RECT___7e39f4ee-544f-4ad0-8a1d-b42fe9ec1d61--inner)'
                    x='0'
                    y='0'
                    fill='#efc44c'
                    width='100'
                    height='100'
                  ></rect>
                </g>
              </svg>
              <div className='absolute inset-0 p-3 rounded-md overflow-hidden'>
                <div
                  className='block w-full h-full bg-cover bg-center rounded-md'
                  style={{
                    backgroundImage: 'url("/assets/images/bg_user.jpg")'
                  }}
                ></div>
              </div>
              <div className='inline-block absolute bottom-2 left-1/2 transform -translate-x-1/2 translate-y-1/2'>
                <svg
                  focusable='false'
                  aria-hidden='false'
                  viewBox='0 0 24 24'
                  width='24px'
                  height='24px'
                  className='fill-[#efc44c] stroke-white'
                  strokeLinecap='round'
                  aria-labelledby='24530eac05fd95b4'
                >
                  <path
                    d='M2.16 7.354h6.37a5.947 5.947 0 00-.894 2.084H2.16c-.406.04-.8-.15-1.015-.49a1.04 1.04 0 010-1.114c.215-.341.61-.532 1.015-.491v.01zm1.68 6.263c-.406.04-.8-.15-1.015-.49a1.04 1.04 0 010-1.114c.215-.34.61-.531 1.015-.49h3.796c.077.375.186.751.35 1.106l.021.043.022.043.546.902H3.84zm2.476 4.18c-.59 0-1.069-.472-1.069-1.053 0-.582.479-1.053 1.07-1.053h3.49l1.266 2.106H6.316zm13.746-1.837l-6.36 2.89a.495.495 0 01-.611-.183l-3.971-6.5a4.132 4.132 0 01-.185-3.02C9.556 7.183 11.127 6 12.949 6c.404 0 .818.064 1.233.183 1.222.365 1.745.999 2.476 2.299a5.271 5.271 0 012.346-.73c.327 0 .665.064 1.047.171 2.29.677 3.382 2.901 2.618 5.297a4.287 4.287 0 01-1.909 2.396l-.153.086-.152.075-.393.183z'
                    fill='#efc44c'
                  ></path>
                  <title id='24530eac05fd95b4'>Likes You</title>
                </svg>
              </div>
              <div className='absolute inset-0 flex items-center justify-center'>
                <div className='bg-[#efc44c] rounded-full w-10 h-10 text-center leading-10 text-sm font-semibold'>
                  {countLike}
                </div>
              </div>
            </div>
            <span className='block text-white font-semibold text-sm text-left mx-4 my-3 absolute bottom-0 left-0 right-0 whitespace-nowrap'>
              {countLike} Likes
            </span>
          </Link>
        </li>
      )}

      {Array.isArray(newChatPreviews) &&
        newChatPreviews.map((item) => (
          <li key={uuid()} className='w-1/3'>
            <Link
              onClick={() => {
                dispatch(setCurrentChatUserID(item.userID))
              }}
              className='inline-block relative h-[140px] w-full transition-transform transform duration-300 hover:scale-110 hover:opacity-100'
              to={path.newChat + '/' + item.userName}
            >
              <div className='bg-white rounded-md h-full relative p-2'>
                <div className='absolute inset-0 p-3 rounded-md overflow-hidden'>
                  <div
                    className='block w-full h-full bg-cover bg-center rounded-md'
                    style={{
                      backgroundImage: `url(${item.imagePath})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  ></div>
                </div>
              </div>
              <span className='block text-white font-semibold text-sm text-left mx-4 my-3 absolute bottom-0 left-0 right-0 whitespace-nowrap'>
                {item.userName}
              </span>
            </Link>
          </li>
        ))}
    </ul>
  )
}
