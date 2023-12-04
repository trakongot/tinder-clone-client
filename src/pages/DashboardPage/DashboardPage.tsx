import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'
import userApi from 'src/apis/user.api'
import NavDashboard from 'src/components/NavDashboard'
import { setProfile } from 'src/redux/slices/userProfile.slice'
import { RootState } from 'src/redux/store'
import * as signalR from '@microsoft/signalr'
import { setSignalRHub } from 'src/redux/slices/signalRHub.slice'

export default function DashboardPage() {
  const dispatch = useDispatch()
  const userID = useSelector((state: RootState) => state.user.profile?.id)
  const isSignalRHubUrlInitialized = useSelector((state: RootState) => state.signalRHub.isSignalRHubUrlInitialized)

  const signalRHubRef = useRef<signalR.HubConnection | null>(null)

  useEffect(() => {
    if (!isSignalRHubUrlInitialized) {
      signalRHubRef.current = new signalR.HubConnectionBuilder()
        .withUrl('https://localhost:7251/chatHub')
        .configureLogging(signalR.LogLevel.Information)
        .build()
      signalRHubRef.current
        .start()
        .then(() => {
          signalRHubRef.current?.invoke('InitConnect', userID)
          console.log('Khoi tao thanh cong')
        })
        .catch((err) => alert(err.toString()))
      signalRHubRef.current.on('Connect', (mess) => {
        console.log(mess)
      })
      dispatch(setSignalRHub(signalRHubRef.current))
    }
  }, [dispatch, isSignalRHubUrlInitialized, signalRHubRef])
  const { data, isSuccess } = useQuery({
    queryKey: ['infoUser', userID],
    queryFn: () => {
      if (userID) return userApi.getInfoUser(userID)
    },
    enabled: !!userID
  })
  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setProfile(data.data))
    }
  }, [dispatch, data, isSuccess])
  return (
    <div className='h-screen overflow-hidden grid grid-cols-12 relative'>
      <div className='w-full h-full col-span-3'>
        <NavDashboard></NavDashboard>
      </div>
      <div
        className='w-full h-full col-span-9 relative overflow-hidden flex justify-center items-center'
        style={{
          boxShadow: '0 0 5px 0 #0000001f'
        }}
      >
        <Outlet></Outlet>
      </div>
    </div>
  )
}
