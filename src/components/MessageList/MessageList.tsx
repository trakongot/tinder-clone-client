import { Link } from 'react-router-dom'
import path from 'src/constants/path'
import { v4 as uuid } from 'uuid'
import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import chatPreviewsApi from 'src/apis/chatPreviews.api'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'src/redux/store'
import { setChatPreviews } from 'src/redux/slices/chatPreviews.slice'
import { setCurrentChatUserID } from 'src/redux/slices/userProfile.slice'
import { SafeHTMLDisplay } from 'src/utils/HTMLSafeDisplay'
interface MessageListProps {
  className?: string
  style?: object
}

export default function MessageList({ className, style }: Readonly<MessageListProps>) {
  const chatPreviews = useSelector((state: RootState) => state.chatPreviews.chatPreviewList)
  const userID = useSelector((state: RootState) => state.user.profile?.id)

  const dispatch = useDispatch()

  const { data: chatPreviewData, isSuccess: successChatPreviewData } = useQuery({
    queryKey: ['chatPreview'],
    queryFn: () => {
      if (userID) return chatPreviewsApi.getChatPreviews(userID)
    }
  })
  useEffect(() => {
    if (chatPreviewData?.data) {
      dispatch(setChatPreviews(chatPreviewData.data))
    }
  }, [chatPreviewData, successChatPreviewData, dispatch])
  return (
    <div style={style} className={`${className} px-2 pt-4 inset-0 bg-white `}>
      <div className='flex'>
        <img className='w-[72px] h-[72px] rounded-full' src='/assets/images/bg_user_2.jpg' alt='' />
        <div className='flex flex-col justify-center ml-3'>
          <div className='flex'>
            <h3 className='font-semibold line-clamp-1'>Me</h3>
            <div style={{ transform: 'skew(-18deg)' }} className='ml-2 bg-[#e6af16]'>
              <span style={{ transform: 'skew(18deg)' }} className='text-sm px-1 inline-block font-semibold'>
                Likes You
              </span>
            </div>
          </div>
          <span className='text-[#656e7b] mt-1 font-light text-sm line-clamp-1'>Recently active, match now!</span>
        </div>
      </div>
      {successChatPreviewData &&
        Array.isArray(chatPreviews) &&
        chatPreviews.map((item) => (
          <Link
            onClick={() => {
              dispatch(setCurrentChatUserID(item.userID))
            }}
            to={path.chat + '/' + item.userName}
            key={uuid()}
            className='flex mt-3'
          >
            <img
              className='w-[72px] h-[72px] rounded-full object-cover object-center'
              src={`${item.imagePath}`}
              alt=''
            />
            <div className='flex flex-1 flex-col ml-3 items-start'>
              <h3 className='font-semibold line-clamp-1'>{item.userName}</h3>

              <p className='line-clamp-1 text-left w-full  text-[#656e7b] font-light'>
                <SafeHTMLDisplay htmlContent={item.lastMess} />
              </p>
            </div>
          </Link>
        ))}
    </div>
  )
}
