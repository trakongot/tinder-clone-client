import { Link, useNavigate } from 'react-router-dom'
import path from 'src/constants/path'
import { useContext, useEffect, useRef, useState } from 'react'
import { AppContext } from 'src/contexts/app.contexts'
import MatchedProfile from '../MatchedProfile'
import messageApi from 'src/apis/message.api'
import { useQuery } from '@tanstack/react-query'
import { ChatPreviewItem, MessageType } from 'src/types/message.type'
import {
  addChatPreviewItem,
  removeNewChatPreviewItem,
  updateChatPreviewItem
} from 'src/redux/slices/chatPreviews.slice'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'src/redux/store'
import chatPreviewsApi from 'src/apis/chatPreviews.api'
import { formatTimeAgo } from 'src/utils/until'
import { v4 as uuid } from 'uuid'
import {
  setShowCallingModal,
  setShowCommingCallModal,
  setShowVideoCallModal
} from 'src/redux/slices/animationTrick.slice'

import { CallingUserState, setCallingUser } from 'src/redux/slices/callingUser.slice'
type CommingCallModalProps = {
  setShowModal: (isVisible: boolean) => void
  showModal: boolean
  hanldeRejectCall: () => void
  hadldeApceptCall: () => void
}
type CallingModalProps = {
  setShowModal: (isVisible: boolean) => void
  showModal: boolean
  handleMislabeleCall: () => void
}
interface MessageBoxProps {
  className?: string | null
  isNewChat?: boolean
}
import Modal from 'src/utils/Model'
import { SafeHTMLDisplay } from 'src/utils/HTMLSafeDisplay'

export default function MessageBox({ className, isNewChat = false }: Readonly<MessageBoxProps>) {
  const hubConnection = useSelector((state: RootState) => state.signalRHub.signalRHub.current)
  const navigator = useNavigate()
  const dispatch = useDispatch()
  const { setIsMsgBoxActive } = useContext(AppContext)
  const currentChatUserID = useSelector((state: RootState) => state.user.currentChatUserID)
  const currentCallingUserID = useSelector((state: RootState) => state.callingUser.id)
  const userID = useSelector((state: RootState) => state.user.profile?.id)
  const newChatPreviewList = useSelector((state: RootState) => state.chatPreviews.newChatPreviewList)
  const showCommingCallModal = useSelector((state: RootState) => state.animationTrick.showCommingCallModal)
  const showCallingModal = useSelector((state: RootState) => state.animationTrick.showCallingModal)
  const [messages, setMessages] = useState<MessageType[]>([])
  const [text, setText] = useState<string>('')
  const [textareaHeight, setTextareaHeight] = useState('h-[1rem]')
  const scrollRef = useRef<HTMLDivElement | null>(null)

  const chatPreviews = useSelector((state: RootState) => state.chatPreviews.chatPreviewList)
  const newChatPreviews = useSelector((state: RootState) => state.chatPreviews.newChatPreviewList)
  const userInfo =
    chatPreviews && Array.isArray(chatPreviews) ? chatPreviews.find((item) => item.userID === currentChatUserID) : null
  const { data: titleForMessData } = useQuery({
    queryKey: ['titleChat', currentChatUserID],
    queryFn: () => {
      if (userID && currentChatUserID) return chatPreviewsApi.getTitleForMess(userID, currentChatUserID)
    },
    enabled: !!currentChatUserID && !!userID
  })

  const dayMatch = titleForMessData?.data?.dayMatch
  const userName = titleForMessData?.data?.name
  const image = titleForMessData?.data?.image
  const hanldeReiveMessage = (fromID: number, message: string) => {
    const newMessage = {
      id: Number(uuid()),
      ofStatus: true,
      sendUserId: fromID,
      receiveUserId: userID ?? null,
      content: message,
      sendTime: new Date().toISOString()
    }

    setMessages((prevMessages) => [...prevMessages, newMessage])
    const newChatPreviewIndex = newChatPreviewList?.findIndex((item) => item.userID === fromID)
    if (newChatPreviewIndex !== -1) {
      const movedItem = newChatPreviewList.splice(newChatPreviewIndex, 1)[0]
      const chatItem = {
        ...movedItem,
        lastMess: message,
        lastUserChat: fromID
      }
      dispatch(removeNewChatPreviewItem({ userID: fromID }))
      dispatch(addChatPreviewItem(chatItem))
    } else {
      dispatch(updateChatPreviewItem({ userID: fromID, lastMess: message, lastUserChat: fromID }))
    }
  }
  const hanldeCall = () => {
    if (hubConnection) hubConnection.invoke('CallWait', userID, currentChatUserID)
    dispatch(setCallingUser({ id: currentChatUserID, fullName: userName, imagePath: image }))
    dispatch(setShowCallingModal(true))
  }
  const hanldeReiveCall = (data: CallingUserState) => {
    dispatch(setCallingUser(data))
    dispatch(setShowCommingCallModal(true))
  }
  const hanldeInitCall = () => {
    if (hubConnection) {
      hubConnection.invoke('InitCall', userID, currentCallingUserID).catch((error) => {
        console.error('Error invoking InitCall:', error)
      })
    }
    dispatch(setShowCommingCallModal(false))
    navigator(path.call + '/' + currentCallingUserID)
  }
  const handleMislabeleCall = () => {
    if (hubConnection) hubConnection.invoke('MislabeledCall', userID, currentChatUserID)
    const newMessage = {
      id: Number(uuid()),
      ofStatus: true,
      sendUserId: userID ?? null,
      receiveUserId: currentCallingUserID ?? null,
      content: "<span className='text-red-900'>Call has to be reject</span>",
      sendTime: new Date().toISOString()
    }
    setMessages((prevMessages) => [...prevMessages, newMessage])
    dispatch(setShowCallingModal(false))
  }
  const handleMislabeledCall = (data: CallingUserState) => {
    dispatch(setCallingUser(data))
    const newMessage = {
      id: Number(uuid()),
      ofStatus: true,
      sendUserId: data.id,
      receiveUserId: userID ?? null,
      content: "<span style='color: red;>Mislabeled Call</span>",
      sendTime: new Date().toISOString()
    }
    setMessages((prevMessages) => [...prevMessages, newMessage])
    dispatch(setShowCallingModal(false))
  }
  const hanldeRejectedCall = (data: CallingUserState) => {
    dispatch(setCallingUser(data))
    const newMessage = {
      id: Number(uuid()),
      ofStatus: true,
      sendUserId: data.id,
      receiveUserId: userID ?? null,
      content: "<span style='color: red;>Mislabeled Call</span>",
      sendTime: new Date().toISOString()
    }
    setMessages((prevMessages) => [...prevMessages, newMessage])
    dispatch(setShowCommingCallModal(false))
  }
  const hanldeRejectCall = () => {
    if (hubConnection) hubConnection.invoke('RejectCall', userID, currentCallingUserID)
    const newMessage = {
      id: Number(uuid()),
      ofStatus: true,
      sendUserId: userID ?? null,
      receiveUserId: currentCallingUserID ?? null,
      content: "<span className='text-red-900'>Call has to be rejected</span>",
      sendTime: new Date().toISOString()
    }
    setMessages((prevMessages) => [...prevMessages, newMessage])
    dispatch(setShowCommingCallModal(false))
  }

  useEffect(() => {
    if (hubConnection) {
      hubConnection.on('ReceiveMessage', (fromID, _, message) => {
        console.log(message)
        hanldeReiveMessage(fromID, message)
      })
      hubConnection.on('CallWaitUser', (data) => {
        hanldeReiveCall(data)
      })
      hubConnection.on('RejectCallUser', (data) => {
        hanldeRejectedCall(data)
        dispatch(setShowCallingModal(false))
      })
      hubConnection.on('MislabeledCallUser', (data) => {
        handleMislabeledCall(data)
        dispatch(setShowCommingCallModal(false))
      })
      hubConnection.on('InitCallUser', (_, agreedID: number) => {
        dispatch(setShowVideoCallModal(true))
        navigator(path.call + '/' + agreedID)
        dispatch(setShowCallingModal(false))
      })
    }
  }, [hubConnection, dispatch])

  function hanldeCloseMsgBox() {}

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = event.target
    setTextareaHeight('h-auto')
    textarea.style.height = 'auto'
    const newHeight = textarea.scrollHeight

    if (newHeight <= 5 * parseFloat(getComputedStyle(textarea).lineHeight)) {
      textarea.style.height = newHeight + 'px'
    } else {
      textarea.style.height = 5 * parseFloat(getComputedStyle(textarea).lineHeight) + 'px'
      setTextareaHeight('h-[5em]')
    }
    setText(textarea.value)
  }
  const sendMessage = () => {
    const newMessage: MessageType = {
      id: null,
      ofStatus: true,
      receiveUserId: currentChatUserID,
      sendUserId: userID ?? null,
      content: text,
      sendTime: new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' })
    }
    setMessages((prevMessages) => [...prevMessages, newMessage])
    if (isNewChat) {
      const foundItem = newChatPreviews?.find((item) => item.userID === currentChatUserID)
      const avatar = foundItem?.imagePath
      const name = foundItem?.userName
      const newItem: ChatPreviewItem = {
        userID: currentChatUserID,
        imagePath: avatar ?? null,
        userName: name ?? null,
        lastMess: text,
        lastUserChat: userID ?? null
      }
      dispatch(addChatPreviewItem(newItem))
      dispatch(removeNewChatPreviewItem({ userID: newItem.userID }))
      setIsMsgBoxActive(true)
    } else {
      if (userID && currentChatUserID)
        dispatch(updateChatPreviewItem({ userID: currentChatUserID, lastMess: text, lastUserChat: userID }))
    }
    console.log(userID, currentChatUserID)
    if (hubConnection) hubConnection.invoke('SendMessage', Number(userID), Number(currentChatUserID), String(text))
    setText('')
  }
  useEffect(() => {
    setMessages([])
    setText('')
  }, [currentChatUserID])
  const { data: messagesData, isSuccess: successMessage } = useQuery({
    queryKey: ['message', userID, currentChatUserID],
    queryFn: () => {
      if (userID && currentChatUserID) return messageApi.getMessByUserID(userID, Number(currentChatUserID))
    },
    enabled: !!currentChatUserID && !isNewChat
  })
  useEffect(() => {
    if (messagesData?.data) {
      setMessages(messagesData.data)
    }
  }, [messagesData, successMessage])
  useEffect(() => {
    const currentRef = scrollRef.current
    if (currentRef) {
      currentRef.scrollTop = currentRef.scrollHeight
      currentRef.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])
  return (
    <>
      <Modal>
        <CommingCallModal
          setShowModal={(isVisible: boolean) => {
            dispatch(setShowCommingCallModal(isVisible))
          }}
          showModal={showCommingCallModal}
          hanldeRejectCall={hanldeRejectCall}
          hadldeApceptCall={hanldeInitCall}
        />
      </Modal>

      <Modal>
        <CallingModal
          setShowModal={(isVisible: boolean) => {
            dispatch(setShowCallingModal(isVisible))
          }}
          handleMislabeleCall={handleMislabeleCall}
          showModal={showCallingModal}
        />
      </Modal>
      {!currentChatUserID && <></>}
      {currentChatUserID && (
        <div className={`${className} bg-white top-0 w-full h-full z-20 flex`}>
          <div className='flex flex-col h-full flex-1 border-gray-300 border-r border-l shadow-lg'>
            <div
              style={{
                boxShadow: '0 0 5px 0 #0000001f'
              }}
              className='p-6 flex justify-between items-center h-[87px] border-b border-[#d4d8de]'
            >
              <div className='flex items-center'>
                <div
                  className='h-[50px] w-[50px] rounded-full'
                  style={{
                    backgroundImage: `url(${image})`,
                    backgroundPosition: '50% 50%',
                    backgroundSize: 'auto 125.581%'
                  }}
                ></div>
                <span className='text-[#656e7b] ml-2 text-xl'>
                  You matched with {userName} on {formatTimeAgo(dayMatch)}
                </span>
              </div>
              <div className='flex w-[15%] justify-between'>
                <button onClick={hanldeCall}>
                  <svg
                    className='w-10 h-10 hover:scale-105 group:'
                    viewBox='0 0 24 24'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M17 12C19.7614 12 22 9.76142 22 7C22 4.23858 19.7614 2 17 2C14.2386 2 12 4.23858 12 7C12 7.79984 12.1878 8.55582 12.5217 9.22624C12.6105 9.4044 12.64 9.60803 12.5886 9.80031L12.2908 10.9133C12.1615 11.3965 12.6035 11.8385 13.0867 11.7092L14.1997 11.4114C14.392 11.36 14.5956 11.3895 14.7738 11.4783C15.4442 11.8122 16.2002 12 17 12Z'
                      stroke='#7c8591'
                      strokeWidth='1.5'
                      className='stroke-[#7c8591] group-hover:stroke-[#4e5257]'
                    />
                    <path
                      d='M14.1008 16.0272L14.6446 16.5437V16.5437L14.1008 16.0272ZM14.5562 15.5477L14.0124 15.0312V15.0312L14.5562 15.5477ZM16.9729 15.2123L16.5987 15.8623H16.5987L16.9729 15.2123ZM18.8834 16.312L18.5092 16.962L18.8834 16.312ZM19.4217 19.7584L19.9655 20.275L19.9655 20.2749L19.4217 19.7584ZM18.0012 21.254L17.4574 20.7375L18.0012 21.254ZM16.6763 21.9631L16.75 22.7095L16.6763 21.9631ZM6.8154 17.4752L7.3592 16.9587L6.8154 17.4752ZM2.75185 7.92574C2.72965 7.51212 2.37635 7.19481 1.96273 7.21701C1.54911 7.23921 1.23181 7.59252 1.25401 8.00613L2.75185 7.92574ZM8.19075 9.80507L8.73454 10.3216L8.19075 9.80507ZM8.47756 9.50311L9.02135 10.0196L8.47756 9.50311ZM8.63428 6.6931L9.24668 6.26012L8.63428 6.6931ZM7.3733 4.90961L6.7609 5.3426V5.3426L7.3733 4.90961ZM3.7177 4.09213C3.43244 4.39246 3.44465 4.86717 3.74498 5.15244C4.04531 5.4377 4.52002 5.42549 4.80529 5.12516L3.7177 4.09213ZM10.0632 14.0559L10.607 13.5394L10.0632 14.0559ZM9.6641 20.8123C10.0148 21.0327 10.4778 20.9271 10.6982 20.5764C10.9186 20.2257 10.8129 19.7627 10.4622 19.5423L9.6641 20.8123ZM14.113 21.0584C13.7076 20.9735 13.3101 21.2334 13.2252 21.6388C13.1403 22.0442 13.4001 22.4417 13.8056 22.5266L14.113 21.0584ZM14.6446 16.5437L15.1 16.0642L14.0124 15.0312L13.557 15.5107L14.6446 16.5437ZM16.5987 15.8623L18.5092 16.962L19.2575 15.662L17.347 14.5623L16.5987 15.8623ZM18.8779 19.2419L17.4574 20.7375L18.545 21.7705L19.9655 20.275L18.8779 19.2419ZM7.3592 16.9587C3.48307 12.8778 2.83289 9.43556 2.75185 7.92574L1.25401 8.00613C1.35326 9.85536 2.13844 13.6403 6.27161 17.9917L7.3592 16.9587ZM8.73454 10.3216L9.02135 10.0196L7.93377 8.9866L7.64695 9.28856L8.73454 10.3216ZM9.24668 6.26012L7.98569 4.47663L6.7609 5.3426L8.02189 7.12608L9.24668 6.26012ZM8.19075 9.80507C7.64695 9.28856 7.64626 9.28929 7.64556 9.29002C7.64533 9.29028 7.64463 9.29102 7.64415 9.29152C7.6432 9.29254 7.64223 9.29357 7.64125 9.29463C7.63928 9.29675 7.63724 9.29896 7.63515 9.30127C7.63095 9.30588 7.6265 9.31087 7.62182 9.31625C7.61247 9.32701 7.60219 9.33931 7.5912 9.3532C7.56922 9.38098 7.54435 9.41511 7.51826 9.45588C7.46595 9.53764 7.40921 9.64531 7.36117 9.78033C7.26346 10.0549 7.21022 10.4185 7.27675 10.8726C7.40746 11.7647 7.99202 12.9644 9.51937 14.5724L10.607 13.5394C9.1793 12.0363 8.82765 11.1106 8.7609 10.6551C8.72871 10.4354 8.76142 10.3196 8.77436 10.2832C8.78163 10.2628 8.78639 10.2571 8.78174 10.2644C8.77948 10.2679 8.77498 10.2745 8.76742 10.2841C8.76363 10.2888 8.75908 10.2944 8.75364 10.3006C8.75092 10.3038 8.74798 10.3071 8.7448 10.3106C8.74321 10.3123 8.74156 10.3141 8.73985 10.3159C8.739 10.3169 8.73813 10.3178 8.73724 10.3187C8.7368 10.3192 8.73612 10.3199 8.7359 10.3202C8.73522 10.3209 8.73454 10.3216 8.19075 9.80507ZM9.51937 14.5724C11.0422 16.1757 12.1924 16.806 13.0699 16.9485C13.5201 17.0216 13.8846 16.9632 14.1606 16.8544C14.2955 16.8012 14.4023 16.7387 14.4824 16.6819C14.5223 16.6535 14.5556 16.6266 14.5825 16.6031C14.5959 16.5913 14.6078 16.5803 14.6181 16.5703C14.6233 16.5654 14.628 16.5606 14.6324 16.5562C14.6346 16.554 14.6368 16.5518 14.6388 16.5497C14.6398 16.5487 14.6408 16.5477 14.6417 16.5467C14.6422 16.5462 14.6429 16.5454 14.6432 16.5452C14.6439 16.5444 14.6446 16.5437 14.1008 16.0272C13.557 15.5107 13.5577 15.51 13.5583 15.5093C13.5586 15.509 13.5592 15.5083 13.5597 15.5078C13.5606 15.5069 13.5615 15.506 13.5623 15.5051C13.5641 15.5033 13.5658 15.5015 13.5675 15.4998C13.5708 15.4965 13.574 15.4933 13.577 15.4904C13.5831 15.4846 13.5885 15.4796 13.5933 15.4754C13.6029 15.467 13.61 15.4616 13.6146 15.4584C13.6239 15.4517 13.623 15.454 13.6102 15.459C13.5909 15.4666 13.5001 15.4987 13.3103 15.4679C12.9078 15.4025 12.0391 15.0472 10.607 13.5394L9.51937 14.5724ZM7.98569 4.47663C6.9721 3.04305 4.94388 2.80119 3.7177 4.09213L4.80529 5.12516C5.32812 4.57471 6.24855 4.61795 6.7609 5.3426L7.98569 4.47663ZM17.4574 20.7375C17.1783 21.0313 16.8864 21.1887 16.6026 21.2167L16.75 22.7095C17.497 22.6357 18.1016 22.2373 18.545 21.7705L17.4574 20.7375ZM9.02135 10.0196C9.98893 9.00095 10.0574 7.40678 9.24668 6.26012L8.02189 7.12608C8.44404 7.72315 8.3793 8.51753 7.93377 8.9866L9.02135 10.0196ZM18.5092 16.962C19.3301 17.4345 19.4907 18.5968 18.8779 19.2419L19.9655 20.2749C21.2705 18.901 20.8904 16.6019 19.2575 15.662L18.5092 16.962ZM15.1 16.0642C15.4854 15.6584 16.086 15.5672 16.5987 15.8623L17.347 14.5623C16.2485 13.93 14.8862 14.1113 14.0124 15.0312L15.1 16.0642ZM10.4622 19.5423C9.47846 18.9241 8.43149 18.0876 7.3592 16.9587L6.27161 17.9917C7.42564 19.2067 8.56897 20.1241 9.6641 20.8123L10.4622 19.5423ZM16.6026 21.2167C16.0561 21.2707 15.1912 21.2842 14.113 21.0584L13.8056 22.5266C15.0541 22.788 16.0742 22.7762 16.75 22.7095L16.6026 21.2167Z'
                      className='fill-[#7c8591] group-hover:fill-[#4e5257]'
                    />
                  </svg>
                </button>
                <Link onClick={hanldeCloseMsgBox} to={path.matched}>
                  <button className='rounded-full p-[5px] border-3 border-solid border-[#7c8591]'>
                    <svg
                      className='w-6 h-6 fill-[#7c8591] transition-transform transform rotate-0 hover:rotate-180 duration-500'
                      focusable='false'
                      aria-hidden='true'
                      viewBox='0 0 24 24'
                    >
                      <path
                        fillRule='evenodd'
                        clipRule='evenodd'
                        d='M0.585786 0.585786C1.36683 -0.195262 2.63317 -0.195262 3.41422 0.585786L12 9.17157L20.5858 0.585787C21.3668 -0.195262 22.6332 -0.195262 23.4142 0.585787C24.1953 1.36684 24.1953 2.63317 23.4142 3.41421L14.8284 12L23.4142 20.5858C24.1953 21.3668 24.1953 22.6332 23.4142 23.4142C22.6332 24.1953 21.3668 24.1953 20.5858 23.4142L12 14.8284L3.41422 23.4142C2.63317 24.1953 1.36683 24.1953 0.585786 23.4142C-0.195262 22.6332 -0.195262 21.3668 0.585786 20.5858L9.17157 12L0.585786 3.41421C-0.195262 2.63317 -0.195262 1.36683 0.585786 0.585786Z'
                      ></path>
                    </svg>
                  </button>
                </Link>
              </div>
            </div>
            <div className='overflow-hidden px-5 py-3 bg-[#f0f0f0] flex-1'>
              <div ref={scrollRef} className='flex flex-col flex-grow h-full p-4 overflow-auto hide-scrollbar'>
                {messages?.length <= 0 && <div>chưa có tin nhắn</div>}
                {successMessage &&
                  Array.isArray(messages) &&
                  messages.map((item: MessageType, index) => (
                    <div
                      key={item.id}
                      className={`flex w-full mt-2 space-x-3 ${item.sendUserId == userID ? 'justify-end' : ''}`}
                    >
                      <div>
                        <div className='bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg'>
                          <SafeHTMLDisplay htmlContent={item.content} />
                        </div>
                        <span className='text-xs text-gray-500 leading-none'>
                          {index === messages.length - 1 ? formatTimeAgo(item.sendTime) : ''}
                        </span>
                      </div>
                      {item.sendUserId != userID && (
                        <div
                          style={{
                            backgroundImage: `url(${userInfo?.imagePath})`,
                            backgroundPosition: '50% 50%',
                            backgroundSize: 'auto 125.581%'
                          }}
                          className='flex-shrink-0 h-10 w-10 rounded-full bg-gray-300'
                        ></div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
            <div
              style={{
                boxShadow: '0 0 5px 0 #0000001f'
              }}
              className='px-2 border-t border-[#d4d8de]'
            >
              <div className='w-full flex items-center'>
                <div className='relative px-2 flex items-center justify-center'>
                  <div className='cursor-pointer pr-4'>
                    <button className='cursor-pointer'>
                      <svg
                        className='w-6 h-6'
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 24 24'
                        focusable='false'
                        aria-hidden='true'
                      >
                        <g fill='#656e7b'>
                          <path d='M20.308 20.538a6 6 0 0 0 3.235-3.242C24 16.194 24 14.796 24 12c0-2.796 0-4.193-.457-5.296a6 6 0 0 0-3.235-3.242c.051.087.1.177.147.268C21 4.8 21 6.2 21 9v6c0 2.8 0 4.2-.545 5.27-.046.091-.096.18-.147.268Z'></path>
                          <path
                            fillRule='evenodd'
                            d='M.545 3.73C0 4.8 0 6.2 0 9v6c0 2.8 0 4.2.545 5.27a5 5 0 0 0 2.185 2.185C3.8 23 5.2 23 8 23h3c2.8 0 4.2 0 5.27-.545a5 5 0 0 0 2.185-2.185C19 19.2 19 17.8 19 15V9c0-2.8 0-4.2-.545-5.27a5 5 0 0 0-2.185-2.185C15.2 1 13.8 1 11 1H8c-2.8 0-4.2 0-5.27.545A5 5 0 0 0 .545 3.73Zm11.976 6.09c0 1.475-.353 2.33-.909 2.81 1.254.868 2.48 2.324 2.146 3.182-.705 1.813-6.754 1.712-7.67 0-.427-.795.777-2.227 2.038-3.116-.6-.465-.985-1.333-.985-2.876 0-1.509 1.205-2.732 2.69-2.732 1.486 0 2.69 1.223 2.69 2.732Z'
                            clipRule='evenodd'
                          ></path>
                        </g>
                      </svg>
                      <span className='hidden'>Choose a contact card</span>
                    </button>
                  </div>
                  <div className='cursor-pointer pr-4'>
                    <button className='cursor-pointer'>
                      <svg
                        className='w-6 h-6'
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 24 24'
                        focusable='false'
                        aria-hidden='true'
                      >
                        <path
                          fill='transparent'
                          d='M.401 4.289C.646 2.208 2.208.646 4.29.401 6.086.19 8.636 0 12 0c3.52 0 6.149.208 7.956.43 1.945.24 3.412 1.66 3.647 3.607.21 1.74.397 4.316.397 7.963 0 3.818-.206 6.461-.427 8.202-.23 1.81-1.56 3.14-3.371 3.371-1.74.221-4.384.427-8.202.427-3.648 0-6.223-.188-7.963-.397C2.09 23.368.67 21.9.43 19.956.208 18.15 0 15.52 0 12c0-3.364.19-5.914.401-7.711Z'
                        ></path>
                        <path
                          fill='#656e7b'
                          fillRule='evenodd'
                          d='M4.289.401C2.208.646.646 2.208.401 4.29.19 6.086 0 8.636 0 12c0 3.52.208 6.149.43 7.956.24 1.945 1.66 3.412 3.607 3.647 1.74.21 4.315.397 7.963.397 3.818 0 6.461-.206 8.202-.427 1.81-.23 3.14-1.56 3.371-3.371.221-1.74.427-4.384.427-8.202 0-3.647-.188-6.223-.397-7.963C23.368 2.09 21.9.67 19.956.43 18.15.208 15.52 0 12 0 8.636 0 6.086.19 4.289.401Zm6.424 14.79c-.807.902-1.934 1.495-3.37 1.495-2.314 0-4.213-1.614-4.213-4.106 0-2.504 1.899-4.094 4.213-4.094 1.65 0 2.682.831 3.275 1.768l-1.4.76a2.241 2.241 0 0 0-1.875-1.032c-1.436 0-2.48 1.103-2.48 2.598 0 1.495 1.044 2.6 2.48 2.6.7 0 1.365-.31 1.685-.606v-.95H6.94v-1.47h3.773v3.037Zm3.026-6.574v7.915h-1.685V8.617h1.685Zm3.252 4.64v3.275h-1.685V8.617h5.6V10.1h-3.915v1.673h3.832v1.484h-3.832Z'
                          clipRule='evenodd'
                        ></path>
                      </svg>
                      <span className='hidden'>GIF</span>
                    </button>
                  </div>
                  <div className='cursor-pointer pr-4'>
                    <button className='cursor-pointer'>
                      <svg
                        className='w-6 h-6'
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 24 24'
                        focusable='false'
                        aria-hidden='true'
                      >
                        <g fill='#656e7b'>
                          <path d='M.27 5.363a.445.445 0 0 1 0-.818l.042-.018c1.597-.68 2.837-2 3.42-3.638l.033-.094a.443.443 0 0 1 .835 0l.033.094a6.214 6.214 0 0 0 3.42 3.638l.041.018c.36.153.36.665 0 .818l-.041.018c-1.597.68-2.838 2-3.42 3.638l-.033.094a.443.443 0 0 1-.835 0l-.033-.094a6.214 6.214 0 0 0-3.42-3.638L.27 5.363Z'></path>
                          <path
                            fillRule='evenodd'
                            d='M21.818 14.434c.547-.548.179-1.465-.592-1.409-2.418.178-4.27.898-5.521 2.153-1.252 1.256-1.97 3.113-2.147 5.54-.056.772.858 1.141 1.404.593l6.856-6.877Z'
                          ></path>
                          <path d='M1.08 12.085c0-1.21.186-2.378.53-3.475.384.494.694 1.046.914 1.641.57 1.542 2.746 1.542 3.316 0a6.255 6.255 0 0 1 3.491-3.599c1.504-.614 1.504-2.782 0-3.396a6.269 6.269 0 0 1-2.098-1.41A11.46 11.46 0 0 1 12.621.51c5.693 0 10.422 4.136 11.367 9.575.093.538-.36.993-.903.977-3.869-.111-6.806.812-8.74 2.753-1.83 1.836-2.754 4.57-2.754 8.146 0 .205.003.412.01.622.016.545-.438.998-.974.905-5.423-.948-9.546-5.692-9.546-11.403Z'></path>
                        </g>
                      </svg>
                      <span className='hidden'>Sticker</span>
                    </button>
                  </div>
                  <div className='cursor-pointer pr-4'>
                    <button className='cursor-pointer'>
                      <svg
                        className='w-6 h-6'
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 24 24'
                        focusable='false'
                        aria-hidden='true'
                      >
                        <circle cx='12' cy='12' r='12' fill='transparent'></circle>
                        <path
                          fill='#656e7b'
                          d='M11.995 0C5.381 0 0 5.382 0 11.996 0 18.616 5.381 24 11.995 24 18.615 24 24 18.615 24 11.996 24 5.382 18.615 0 11.995 0ZM5.908 16.404a14.55 14.55 0 0 1 4.238-.638c2.414 0 4.797.612 6.892 1.77.125.068.238.292.29.572.05.28.03.567-.052.716a.61.61 0 0 1-.834.24A13.106 13.106 0 0 0 6.277 18.03a.61.61 0 0 1-.771-.402c-.107-.35.114-1.13.402-1.224Zm-.523-4.42a18.157 18.157 0 0 1 4.76-.635c2.894 0 5.767.7 8.31 2.026a.729.729 0 0 1 .402.726.746.746 0 0 1-.084.284c-.227.444-.493.743-.66.743a.768.768 0 0 1-.35-.086 16.33 16.33 0 0 0-7.617-1.854 16.337 16.337 0 0 0-4.366.585.75.75 0 0 1-.92-.525c-.112-.422.145-1.16.525-1.264ZM5.25 9.098a.88.88 0 0 1-1.073-.641c-.123-.498.188-1.076.64-1.19a22.365 22.365 0 0 1 5.328-.649c3.45 0 6.756.776 9.824 2.307a.888.888 0 0 1 .4 1.19c-.143.288-.453.598-.795.598a.924.924 0 0 1-.388-.087A20.026 20.026 0 0 0 10.145 8.5c-1.635 0-3.282.201-4.895.598Z'
                        ></path>
                      </svg>
                      <span className='hidden'>Vinyl</span>
                    </button>
                  </div>
                </div>
                <form className='flex-1 items-center'>
                  <div>
                    <textarea
                      value={text}
                      className={`hide-scrollbar w-full ${textareaHeight} font-light text-[#575c63] text-sm tracking-wide resize-none focus:outline-none`}
                      onChange={handleInputChange}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' && !event.shiftKey) {
                          event.preventDefault()
                          sendMessage()
                        }
                      }}
                    />
                  </div>
                </form>
                <div className='flex mx-2'>
                  <button type='button'>
                    <svg className='w-8 h-8' focusable='false' aria-hidden='true' viewBox='0 0 24 24'>
                      <path
                        d='M12 17.5c2.33 0 4.3-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5M8.5 11a1.5 1.5 0 100-3 1.5 1.5 0 000 3m7 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3M12 20a8 8 0 110-16 8 8 0 010 16m0-18C6.47 2 2 6.5 2 12a10 10 0 0010 10c5.523 0 10-4.477 10-10A10 10 0 0012 2z'
                        fill='#7c8591'
                        fillRule='nonzero'
                      ></path>
                    </svg>
                  </button>
                  <button
                    onClick={sendMessage}
                    className='bg-[#e9ebee] rounded-full px-5 py-2 my-2 text-[#656e7b] text-lg ml-2'
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className='w-[360px] overflow-auto hide-scrollbar '>
            <MatchedProfile idUser={Number(currentChatUserID)} />
          </div>
        </div>
      )}
    </>
  )
}

function CommingCallModal({
  showModal,
  setShowModal,
  hanldeRejectCall,
  hadldeApceptCall
}: Readonly<CommingCallModalProps>) {
  const user = useSelector((state: RootState) => state.callingUser)
  return (
    <>
      {showModal ? (
        <div className='fixed inset-0 z-50 overflow-y-auto'>
          <button
            className='fixed inset-0 w-full h-full bg-black opacity-40'
            onClick={() => setShowModal(false)}
          ></button>
          <div className='flex items-center min-h-screen px-4 py-8'>
            <div className='relative w-full max-w-lg p-4 mx-auto bg-white rounded-md shadow-lg'>
              <div className='mt-3 sm:flex'>
                {/* avatar-wrapper */}
                <div className='flex items-center justify-center flex-none w-12 h-12 mx-auto bg-[#a98282] rounded-full  animate-ping'></div>
                <div className='mt-2 text-center sm:ml-4 sm:text-left'>
                  <h4 className='text-lg font-medium text-gray-800'>{user.fullName} wants to call you.</h4>
                  <p className='mt-2 text-[15px] leading-relaxed text-gray-500'>
                    {user.fullName} is reaching out to connect with you. It&apos;s a great opportunity to catch up and
                    share meaningful moments.
                  </p>
                  <div className='items-center gap-2 mt-3 sm:flex'>
                    <button
                      className='w-full mt-2 p-2.5 flex-1 text-white bg-red-600 rounded-md outline-none ring-offset-2 ring-red-600 focus:ring-2'
                      onClick={hadldeApceptCall}
                    >
                      Apcept
                    </button>
                    <button
                      className='w-full mt-2 p-2.5 flex-1 text-gray-800 rounded-md outline-none border ring-offset-2 ring-indigo-600 focus:ring-2'
                      onClick={hanldeRejectCall}
                    >
                      Decline
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

function CallingModal({ showModal, setShowModal, handleMislabeleCall }: Readonly<CallingModalProps>) {
  return (
    <>
      {showModal ? (
        <div className='fixed inset-0 z-50 overflow-y-auto'>
          <button
            className='fixed inset-0 w-full h-full bg-black opacity-40'
            onClick={() => setShowModal(false)}
          ></button>
          <div className='flex items-center min-h-screen px-4 py-8'>
            <div className='relative w-full max-w-lg p-4 mx-auto bg-white rounded-md shadow-lg'>
              <div className='mt-3 sm:flex items-center'>
                <div className='avatar-wrapper flex items-center justify-center flex-none w-12 h-12 mx-auto bg-[#a98282] rounded-full  animate-ping'></div>
                <div className='mt-2 text-center sm:ml-4 sm:text-left'>
                  <p className='mt-2 text-[15px] leading-relaxed text-gray-500'>
                    Đang nối máy đến trà vui lòng chờ chút
                  </p>
                  <div className='items-center gap-2 mt-3 sm:flex'></div>
                </div>
                <button
                  className='w-full mt-2 p-2.5 flex-1 text-gray-800 rounded-md outline-none border ring-offset-2 ring-indigo-600 focus:ring-2'
                  onClick={handleMislabeleCall}
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
