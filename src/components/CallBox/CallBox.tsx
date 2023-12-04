import { useEffect, useRef, useState } from 'react'
import { Peer } from 'peerjs'
import { useSelector } from 'react-redux'
import { RootState } from 'src/redux/store'
import path from 'src/constants/path'
import { useNavigate } from 'react-router-dom'

export default function CallBox() {
  const hubConnection = useSelector((state: RootState) => state.signalRHub.signalRHub.current)
  const currentCallingUserID = useSelector((state: RootState) => state.callingUser.id)
  const userID = useSelector((state: RootState) => state.user.profile?.id)
  const callConnectionRef = useRef<Peer | null>(null)
  const myVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const [voiceOn, setVoiceOn] = useState<boolean>(true)
  const [cameraOn, setCameraOn] = useState<boolean>(true)
  // const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }
  const localStream = useRef<MediaStream | null>(null)
  const [peerID, setPeerID] = useState('')
  const navigatorPage = useNavigate()

  useEffect(() => {
    // Kiểm tra xem đối tượng đã được khởi tạo hay chưa
    if (!callConnectionRef.current) {
      // Nếu chưa, thì tạo đối tượng Peer và lưu trữ nó trong ref
      callConnectionRef.current = new Peer()
    }
    if (callConnectionRef.current) {
      callConnectionRef.current.on('open', (peerID) => {
        console.log(`My Peer ID: ${peerID}`)
        setPeerID(peerID)
        navigator.mediaDevices
          .getUserMedia({ audio: true, video: true })
          .then((stream) => {
            localStream.current = stream
            if (myVideoRef.current) {
              myVideoRef.current.srcObject = stream
            }

            callConnectionRef.current?.on('call', (incomingCall) => {
              // Đổi tên biến 'call' thành 'incomingCall'
              incomingCall.answer(stream)
              incomingCall.on('stream', (userVideoStream) => {
                if (remoteVideoRef.current) {
                  remoteVideoRef.current.srcObject = userVideoStream
                }
                const remoteVideoTrack = userVideoStream.getVideoTracks()[0]
                console.log('Remote Video Track Enabled:', remoteVideoTrack.enabled)
              })
            })
            if (currentCallingUserID) {
              hubConnection?.invoke('AgreeCall', peerID, Number(userID), Number(currentCallingUserID))
            }
          })
          .catch((error) => {
            console.error('Error accessing camera and microphone:', error)
          })
      })
      callConnectionRef.current.on('error', (error) => {
        console.error('PeerJS Error:', error)
      })
    }
  }, [currentCallingUserID])

  function callUser(peerUserID: string) {
    let call
    if (localStream.current) {
      call = callConnectionRef.current?.call(peerUserID, localStream.current)
    } else {
      console.error('localStream is null or undefined')
    }

    if (call) {
      call.on('stream', (userVideoStream) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = userVideoStream
        }
        const remoteVideoTrack = userVideoStream.getVideoTracks()[0]
        console.log('Remote Video Track Enabled:', remoteVideoTrack.enabled)
      })
    } else {
      console.error('Call object is undefined or not initialized.')
    }
  }
  useEffect(() => {
    if (hubConnection) {
      hubConnection.on('AgreeCallUser', (peerUserID) => {
        if (localStream.current && peerUserID && peerUserID !== peerID) {
          callUser(peerUserID)
        } else {
          console.warn('localStream.current or peerUserID is null')
        }
      })

      hubConnection.on('EndCallUser', () => navigatorPage(path.dashbroad))
    }
  }, [hubConnection, localStream.current, peerID])

  const toggleVoice = () => {
    setVoiceOn(!voiceOn)
  }
  const hanldeEndCall = () => {
    hubConnection?.invoke('EndCall', peerID)
    navigatorPage(path.dashbroad)
  }
  const toggleCamera = () => {
    setCameraOn((prev) => !prev)
    if (localStream.current instanceof MediaStream) {
      const videoTrack = localStream.current.getTracks().find((track) => track.kind === 'video')
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
      } else {
        console.error('Video track not found in localStream')
      }
    } else {
      console.error('localStream is not a MediaStream object')
    }
  }
  return (
    <div>
      <div className='w-full h-full overlay'>
        <video
          ref={myVideoRef}
          style={{ transform: 'scaleX(-1)' }}
          className='h-screen w-screen object-cover'
          src='https://www.dropbox.com/s/ve0apo59semvv70/example-video-1.mp4?raw=1'
          autoPlay
          playsInline
          muted={!voiceOn}
          loop
        >
          <track
            kind='captions'
            srcLang='en'
            src='/path/to/captions.vtt'
            default // Optional: Set this if the track should be enabled by default
          />
        </video>
        <div className='absolute bottom-0 w-full left-0 right-0  flex justify-between items-center'>
          <div className='w-1/3 flex items-center'>
            <div
              className='ml-7 mr-3 h-[50px] w-[50px] rounded-full'
              style={{
                backgroundImage:
                  'url(https://images-ssl.gotinder.com/64f36000f19a860100146abf/172x216_fbc202e1-6f64-473b-b7a3-4100761fcbac.jpg)',
                backgroundPosition: '50% 50%',
                backgroundSize: 'auto 125.581%'
              }}
            ></div>
            {/* <span className='text-3xl text-white'>Thanh Tra</span> */}
          </div>
          <div className='w-1/3 flex justify-center items-center'>
            {voiceOn ? (
              /* button off voice */
              <button className='px-8' onClick={toggleVoice}>
                <svg
                  className='h-12 hover:scale-110'
                  fill='#ffffff'
                  version='1.1'
                  xmlns='http://www.w3.org/2000/svg'
                  xmlnsXlink='http://www.w3.org/1999/xlink'
                  viewBox='0 0 492.308 492.308'
                  xmlSpace='preserve'
                  stroke='#ffffff'
                  strokeWidth='14.76924'
                >
                  <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
                  <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g>
                  <g id='SVGRepo_iconCarrier'>
                    <g>
                      <g>
                        <path d='M398.534,141.25v79.298c0,45.077-18.644,88.106-51.144,118.048c-31.231,28.76-71.663,42.769-113.827,39.231 c-78.385-6.433-139.789-73.144-139.789-151.865V141.25H74.082v84.712c0,88.894,69.346,164.221,157.865,171.5 c1.461,0.12,2.908,0.096,4.365,0.179v74.975h-89.644v19.692h198.981v-19.692h-89.644v-75.019 c38.858-2.221,75.401-17.505,104.731-44.519c36.538-33.654,57.49-81.962,57.49-132.529V141.25H398.534z'></path>
                      </g>
                    </g>
                    <g>
                      <g>
                        <path d='M246.159,0c-61.596,0-111.712,50.115-111.712,111.712v114.25c0,61.596,50.115,111.712,111.712,111.712 S357.87,287.558,357.87,225.962v-114.25C357.87,50.115,307.755,0,246.159,0z M338.178,225.962 c0,50.74-41.279,92.019-92.019,92.019c-50.74,0-92.019-41.279-92.019-92.019V183.75h45.615v-19.692h-45.615v-27.26h45.615v-19.692 h-45.615v-5.394c0-50.74,41.279-92.019,92.019-92.019c50.74,0,92.019,41.279,92.019,92.019V225.962z'></path>
                      </g>
                    </g>
                  </g>
                </svg>
              </button>
            ) : (
              /* button voice */
              <button className='px-8' onClick={toggleVoice}>
                <svg
                  fill='#ffffff'
                  className='h-12 hover:scale-110'
                  version='1.1'
                  xmlns='http://www.w3.org/2000/svg'
                  xmlnsXlink='http://www.w3.org/1999/xlink'
                  viewBox='0 0 492.308 492.308'
                  xmlSpace='preserve'
                  stroke='#ffffff'
                  strokeWidth='14.76924'
                >
                  <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
                  <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g>
                  <g id='SVGRepo_iconCarrier'>
                    <g>
                      <g>
                        <path d='M398.539,220.543c0,45.077-18.644,88.101-51.144,118.039c-31.221,28.774-71.596,42.721-113.837,39.245 c-28.474-2.34-54.648-12.71-76.511-28.642l29.136-29.136c17.349,11.097,37.894,17.62,59.972,17.62 c61.596,0,111.712-50.115,111.712-111.712v-77.591L489.423,16.808L475.5,2.885L357.865,120.519v-8.813 C357.865,50.111,307.75,0,246.154,0S134.442,50.111,134.442,111.707v114.25c0,32.392,13.944,61.519,36.044,81.942l-28.631,28.631 c-29.569-27.983-48.086-67.435-48.086-110.573v-88.644H74.077v88.644c0,48.51,20.748,92.88,53.895,124.456L2.885,475.5 l13.923,13.923l126.124-126.124c25.189,19.066,55.742,31.419,89.01,34.153c1.461,0.12,2.908,0.097,4.365,0.18v74.983h-89.644 v19.692h198.981v-19.692H256v-75.023c38.866-2.221,75.41-17.502,104.74-44.525c36.538-33.659,57.49-81.962,57.49-132.524v-83.231 h-19.692V220.543z M338.173,225.957c0,50.74-41.279,92.019-92.019,92.019c-16.623,0-32.188-4.496-45.661-12.238l137.68-137.68 V225.957z M154.135,225.957V183.75h45.615v-19.692h-45.615v-27.26h45.615v-19.692h-45.615v-5.399 c0-50.736,41.279-92.014,92.019-92.014c50.74,0,92.019,41.279,92.019,92.014v28.505l-153.77,153.77 C165.864,277.136,154.135,252.921,154.135,225.957z'></path>
                      </g>
                    </g>
                  </g>
                </svg>
              </button>
            )}

            {cameraOn /* Camera on  */ ? (
              <button className='px-8' onClick={toggleCamera}>
                <svg
                  className='h-14 hover:scale-110'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                  stroke='#ffffff'
                >
                  <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
                  <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g>
                  <g id='SVGRepo_iconCarrier'>
                    {' '}
                    <path
                      d='M16.8772 15L21 17C21 17 21.5 15 21.5 12C21.5 9 21 7 21 7L16.8772 9M16.8772 15C16.9538 14.0994 17 13.0728 17 12C17 10.9272 16.9538 9.9006 16.8772 9M16.8772 15C16.7318 16.7111 16.477 17.9674 16.2222 18.2222C15.8333 18.6111 13.1111 19 10 19C6.88889 19 4.16667 18.6111 3.77778 18.2222C3.38889 17.8333 3 15.1111 3 12C3 8.88889 3.38889 6.16667 3.77778 5.77778C4.16667 5.38889 6.88889 5 10 5C13.1111 5 15.8333 5.38889 16.2222 5.77778C16.477 6.03256 16.7318 7.28891 16.8772 9'
                      stroke='#ffffff'
                      strokeWidth='1.5'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    ></path>{' '}
                  </g>
                </svg>
              </button>
            ) : (
              /* Camera off  */
              <button className='px-8' onClick={toggleCamera}>
                <svg
                  className='h-14 hover:scale-110'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
                  <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g>
                  <g id='SVGRepo_iconCarrier'>
                    <path
                      d='M16.8772 9L21 7C21 7 21.5 9 21.5 12C21.5 15 21 17 21 17M16.8772 9C16.7318 7.28891 16.477 6.03256 16.2222 5.77778C15.8333 5.38889 13.1111 5 10 5M16.8772 9C16.9538 9.9006 17 10.9272 17 12M3 3L21 21M3.22627 8C3.08981 9.09966 3 10.5049 3 12C3 15.1111 3.38889 17.8333 3.77778 18.2222C4.16667 18.6111 6.88889 19 10 19C11.4951 19 12.9003 18.9102 14 18.7737'
                      stroke='#ffffff'
                      strokeWidth='1.5'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    ></path>{' '}
                  </g>
                </svg>
              </button>
            )}
            {/* off call */}
            <button onClick={hanldeEndCall} className='px-8'>
              <svg
                className='h-[50px] hover:scale-110'
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
                <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g>
                <g id='SVGRepo_iconCarrier'>
                  <path
                    d='M16 6.07026C18.3912 7.45349 20 10.0389 20 13C20 17.4183 16.4183 21 12 21C7.58172 21 4 17.4183 4 13C4 10.0389 5.60879 7.45349 8 6.07026M12 3V13'
                    stroke='#ffffff'
                    strokeWidth='2'
                    strokeLinecap='round'
                  ></path>
                </g>
              </svg>
            </button>
          </div>
          <div className='w-1/3 flex justify-end'>
            <div className=' w-2/3'>
              <video
                style={{ transform: 'scaleX(-1)' }}
                ref={remoteVideoRef}
                src='https://www.dropbox.com/s/se8r4svvnt2qpfu/example-video-2.mp4?raw=1'
                autoPlay
                playsInline
                muted
                loop
              ></video>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
