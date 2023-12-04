import { useEffect, useContext, ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import path from './constants/path'
import Home from './pages/HomePage'
import MessageBox from './components/MessageBox'
import Profile from './components/Profile'
import EditProfile from './components/EditProfile'
import { AppContext } from './contexts/app.contexts'
import DashboardPage from './pages/DashboardPage'
import CallBox from './components/CallBox/CallBox'
import CardBox from './components/CardBox'
import NotFound from './pages/NotFound'
import { RootState } from './redux/store'
import { useSelector } from 'react-redux'
interface ProtectedRouteProps {
  children: ReactNode
}
interface RejectedRouteProps {
  children: ReactNode
}
function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useSelector((state: RootState) => state.user.profile?.id)
  return isAuthenticated ? children : <Navigate to={path.home} />
}

function RejectedRoute({ children }: RejectedRouteProps) {
  const isAuthenticated = useSelector((state: RootState) => state.user.profile?.id)
  return !isAuthenticated ? children : <Navigate to={path.dashbroad} />
}

function App() {
  const { setIsProfileActive, setIsEditProfileActive, setIsMsgBoxActive, setIsMsgListActive } = useContext(AppContext)

  useEffect(() => {
    if (location.pathname === path.editProfile) {
      setIsEditProfileActive(true)
      setIsProfileActive(true)
    } else if (location.pathname === path.chat) {
      setIsMsgBoxActive(true)
      setIsMsgListActive(true)
    } else if (location.pathname === path.profile) {
      setIsProfileActive(true)
      setIsEditProfileActive(false)
    }
  }, [setIsEditProfileActive, setIsMsgBoxActive, setIsProfileActive, setIsMsgListActive])

  return (
    <Routes>
      <Route
        path={path.dashbroad}
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      >
        <Route path={path.profile} element={<Profile />} />
        <Route path={path.editProfile} element={<EditProfile />} />
        <Route index path={path.matched} element={<CardBox />} />
        <Route path={path.chat + '/:username'} element={<MessageBox />} />
        <Route path={path.newChat + '/:username'} element={<MessageBox isNewChat={true} />} />
      </Route>
      <Route path={path.call + '/:currentCallingUserID'} element={<CallBox />} />

      <Route
        path={path.home}
        element={
          <RejectedRoute>
            <Home />
          </RejectedRoute>
        }
      />

      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App
