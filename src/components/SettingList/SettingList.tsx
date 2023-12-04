import { useContext, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import SwitchInput from '../Form/SwitchInput'
import RangeSlider from '../Form/RangeSlider'
import SettingItem from './SettingItem'
import { AppContext } from 'src/contexts/app.contexts'
import classNames from 'classnames'
import { useClickOutsideDialog } from 'src/hooks/useClickOutsideDialog'
import { RootState } from 'src/redux/store'
import { useDispatch, useSelector } from 'react-redux'
import {
  setDistancePreference,
  setLatitude,
  setLongitude,
  setSettings,
  setMaxPrefenceAge,
  setMinPrefenceAge,
  setGobalMatch
} from 'src/redux/slices/settings.slice'
import RangeTwoSlider from '../Form/InputTwoSlider'
import { useQuery } from '@tanstack/react-query'
import settingApi from 'src/apis/setting.api'
import config from 'src/constants/config'

interface Props {
  className?: string
}
export default function SettingList({ className }: Readonly<Props>) {
  const { Reset } = useContext(AppContext)
  const { latitute, longtitute, ageMin, ageMax, distancePreference, email, globalMatches, phoneNumber } = useSelector(
    (state: RootState) => state.settings.settings
  )

  const dispatch = useDispatch()
  const [address, setAddress] = useState<string>('')
  const userID = useSelector((state: RootState) => state.user.profile?.id)
  const { data: settingsData, isSuccess: successSetting } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      if (userID) return await settingApi.getSettingUser(userID)
    }
  })
  useEffect(() => {
    if (settingsData?.data) {
      const settings = settingsData.data
      dispatch(setSettings(settings))
    }
  }, [dispatch, settingsData, successSetting])

  const updateLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        dispatch(setLatitude(position.coords.latitude))
        dispatch(setLongitude(position.coords.longitude))
      },
      (error) => {
        console.error('Error getting geolocation:', error)
      }
    )
  }
  useEffect(() => {
    if (longtitute && latitute) {
      const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${latitute}+${longtitute}&key=${config.geocodingKey}`
      fetch(apiUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
          }
          return response.json()
        })
        .then((data) => {
          const firstResult = data?.results[0]
          if (firstResult.formatted) {
            setAddress(firstResult.formatted)
          } else {
            console.error('Error: Invalid address data received.')
            setAddress('Invalid Address')
          }
        })
        .catch((error) => {
          console.error('Error fetching address:', error.message)
        })
    }
  }, [longtitute, latitute])

  // const [distanceRange, setDistanceRange] = useState<number>(16) // default 16km
  // const [minPrefenceAge, setMinPrefenceAge] = useState<number>(16) // default 16 year old
  // const [maxPrefenceAge, setMaxPrefenceAge] = useState<number>(100) // default 100 year old
  // const [applyDistanceRange, setApplyDistanceRange] = useState<boolean>(false)
  // const [applyPrefenceAge, setApplyPrefenceAge] = useState<boolean>(false)
  // const [gobalMatch, setGobalMatch] = useState<boolean>(false)
  const [showSliding, setShowSliding] = useState<boolean>(false)
  // const [latitude, setLatitude] = useState<number | null>(null)
  // const [longitude, setLongitude] = useState<number | null>(null)
  // const [lookFor, setLookFor] = useState(null)
  // const [distanceUnit, setDistanceUnit] = useState(null)
  // const [globalMatches, setGlobalMatches] = useState<boolean>(false)

  const slidingModelRef = useRef<HTMLDivElement>(null)
  useClickOutsideDialog({ dialogRef: slidingModelRef, setShow: setShowSliding })

  const handleLogout = async () => {
    await Reset()
    window.location.reload()
  }

  return (
    <>
      <div
        ref={slidingModelRef}
        className={classNames(
          'absolute inset-0 z-50 h-full bg-[#f0f2f4] overflow-auto hide-scrollbar transition-all duration-300',
          {
            'translate-x-full opacity-0': !showSliding,
            'translate-x-0 opacity-100': showSliding
          }
        )}
      >
        <div className='mt-8'>
          <button
            onClick={() => {
              // if (gender === false && setGender) setGender(true)
            }}
            className='flex w-full bg-white justify-between px-3 py-4 text-[#505965] group border-b border-[#d4d8de] border-solid border-t-0 border-r-0 border-l-0'
          >
            <div className='flex items-center'>
              <span className='group-hover:text-[#d6002f] '>Man</span>
            </div>
            {/* {gender === true && (
              <svg
                className='w-4 h-4 fill-[#505965] opacity-90 rotate-180 group-hover:fill-[#d6002f]'
                focusable='false'
                aria-hidden='true'
                viewBox='0 0 24 24'
              >
                <path d='M13.98 20.717a1.79 1.79 0 0 0 2.685 0 1.79 1.79 0 0 0 0-2.684l-7.158-6.62 7.158-6.8a1.79 1.79 0 0 0 0-2.684 1.79 1.79 0 0 0-2.684 0L5.929 9.98a1.79 1.79 0 0 0 0 2.684l8.052 8.052z'></path>
              </svg>
            )} */}
          </button>
          <button
            onClick={() => {
              // if (gender === true && setGender) setGender(false)
            }}
            className='flex w-full bg-white justify-between px-3 py-4 text-[#505965] group border-b border-[#d4d8de] border-solid border-t-0 border-r-0 border-l-0'
          >
            <div className='flex items-center'>
              <span className='group-hover:text-[#d6002f]'>Woman</span>
            </div>
            {/* {gender === false && (
              <svg
                className='w-4 h-4 fill-[#505965] opacity-90 rotate-180 group-hover:fill-[#d6002f]'
                focusable='false'
                aria-hidden='true'
                viewBox='0 0 24 24'
              >
                <path d='M13.98 20.717a1.79 1.79 0 0 0 2.685 0 1.79 1.79 0 0 0 0-2.684l-7.158-6.62 7.158-6.8a1.79 1.79 0 0 0 0-2.684 1.79 1.79 0 0 0-2.684 0L5.929 9.98a1.79 1.79 0 0 0 0 2.684l8.052 8.052z'></path>
              </svg>
            )} */}
          </button>
          <button
            onClick={() => {
              // if (gender === true && setGender) setGender(false)
            }}
            className='flex w-full bg-white justify-between px-3 py-4 text-[#505965] group border-b border-[#d4d8de] border-solid border-t-0 border-r-0 border-l-0'
          >
            <div className='flex items-center'>
              <span className='group-hover:text-[#d6002f]'>Everyone</span>
            </div>
            {/* {gender === false && (
              <svg
                className='w-4 h-4 fill-[#505965] opacity-90 rotate-180 group-hover:fill-[#d6002f]'
                focusable='false'
                aria-hidden='true'
                viewBox='0 0 24 24'
              >
                <path d='M13.98 20.717a1.79 1.79 0 0 0 2.685 0 1.79 1.79 0 0 0 0-2.684l-7.158-6.62 7.158-6.8a1.79 1.79 0 0 0 0-2.684 1.79 1.79 0 0 0-2.684 0L5.929 9.98a1.79 1.79 0 0 0 0 2.684l8.052 8.052z'></path>
              </svg>
            )} */}
          </button>
          <div className='mt-6 text-sm text-left text-[#505965]  px-3 '>You will only see women in discovery.</div>
        </div>
      </div>
      <div
        className={`${className} flex flex-col overflow-x-hidden items-center h-full overflow-y-auto hide-scrollbar`}
      >
        <div className='w-[90%] bg-white rounded-lg shadow-md px-3 py-4 mt-5'>
          <Link to={'#'}>
            <div className='flex justify-center'>
              <svg className='w-[144px] h-[24px]' viewBox='0 0 141 24' xmlns='http://www.w3.org/2000/svg'>
                <title>Tinder Platinum</title>
                <g fillRule='nonzero' fill='none'>
                  <path
                    d='M5.1 8.07C8.903 6.752 9.552 3.318 9.065 0.161c0-.114.097-.196.195-.146C12.903 1.788 17 5.678 17 11.537 17 16.029 13.535 20 8.5 20 3.125 20 0 16.142 0 11.537c0-2.685 1.893-5.452 3.934-6.623.097-.066.227 0 .227.113.048.602.21 2.132.874 3.027.016.016.049.016.064.016z'
                    className='fill-[#24282e]'
                    transform='translate(2 2)'
                  />
                  <path
                    d='M89.31 6.26c.198-.695.946-1.26 1.67-1.26h45.019c.724 0 1.15.566.953 1.26l-3.262 11.478c-.198.697-.947 1.262-1.67 1.262H87.003c-.725 0-1.15-.567-.954-1.262l3.263-11.477z'
                    className='fill-[#24282e]'
                    transform='translate(2 2)'
                  />
                  <path
                    d='M63.978 2.577v19.11h-3.394v-1.45C59.504 21.363 58.067 22 56.554 22c-3.699 0-6.184-2.938-6.184-7.31 0-4.383 2.485-7.327 6.184-7.327 1.522 0 2.958.643 4.03 1.785v-6.57h3.394zm7.766 4.786c4.006 0 6.803 3.121 6.803 7.592v.94H68.29c.339 1.964 1.865 3.217 3.959 3.217 1.326 0 2.777-.568 3.612-1.413l.208-.21 1.607 2.349-.15.145C76.19 21.283 74.213 22 71.956 22c-4.256 0-7.228-3.012-7.228-7.327.018-4.168 3.034-7.31 7.016-7.31zM27.596 3.997v3.68h2.692v3.068H27.58v6.816c0 .313.074 1.337 1.028 1.337.48 0 .938-.2 1.104-.393l.287-.336.862 2.784-.112.105c-.647.614-1.62.925-2.892.925h-.046c-1.143 0-2.038-.315-2.657-.936-.632-.634-.952-1.563-.952-2.76v-7.542H22V7.676h2.202v-3.68h3.394zm7.813 3.696V21.67h-3.396V7.692h3.394l.002.001zm9.497-.33c2.935 0 4.551 1.623 4.551 4.57v9.737h-3.393v-8.927h.01c-.068-1.585-.824-2.294-2.424-2.294-1.43 0-2.594.874-3.182 1.65v9.571h-3.394V7.692h3.394V9.17c.982-.94 2.547-1.806 4.438-1.806zm42.093.017v3.453l-.292-.059a4.451 4.451 0 00-.866-.078c-1.095 0-2.614.774-3.181 1.61v9.347h-3.394V7.693h3.41v1.563c1.123-1.186 2.607-1.877 4.08-1.877H87zm-29.612 3.068c-2.098 0-3.508 1.705-3.508 4.241 0 2.527 1.41 4.225 3.508 4.225 1.223 0 2.554-.674 3.198-1.61v-5.21c-.672-.957-2.003-1.645-3.199-1.645l.001-.001zm14.358-.198c-2.383 0-3.285 1.82-3.477 3.07h6.97c-.192-2.106-1.916-3.07-3.492-3.07h-.001zM33.694 2c1.125 0 2.04.925 2.04 2.062 0 1.138-.915 2.064-2.04 2.064-1.124 0-2.04-.926-2.04-2.064 0-1.117.935-2.062 2.04-2.062z'
                    className='fill-[#24282e]'
                  ></path>
                  <path
                    d='M95.153 16.894v-2.112h1.38c1.17 0 1.82-.857 1.82-1.882 0-1.034-.642-1.9-1.82-1.9H94v5.894h1.153zm1.226-3.19h-1.226v-1.626h1.226c.455 0 .796.327.796.813 0 .495-.341.813-.796.813zm6.13 3.19v-1.105h-2.29V11h-1.152v5.894h3.443zm1.495 0l.34-1.016h2.42l.342 1.016h1.258L106.277 11h-1.445l-2.095 5.894h1.267zm2.444-2.103h-1.795l.902-2.704.893 2.704zm4.312 2.103v-4.79h1.575V11h-4.32v1.105h1.583v4.789h1.162zm3.467 0V11h-1.153v5.894h1.153zm2.225 0v-3.959l2.582 3.959h1.112V11h-1.153v3.817L116.484 11H115.3v5.894h1.153zm7.194.106c1.64 0 2.411-.999 2.411-2.465V11h-1.169v3.5c0 .821-.414 1.387-1.242 1.387-.845 0-1.259-.566-1.259-1.388V11h-1.169v3.543c0 1.45.771 2.457 2.428 2.457zm4.636-.106v-4.242l1.527 4.242h.503l1.527-4.242v4.242H133V11h-1.624l-1.315 3.676L128.745 11h-1.616v5.894h1.153z'
                    className='fill-white'
                  />
                </g>
              </svg>
              <sub className='text-sm text-[#505965] '>™</sub>
            </div>
            <p className='text-[#505965] text-sm mt-1 mb-2'>Level up every action you take on Tinder</p>
          </Link>
        </div>
        <div className='w-[90%] bg-white rounded-lg shadow-md px-3 py-4 mt-5'>
          <Link to='#'>
            <div className='flex justify-center'>
              <svg className='w-[120px] h-[24px]' viewBox='0 0 120 24' xmlns='http://www.w3.org/2000/svg'>
                <title>Tinder Gold</title>
                <g fillRule='nonzero' fill='none'>
                  <path
                    d='M5.027 7.858C8.775 6.574 9.414 3.23 8.934.157c0-.112.096-.19.193-.143 3.589 1.727 7.625 5.514 7.625 11.218 0 4.374-3.414 8.24-8.376 8.24C3.08 19.472 0 15.717 0 11.232c0-2.614 1.866-5.308 3.877-6.448.097-.064.223 0 .223.11.049.587.208 2.076.862 2.948.016.016.049.016.065.016zm82.84-1.27c.194-.672.922-1.218 1.625-1.218h25.005c.706 0 1.12.547.928 1.218l-3.176 11.086c-.193.672-.92 1.218-1.624 1.218H85.62c-.706 0-1.12-.546-.928-1.218l3.176-11.086z'
                    className='fill-[#eab72c]'
                    transform='translate(2 2)'
                  />
                  <path
                    d='M29.595 17.679l.282-.318.85 2.643-.111.102c-.637.583-1.595.878-2.847.878h-.046c-1.127 0-2.007-.298-2.617-.888-.622-.601-.936-1.485-.936-2.623V10.31H22V7.392h2.169V3.896h3.34v3.498h2.65v2.915h-2.666v6.474c0 .298.073 1.27 1.012 1.27.473 0 .924-.19 1.087-.374h.003zm2.267 3.008V7.41h3.341v13.277h-3.341zM33.516 2c1.108 0 2.009.879 2.009 1.96 0 1.082-.9 1.96-2.009 1.96-1.107 0-2.008-.878-2.008-1.96 0-1.06.92-1.958 2.008-1.958V2zm11.04 5.095c2.888 0 4.48 1.542 4.48 4.342v9.249h-3.342v-8.48h.011c-.068-1.504-.813-2.18-2.388-2.18-1.406 0-2.552.831-3.132 1.567v9.094h-3.342V7.408h3.342V8.81c.967-.893 2.509-1.715 4.37-1.715v.001zM59.99 8.792V2.55h3.342v18.152h-3.342v-1.378A5.577 5.577 0 0156.024 21c-3.642 0-6.088-2.79-6.088-6.944 0-4.163 2.446-6.96 6.088-6.96 1.498 0 2.911.611 3.967 1.696zm0 2.797c-.66-.908-1.97-1.562-3.148-1.562-2.065 0-3.454 1.62-3.454 4.029 0 2.4 1.389 4.012 3.454 4.012 1.204 0 2.514-.64 3.148-1.529v-4.95zM70.98 7.096c3.944 0 6.7 2.965 6.7 7.21v.895H67.577c.333 1.865 1.836 3.057 3.898 3.057 1.304 0 2.733-.54 3.557-1.343l.204-.2 1.582 2.23-.146.139c-1.316 1.235-3.263 1.915-5.486 1.915-4.19 0-7.117-2.861-7.117-6.96.016-3.959 2.987-6.944 6.908-6.944l.002.001zm-3.423 5.66h6.862c-.19-2.003-1.886-2.917-3.44-2.917-2.346 0-3.233 1.726-3.422 2.915v.001zM85.76 7.111H86v3.28l-.288-.055a4.483 4.483 0 00-.852-.074c-1.078 0-2.574.734-3.133 1.527v8.88h-3.341V7.41h3.357v1.484c1.106-1.126 2.568-1.783 4.017-1.783v.001z'
                    className='fill-[#24282e]'
                  />
                  <path
                    d='M94.806 17c.956 0 1.708-.437 2.244-1.097v-2.22h-2.514v1.076h1.392v.694c-.214.216-.657.443-1.123.443-.957 0-1.652-.807-1.652-1.9 0-1.095.695-1.903 1.652-1.903.561 0 1.012.348 1.249.757l.933-.556c-.395-.684-1.083-1.292-2.18-1.292-1.541 0-2.807 1.163-2.807 2.994C92 15.82 93.266 17 94.807 17zm5.635-.01c-1.588 0-2.75-1.25-2.75-2.996 0-1.744 1.162-2.994 2.751-2.994 1.597 0 2.759 1.25 2.759 2.994 0 1.745-1.162 2.995-2.759 2.995l-.001.001zm0-1.095c.974 0 1.604-.824 1.604-1.9 0-1.086-.63-1.903-1.604-1.903-.972 0-1.596.817-1.596 1.902 0 1.077.624 1.902 1.596 1.902v-.001zm6.9.99V15.8h-2.229v-4.705h-1.122v5.79h3.352zm2.862 0h-2.08v-5.79h2.08c1.652 0 2.797 1.155 2.797 2.9 0 1.744-1.145 2.89-2.797 2.89zm0-1.085c1.043 0 1.652-.824 1.652-1.806 0-1.025-.57-1.814-1.652-1.814h-.957v3.62h.957z'
                    className='fill-white'
                  />
                </g>
              </svg>
              <sub className='text-sm text-[#505965] '>™</sub>
            </div>
            <p className='text-[#505965] text-sm mt-1 mb-2'>See Who Likes You & More!</p>
          </Link>
        </div>
        <div className='w-[90%] bg-white rounded-lg shadow-md px-3 py-4 mt-5'>
          <Link to='#'>
            <div className='flex justify-center'>
              <svg className='w-[120px] h-[24px]' viewBox='0 0 101 24' xmlns='http://www.w3.org/2000/svg'>
                <title>Tinder Plus</title>
                <g fillRule='nonzero' fill='none'>
                  <path
                    d='M5.156 8.095C8.946 6.788 9.591 3.387 9.108.258c0-.113.096-.193.192-.145 3.628 1.757 7.708 5.61 7.708 11.415 0 4.45-3.451 8.385-8.466 8.385-5.354 0-8.465-3.82-8.465-8.384 0-2.661 1.887-5.401 3.918-6.563.097-.064.226 0 .226.113.048.597.21 2.113.87 3 .016.016.048.016.064.016h.001z'
                    className='fill-[#fd267a]'
                    transform='translate(2 2)'
                  ></path>
                  <path
                    d='M29.698 18.226l.285-.328.852 2.72-.111.104c-.639.6-1.6.903-2.858.903h-.046c-1.13 0-2.013-.307-2.625-.913-.624-.62-.94-1.528-.94-2.698v-7.37h-2.178v-3h2.177V4.052h3.354v3.595h2.661v2.999h-2.677v6.659c0 .308.073 1.306 1.016 1.306.474 0 .927-.195 1.09-.385v.001zm2.277 3.092V7.662h3.354v13.657h-3.354zM33.635 2.1c1.111 0 2.015.904 2.015 2.015a2.017 2.017 0 01-2.015 2.016 2.017 2.017 0 01-2.016-2.016c0-1.092.923-2.015 2.016-2.015zm11.08 5.238c2.9 0 4.498 1.587 4.498 4.467v9.514H45.86v-8.723h.011c-.068-1.548-.815-2.241-2.396-2.241-1.412 0-2.562.853-3.145 1.613v9.352h-3.354V7.662h3.354v1.441c.971-.918 2.517-1.765 4.386-1.765zm15.496 1.747V2.662h3.354v18.672H60.21v-1.417c-1.068 1.102-2.488 1.723-3.983 1.723-3.656 0-6.112-2.87-6.112-7.143 0-4.282 2.457-7.16 6.112-7.16 1.504 0 2.924.63 3.984 1.747h-.001zm0 2.877c-.664-.935-1.98-1.608-3.162-1.608-2.073 0-3.466 1.665-3.466 4.144 0 2.47 1.392 4.128 3.467 4.128 1.208 0 2.523-.658 3.162-1.574v-5.09h-.001zM71.24 7.338c3.958 0 6.723 3.051 6.723 7.418v.92H67.827c.335 1.92 1.844 3.144 3.913 3.144 1.31 0 2.746-.555 3.572-1.38l.204-.205 1.587 2.294-.148.143c-1.319 1.27-3.273 1.97-5.504 1.97-4.206 0-7.143-2.944-7.143-7.159.017-4.073 2.997-7.143 6.934-7.143l-.002-.002zm-3.437 5.822h6.89c-.19-2.058-1.893-3-3.453-3-2.355 0-3.246 1.777-3.437 3zm18.272-5.805h.241v3.375l-.288-.058a4.433 4.433 0 00-.856-.077c-1.081 0-2.583.757-3.144 1.573v9.134h-3.354V7.662h3.37V9.19c1.11-1.158 2.578-1.835 4.031-1.835z'
                    className='fill-[#24282e]'
                  ></path>
                  <path
                    className='fill-[#fd267a]'
                    d='M97.475 13.462v-1.92h-4.349V6.803h-2.114v4.739h-4.374v1.92h4.374v4.932h2.114v-4.932'
                    transform='translate(2 2)'
                  ></path>
                </g>
              </svg>

              <sub className='text-sm text-[#505965] -translate-x-2'>®</sub>
            </div>
            <p className='text-[#505965] text-sm mt-1 mb-2'>See Who Likes You & More!</p>
          </Link>
        </div>
        <div className='w-[90%] bg-white rounded-lg shadow-md px-3 py-4 mt-5'>
          <Link to='#'>
            <div className='flex justify-center'>
              <svg focusable='false' viewBox='0 0 24 24' className='w-6 h-6'>
                <path
                  d='M8.21 10.08c-.02 0-.04 0-.06-.02-.67-.9-.84-2.44-.89-3.03 0-.11-.13-.18-.23-.12C4.93 8.08 3 10.86 3 13.54 3 18.14 6.2 22 11.7 22c5.15 0 8.7-3.98 8.7-8.46 0-5.87-4.2-9.77-7.93-11.53a.13.13 0 0 0-.19.14c.48 3.16-.18 6.6-4.07 7.93z'
                  className='fill-[#fd267a]'
                  fillRule='nonzero'
                ></path>
              </svg>
              <p className='text-[#24282e]'>Upgrade Your Love Life</p>
            </div>
            <p className='text-[#505965] text-sm mt-1 mb-2'>Subscribe to Tinder for premium features</p>
          </Link>
        </div>
        <div className='mt-3 w-[90%] flex justify-between'>
          <div className='relative w-[45%] bg-white rounded-lg shadow-md py-4 mt-5'>
            <svg
              className='h-10 w-10 p-2 rounded-full bg-white -translate-x-1/2 -translate-y-1/2 absolute top-0 left-1/2'
              focusable='false'
              viewBox='0 0 24 24'
            >
              <path
                d='M15.979 14.018c.637-.638.51-1.275-.192-1.722l-1.275-.765c-.638-.383-1.148-1.275-.956-2.104L15.15 2.73c.191-.765-.128-.956-.765-.446L6.414 9.937c-.638.638-.51 1.275.19 1.722l1.276.765c.638.382 1.148 1.275.957 2.168l-1.658 6.632c-.191.829.191 1.02.765.446l8.035-7.652z'
                className='fill-[#A11AEB]'
              ></path>
            </svg>
            <div className='my-2'>
              <p className='text-[#21262E]'>0 remaining</p>
              <p className='text-[#A11AEB] text-sm font-light'>Get More Boosts</p>
            </div>
          </div>
          <div className='relative w-[45%] bg-white rounded-lg shadow-md px-3 py-4 mt-5'>
            <svg
              focusable='false'
              viewBox='0 0 24 24'
              className='h-10 w-10 p-2 rounded-full bg-white -translate-x-1/2 -translate-y-1/2 absolute top-0 left-1/2'
            >
              <path
                d='M21.06 9.06l-5.47-.66c-.15 0-.39-.25-.47-.41l-2.34-5.25c-.47-.99-1.17-.99-1.56 0L8.87 7.99c0 .16-.23.4-.47.4l-5.47.66c-1.01 0-1.25.83-.46 1.65l4.06 3.77c.15.16.23.5.15.66L5.6 20.87c-.16.98.4 1.48 1.33.82l4.69-2.79h.78l4.69 2.87c.78.58 1.56 0 1.25-.98l-1.02-5.75s0-.4.23-.57l3.91-3.86c.78-.82.78-1.64-.39-1.64v.08z'
                className='fill-[#106BD5]'
              ></path>
            </svg>
            <div className='my-2'>
              <p className='text-[#21262E]'>0 remaining</p>
              <p className='text-[#106BD5] text-sm font-light'>Get More Super Likes</p>
            </div>
          </div>
        </div>
        <div className='w-[90%] bg-white rounded-lg shadow-md px-3 py-4 mt-5'>
          <div className='flex justify-center'>
            <svg focusable='false' className='w-6 h-6'>
              <path d='m22 12-4.722 3.796a8.389 8.389 0 0 1-4.527 1.797 8.55 8.55 0 0 1-4.802-.986l1.995-1.403c.678.395 1.468.59 2.266.556a4.13 4.13 0 0 0 2.204-.74 3.736 3.736 0 0 0 1.375-1.777 3.494 3.494 0 0 0 .064-2.194l2.648-1.86L22 12Zm-1.7-5.25L4.3 18l-.6-.75 2.577-1.813L2 12.001l4.722-3.796c1.41-1.137 3.197-1.783 5.057-1.83 1.86-.046 3.68.51 5.154 1.576L19.702 6l.598.75ZM8.54 13.848l6.321-4.45a4.068 4.068 0 0 0-2.039-1.06 4.237 4.237 0 0 0-2.322.19 3.95 3.95 0 0 0-1.812 1.376 3.577 3.577 0 0 0-.683 2.09c.002.649.189 1.286.54 1.846l-.005.008Z'></path>
            </svg>
          </div>
          <p className='text-black text-sm mt-1 mb-2'>Go Incognito</p>
        </div>
        {/* ----------------------Account Settings------------------*/}
        <div className='w-full mt-3'>
          <h2 className='px-4 py-2 text-[#505965] text-left text-lg font-semibold'>Account Settings</h2>
          <div>
            <SettingItem type='Link' link='#' label='Manage Payment Account'></SettingItem>
            <SettingItem
              className='cursor-pointer'
              type='Div'
              link='#'
              label='Restore Purchases'
              icon={false}
            ></SettingItem>
            <SettingItem type='Link' link='#' label='Email' content={String(email ?? 'chưa có')}></SettingItem>
            <SettingItem
              type='Link'
              link='#'
              label='Phone Number'
              content={String(phoneNumber ?? 'chưa có')}
            ></SettingItem>
            <SettingItem type='Link' link='#' label='Connected Accounts'></SettingItem>
            <SettingItem className='cursor-pointer' type='Div' link='#' label='Promo Code' icon={false}></SettingItem>
          </div>
        </div>
        <h2 className='px-4 py-2 text-[#505965] text-left text-sm font-light'>
          Verified Phone Number and Email help secure your account.
        </h2>
        {/* ----------------------Discovery Settings------------------*/}
        <div className='w-full mt-3'>
          <h2 className='px-4 py-2 text-[#505965] text-left text-lg font-semibold'>Discovery Settings</h2>
          <div>
            <SettingItem
              key={address}
              onClick={updateLocation}
              type='Button'
              label='Location'
              content={address}
            ></SettingItem>
            <SettingItem type='Link' link='#' label='Distance Preference' content='Cổ Nhuế 2, Vietnam'>
              <p className='text-[#505965] line-clamp-1'>{distancePreference} km.</p>
            </SettingItem>
            <div className='flex items-center justify-between bg-white shadow-sm px-4 pt-4 pb-8 text-left border-[#bdbdbd] border-b-[0.5px]'>
              <RangeSlider
                value={Number(distancePreference)}
                setValue={(distance: number) => {
                  dispatch(setDistancePreference(Number(distance)))
                }}
              ></RangeSlider>
            </div>
            <div className='flex items-center justify-between bg-white shadow-sm px-4 py-4 text-left border-[#bdbdbd] border-b-[0.5px]'>
              <span className='text-[#21262E]'>Only show people in this range</span>
              <SwitchInput checked={true}></SwitchInput>
            </div>
            <SettingItem
              type='Button'
              onClick={() => setShowSliding(true)}
              label='Looking for'
              content='Female'
            ></SettingItem>
            <SettingItem type='Link' link='#' label='Age Preference' content='Female'>
              <p className='text-[#505965] line-clamp-1'>
                {ageMin} - {ageMax != null && ageMax < 100 ? ageMax : ageMax != null ? ageMax + '+' : 'N/A'}
              </p>
            </SettingItem>
            <div className='flex items-center justify-between bg-white shadow-sm px-4 pt-4 pb-8 text-left border-[#bdbdbd] border-b-[0.5px]'>
              <RangeTwoSlider
                minValue={Number(ageMin)}
                setMinValue={(age: number) => {
                  dispatch(setMinPrefenceAge(age))
                }}
                setMaxValue={(age: number) => {
                  dispatch(setMaxPrefenceAge(age))
                }}
                maxValue={Number(ageMax)}
                min={16}
                max={100}
                step={5}
                minRange={0}
                maxRange={100}
              ></RangeTwoSlider>
            </div>
            <div className='flex items-center justify-between bg-white shadow-sm px-4 py-4 text-left border-[#bdbdbd] border-b-[0.5px]'>
              <span className='text-[#21262E]'>Only show people in this range</span>
              <SwitchInput checked={true}></SwitchInput>
            </div>
            <div className='flex items-center justify-between bg-white shadow-sm px-4 py-4 text-left border-[#bdbdbd] border-b-[0.5px]'>
              <span className='text-[#21262E]'>Global</span>
              <SwitchInput
                checked={Boolean(globalMatches)}
                setChecked={(value: boolean) => {
                  dispatch(setGobalMatch(value ? 1 : 0))
                }}
              ></SwitchInput>
            </div>
            {Boolean(globalMatches) && (
              <div className='flex items-center justify-between bg-white shadow-sm px-4 py-4 text-left'>
                <span className='text-[#21262E]'>Preferred Languages</span>
                <p className='text-[#505965] line-clamp-1'>Every Languages</p>
              </div>
            )}
            <h2 className='px-4 py-2 text-[#505965] text-left text-sm font-light'>
              Going global will allow you to see people from around the world after you’ve run out of profiles nearby.
            </h2>
          </div>
        </div>
        {/* ---------------Control you see-------------- */}
        <div className='w-full mt-5'>
          <div className='px-4 py-3 text-[#505965] flex items-center justify-start border-[#bdbdbd] border-b-[0.5px]'>
            <h2 className='text-[#505965] text-left text-lg font-semibold'>Control Who You See</h2>
            <span className='bg-[#d6002f] rounded-full px-2 py-[5px] ml-2 text-xs text-white'>Tinder Plus®</span>
          </div>
          <Link
            className='flex items-center justify-between w-full bg-white shadow-sm px-4 py-4 text-left border-[#bdbdbd] border-b-[0.5px]'
            to={'#'}
          >
            <div>
              <span className='text-[#21262E] block text-base '>Balanced Recommendations</span>
              <span className='text-[#505965] block text-[0.8rem] font-light'>
                See the most relevant people to you (default)
              </span>
            </div>
            <div className='w-1/4 flex items-center justify-end'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                focusable='false'
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
            </div>
          </Link>
          <Link
            className='flex items-center justify-between w-full bg-white shadow-sm px-4 py-4 text-left border-[#bdbdbd] border-b-[0.5px]'
            to={'#'}
          >
            <div>
              <span className='text-[#21262E] block text-base'>Recently Active</span>
              <span className='text-[#505965] block text-[0.8rem] font-light'>
                See the most recently active people first
              </span>
            </div>
            <div className='w-1/4 flex items-center justify-end'>
              {/* <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            focusable='false'
            aria-hidden='true'
            role='presentation'
            className='fill-[#ff4458] h-5 w-5'
          >
            <g fill=''>
              <path
                fillRule='evenodd'
                d='M23.1 2.348a2.174 2.174 0 0 1 .358 3.198L8.925 22.061.63 13.745a2.161 2.161 0 0 1 3.06-3.053l5.018 5.031 11.484-13.05a2.174 2.174 0 0 1 2.907-.325Z'
                clipRule='evenodd'
              ></path>
            </g>
          </svg> */}
            </div>
          </Link>
        </div>
        {/* --------------Control My Visibility----------- */}
        <div className='w-full mt-5'>
          <div className='px-4 py-3 text-[#505965] flex items-center justify-start border-[#bdbdbd] border-b-[0.5px]'>
            <h2 className=' text-[#505965] text-left text-lg font-semibold'>Control My Visibility</h2>
          </div>
          <Link
            className='flex items-center justify-between w-full bg-white shadow-sm px-4 py-4 text-left border-[#bdbdbd] border-b-[0.5px]'
            to={'#'}
          >
            <div>
              <span className='text-[#21262E] block text-base '>Standard</span>
              <span className='text-[#505965] block text-[0.8rem] font-light'>
                You will be discoverable in the card stack
              </span>
            </div>
            <div className='w-1/4 flex items-center justify-end'>
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
            </div>
          </Link>
          <Link
            className='flex items-center justify-between w-full bg-white shadow-sm px-4 py-4 text-left border-[#bdbdbd] border-b-[0.5px]'
            to={'#'}
          >
            <div>
              <div>
                <span className='text-[#21262E] text-base'>Incognito</span>
                <span className='bg-[#d6002f] rounded-full px-2 py-[5px] ml-2 text-xs text-gray-200'>
                  Tinder Plus®
                </span>
              </div>
              <span className='text-[#505965] block text-[0.8rem] font-light'>
                You will be discoverable only by people you Like{' '}
              </span>
            </div>
            <div className='w-1/4 flex items-center justify-end'>
              {/* <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            focusable='false'
            aria-hidden='true'
            role='presentation'
            className='fill-[#ff4458] h-5 w-5'
          >
            <g fill=''>
              <path
                fillRule='evenodd'
                d='M23.1 2.348a2.174 2.174 0 0 1 .358 3.198L8.925 22.061.63 13.745a2.161 2.161 0 0 1 3.06-3.053l5.018 5.031 11.484-13.05a2.174 2.174 0 0 1 2.907-.325Z'
                clipRule='evenodd'
              ></path>
            </g>
          </svg> */}
            </div>
          </Link>
        </div>
        {/* -----------Enable Discovery------------ */}
        <div className='w-full mt-5'>
          <h2 className='px-4 py-3 text-[#505965] text-left text-lg font-semibold'>Enable Discovery</h2>
          <div>
            <Link
              className='flex items-center justify-between bg-white shadow-sm px-4 py-4 text-left border-[#bdbdbd] border-t-[0.5px] border-b-[0.5px]'
              to={'#'}
            >
              <span className='text-[#21262E]'>Enable Discovery</span>
              <div className='w-1/2 flex items-center justify-end'>
                <SwitchInput checked={false}></SwitchInput>
              </div>
            </Link>
            <h2 className='px-4 py-2 text-[#505965] text-left text-sm font-light'>
              When turned off, your profile will be hidden from the card stack and Discovery will be disabled. People
              you have already Liked may still see and match with you.
            </h2>
            <SettingItem type='Link' link='#' label='Block Contacts'>
              {' '}
              <svg className='w-4 h-4 rotate-180 ml-1' focusable='false' viewBox='0 0 24 24'>
                <path
                  className='fill-[#ff4458]'
                  d='M13.98 20.717a1.79 1.79 0 0 0 2.685 0 1.79 1.79 0 0 0 0-2.684l-7.158-6.62 7.158-6.8a1.79 1.79 0 0 0 0-2.684 1.79 1.79 0 0 0-2.684 0L5.929 9.98a1.79 1.79 0 0 0 0 2.684l8.052 8.052z'
                ></path>
              </svg>
            </SettingItem>
            <h2 className='px-4 py-2 text-[#505965] text-left text-sm font-light'>
              Select people from your contact list that you don’t want to see or be seen by on Tinder.
            </h2>
          </div>
        </div>
        {/* --------------------Web Profile ----------------*/}
        <div className='w-full mt-5'>
          <h2 className='px-4 py-3 text-[#505965] text-left text-lg font-semibold'>Web Profile</h2>
          <div>
            <SettingItem type='Link' link='#' label='Username' content='Claim Yours'></SettingItem>

            <h2 className='px-4 py-2 text-[#505965] text-left text-sm font-light'>
              Create a username. Share your username. Have people all over the world match with you right on Tinder.{' '}
            </h2>
          </div>
        </div>
        {/* ---------------------Read Receipts---------------- */}
        <div className='w-full mt-5'>
          <h2 className='px-4 py-3 text-[#505965] text-left text-lg font-semibold'>Read Receipts</h2>
          <div>
            <SettingItem type='Link' link='#' label='Manage Read Receipts'></SettingItem>
            <h2 className='px-4 py-2 text-[#505965] text-left text-sm font-light'>
              Create a username. Share your username. Have people all over the world match with you right on Tinder.{' '}
            </h2>
          </div>
        </div>
        {/* ---------------------Activity Status---------------- */}
        <div className='w-full mt-5'>
          <h2 className='px-4 py-3 text-[#505965] text-left text-lg font-semibold'>Activity Status</h2>
          <div>
            <SettingItem type='Link' link='#' label='Recently Active Status'></SettingItem>
          </div>
        </div>
        {/* ---------------------Notifications---------------- */}
        <div className='w-full mt-5'>
          <h2 className='px-4 py-3 text-[#505965] text-left text-lg font-semibold'>Notifications</h2>
          <div>
            <SettingItem type='Link' link='#' label='Email'></SettingItem>
            <SettingItem type='Link' link='#' label='Push Notifications'></SettingItem>
          </div>
        </div>
        {/* ----------------Dark Mode--------------- */}
        <div className='w-full mt-5'>
          <h2 className='px-4 py-3 text-[#505965] text-left text-lg font-semibold'>Dark Mode</h2>
          <div>
            <SettingItem type='Link' link='#' label='Use System Setting'>
              <div></div>
            </SettingItem>
            <SettingItem type='Link' link='#' label='Light Mode'>
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
            </SettingItem>
            <SettingItem type='Link' link='#' label='Dark Mode'>
              <div></div>
            </SettingItem>
          </div>
        </div>
        {/* ----------------Help & Support--------------- */}
        <div className='w-full mt-5'>
          <h2 className='px-4 py-3 text-[#505965] text-left text-lg font-semibold'>Help & Support</h2>
          <div>
            <SettingItem type='Link' link='#' label='Help & Support'>
              <svg
                focusable='false'
                viewBox='0 0 24 24'
                className='w-5 h-5 fill-[#505965]'
                aria-labelledby='0519b2d0dd38e129 be886e952a307724'
              >
                <path d='M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z'></path>
                <title id='0519b2d0dd38e129'>View</title>
                <desc id='be886e952a307724'>Help &amp; Support</desc>
              </svg>
            </SettingItem>
          </div>
        </div>
        {/* ----------------Help & Support--------------- */}
        <div className='w-full mt-5'>
          <h2 className='px-4 py-3 text-[#505965] text-left text-lg font-semibold'>Safety</h2>
          <div>
            <SettingItem type='Link' link='#' label='Community Guidelines'>
              <svg
                focusable='false'
                viewBox='0 0 24 24'
                className='w-5 h-5 fill-[#505965]'
                aria-labelledby='0519b2d0dd38e129 be886e952a307724'
              >
                <path d='M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z'></path>
                <title id='0519b2d0dd38e129'>View</title>
                <desc id='be886e952a307724'>Help &amp; Support</desc>
              </svg>
            </SettingItem>
            <SettingItem type='Link' link='#' label='Safety & Policy'>
              <svg
                focusable='false'
                viewBox='0 0 24 24'
                className='w-5 h-5 fill-[#505965]'
                aria-labelledby='0519b2d0dd38e129 be886e952a307724'
              >
                <path d='M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z'></path>
                <title id='0519b2d0dd38e129'>View</title>
                <desc id='be886e952a307724'>Help &amp; Support</desc>
              </svg>
            </SettingItem>
            <SettingItem type='Link' link='#' label='Safety Tips'>
              <svg
                focusable='false'
                viewBox='0 0 24 24'
                className='w-5 h-5 fill-[#505965]'
                aria-labelledby='0519b2d0dd38e129 be886e952a307724'
              >
                <path d='M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z'></path>
                <title id='0519b2d0dd38e129'>View</title>
                <desc id='be886e952a307724'>Help &amp; Support</desc>
              </svg>
            </SettingItem>
          </div>
        </div>
        {/* ----------------Legal--------------- */}
        <div className='w-full mt-5'>
          <h2 className='px-4 py-3 text-[#505965] text-left text-lg font-semibold'>Legal</h2>
          <div>
            <SettingItem type='Link' link='#' label='Privacy Settings'>
              <svg focusable='false' viewBox='0 0 24 24' className='w-5 h-5 fill-[#505965]'>
                <path d='M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z'></path>
                <title id='0519b2d0dd38e129'>View</title>
                <desc id='be886e952a307724'>Help &amp; Support</desc>
              </svg>
            </SettingItem>
            <SettingItem type='Link' link='#' label='Cookie Policy'>
              <svg
                focusable='false'
                viewBox='0 0 24 24'
                className='w-5 h-5 fill-[#505965]'
                aria-labelledby='0519b2d0dd38e129 be886e952a307724'
              >
                <path d='M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z'></path>
                <title id='0519b2d0dd38e129'>View</title>
                <desc id='be886e952a307724'>Help &amp; Support</desc>
              </svg>
            </SettingItem>
            <SettingItem type='Link' link='#' label='Privacy Policy'>
              <svg focusable='false' viewBox='0 0 24 24' className='w-5 h-5 fill-[#505965]'>
                <path d='M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z'></path>
                <title id='0519b2d0dd38e129'>View</title>
                <desc id='be886e952a307724'>Help &amp; Support</desc>
              </svg>
            </SettingItem>
            <SettingItem type='Link' link='#' label='Terms of Service'>
              <svg focusable='false' viewBox='0 0 24 24' className='w-5 h-5 fill-[#505965]'>
                <path d='M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z'></path>
                <title id='0519b2d0dd38e129'>View</title>
                <desc id='be886e952a307724'>Help &amp; Support</desc>
              </svg>
            </SettingItem>
          </div>
        </div>
        <button className='w-full bg-white mt-5 py-4'>Share Tinder</button>
        <button onClick={handleLogout} className='w-full bg-white mt-5 py-4'>
          Logout
        </button>
        <div className='w-full my-4'>
          <div className='flex justify-center'>
            <svg className='w-5 h-5 fill-[#ff4458]' focusable='false' viewBox='0 0 24 24'>
              <path
                d='M8.21 10.08c-.02 0-.04 0-.06-.02-.67-.9-.84-2.44-.89-3.03 0-.11-.13-.18-.23-.12C4.93 8.08 3 10.86 3 13.54 3 18.14 6.2 22 11.7 22c5.15 0 8.7-3.98 8.7-8.46 0-5.87-4.2-9.77-7.93-11.53a.13.13 0 0 0-.19.14c.48 3.16-.18 6.6-4.07 7.93z'
                fillRule='nonzero'
              ></path>
            </svg>
          </div>
          <span className='text-[#505965] w-full'>Version 4.40.0</span>
        </div>
        <button className='w-full bg-white mt-5 py-4 mb-10'>Delete Account</button>
      </div>
    </>
  )
}
