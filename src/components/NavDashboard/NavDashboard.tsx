import classNames from 'classnames'
import MatchedList from '../MatchedList'
import MessageList from '../MessageList'
import SettingList from '../SettingList'
import { useContext } from 'react'
import { AppContext } from 'src/contexts/app.contexts'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import path from 'src/constants/path'
import { useSelector } from 'react-redux'
import { resetSettingsChangedFlag } from 'src/redux/slices/settings.slice'
import { RootState } from 'src/redux/store'
import { QueryClient, useMutation } from '@tanstack/react-query'
import settingApi from 'src/apis/setting.api'
export default function NavDashboard() {
  const { isProfileActive, isMsgListActive, setIsMsgListActive, setIsProfileActive, setIsEditProfileActive } =
    useContext(AppContext)
  const urlAvatarUser = useSelector((state: RootState) => state.user.profile?.photos?.[0])
  const fullnameUser = useSelector((state: RootState) => state.user.profile?.fullName)
  const { settings, isSettingsChanged } = useSelector((state: RootState) => state.settings)
  const queryClient = new QueryClient()
  const updateSettingMutation = useMutation({
    mutationFn: settingApi.updateSettingUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] })
    }
  })
  const navigate = useNavigate()

  const location = useLocation()
  const navigateToProfile = () => {
    setIsProfileActive(!isProfileActive)
    navigate(path.profile)
  }
  const hanldeExitEditSetting = () => {
    resetSettingsChangedFlag()
    if (isSettingsChanged) updateSettingMutation.mutate(settings)
    navigateToMatched()
  }

  const navigateToMatched = () => {
    if (location.pathname === path.editProfile) {
      setIsEditProfileActive(false)
      navigate(path.profile)
    } else {
      setIsProfileActive(!isProfileActive)
      navigate(path.matched)
    }
  }
  return (
    <aside className='flex flex-col h-full border-gray-300 border-r'>
      <div
        style={{
          backgroundImage: 'linear-gradient(to top right, #fd267a, #ff6036)'
        }}
        className='h-[87px] px-3 flex items-center justify-between'
      >
        <div className='flex items-center flex-1'>
          {!isProfileActive ? (
            <button
              onClick={navigateToProfile}
              className='flex justify-center px-[3px] py-[3px] rounded-full my-1  hover:bg-[#702024] transition-all'
            >
              <div
                style={{
                  backgroundImage: `url(${urlAvatarUser})`,
                  backgroundPosition: '50% 50%',
                  backgroundSize: 'auto 125.581%'
                }}
                className='avatar h-9 w-9 rounded-full'
              ></div>
              <p className='mr-2  leading-9 w-[4.7rem] font-bold text-white text-base line-clamp-1'>{fullnameUser}</p>
            </button>
          ) : (
            <button
              onClick={hanldeExitEditSetting}
              className='flex justify-center items-center h-9 w-9 rounded-full my-1 ml-1 cursor-pointer hover:scale-110 bg-[#702024] transition-all'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                focusable='false'
                aria-hidden='true'
                className='h-6 w-6'
              >
                <g fill='#de4781'>
                  <path
                    fillRule='evenodd'
                    d='M7.8 9.685c4.7-1.582 5.5-5.703 4.9-9.492 0-.137.12-.234.24-.176 4.5 2.13 9.56 6.797 9.56 13.828C22.5 19.235 18.22 24 12 24 5.36 24 1.5 19.371 1.5 13.845c0-3.223 2.34-6.543 4.86-7.95.12-.077.28 0 .28.138.06.722.26 2.558 1.08 3.632.02.02.06.02.08.02Z'
                    clipRule='evenodd'
                  ></path>
                </g>
              </svg>
            </button>
          )}
        </div>
        <div className='flex items-center justify-end'>
          <Link
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.56)'
            }}
            to={'#'}
            className='ml-3 flex items-center justify-center w-10 h-10 rounded-full'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              focusable='false'
              aria-hidden='true'
            >
              <g fill='white'>
                <path d='M0 3a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V3Z'></path>
                <path d='M11 3a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v6.755A7.966 7.966 0 0 0 15 8c-1.457 0-2.823.39-4 1.07V3Z'></path>
                <path d='M0 14a1 1 0 0 1 1-1h6.581A7.977 7.977 0 0 0 7 16c0 2.011.742 3.849 1.967 5.254A1 1 0 0 1 8 22H1a1 1 0 0 1-1-1v-7Z'></path>
                <path
                  fillRule='evenodd'
                  d='M20.588 18.19a6 6 0 1 0-1.033 1.715l2.89 1.927a1 1 0 0 0 1.11-1.664l-2.967-1.978ZM15 20a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z'
                  clipRule='evenodd'
                ></path>
              </g>
            </svg>
          </Link>
          <button
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.56)'
            }}
            className='ml-3 flex items-center justify-center w-10 h-10 rounded-full'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              focusable='false'
              aria-hidden='true'
            >
              <g fill='white'>
                <path
                  fillRule='evenodd'
                  d='M16.995 4.37A2.37 2.37 0 0 0 14.625 2h-5.25a2.37 2.37 0 0 0-2.37 2.37v1.635H7v14.99h10V6.005h-.005V4.37Zm-7.62-.375A.375.375 0 0 0 9 4.37v1.635h6V4.37a.375.375 0 0 0-.375-.375h-5.25Z'
                  clipRule='evenodd'
                ></path>
                <path d='M19 6.005v14.99h3.495a1.5 1.5 0 0 0 1.5-1.5V7.505a1.5 1.5 0 0 0-1.5-1.5H19Z'></path>
                <path d='M5 20.995V6.005H1.505C.677 6.005 0 6.677 0 7.505v11.99c0 .828.677 1.5 1.505 1.5H5Z'></path>
              </g>
            </svg>
          </button>
          <button
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.56)'
            }}
            className='ml-3 flex items-center justify-center w-10 h-10 rounded-full'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              focusable='false'
              aria-hidden='true'
            >
              <g fill='white'>
                <path
                  fillRule='evenodd'
                  d='M4.489 3.663c-1.893 0-3.005-.733-3.005-.733S-1.52 15.268 12 24C25.52 15.268 22.516 2.93 22.516 2.93s-1.112.733-3.005.733C17.618 3.663 15.005 2.93 12 0 8.996 2.93 6.352 3.663 4.489 3.663Z'
                  clipRule='evenodd'
                ></path>
              </g>
            </svg>
          </button>
        </div>
      </div>
      <div className='relative flex flex-1 flex-col overflow-hidden'>
        <SettingList
          className={classNames(
            'absolute inset-0 z-20 h-full bg-[#f0f2f4] transition-all duration-300 overflow-x-hidden',
            {
              '-translate-x-full': !isProfileActive,
              'translate-x-0': isProfileActive
            }
          )}
        />
        <div className='px-5 pb-2 pt-3 flex items-center'>
          <div className='flex flex-col items-center'>
            <button
              onClick={() => {
                setIsMsgListActive(false)
              }}
              className='font-medium min-w-[100px]'
            >
              Matches
            </button>
            <div
              className={classNames('w-full bg-[#fd3864] h-[3px] rounded-full transition-all duration-300', {
                'transform translate-x-full': isMsgListActive
              })}
            />
          </div>
          <div className='flex flex-col items-center'>
            <button
              onClick={() => {
                setIsMsgListActive(true)
              }}
              className='font-medium mb-[3px] min-w-[100px]'
            >
              Messages
            </button>
          </div>
        </div>
        <div className='relative overflow-hidden flex-1 px-1 pt-4'>
          <MatchedList />
          <MessageList
            className={classNames('absolute top-0 h-full overflow-auto hide-scrollbar transition-all duration-300', {
              'translate-x-full': !isMsgListActive,
              'translate-x-0': isMsgListActive
            })}
          />
        </div>
      </div>
    </aside>
  )
}
