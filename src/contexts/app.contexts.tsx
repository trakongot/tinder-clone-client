import { createContext, useState, useMemo } from 'react'
import { clearLS } from 'src/utils/auth'
interface AppContextInterface {
  isMsgBoxActive: boolean
  setIsMsgBoxActive: React.Dispatch<React.SetStateAction<boolean>>
  isMsgListActive: boolean
  setIsMsgListActive: React.Dispatch<React.SetStateAction<boolean>>
  isProfileActive: boolean
  setIsProfileActive: React.Dispatch<React.SetStateAction<boolean>>
  isEditProfileActive: boolean
  setIsEditProfileActive: React.Dispatch<React.SetStateAction<boolean>>
  Reset: () => void
}

const initialAppContext: AppContextInterface = {
  isMsgBoxActive: false,
  setIsMsgBoxActive: () => null,
  isMsgListActive: false,
  setIsMsgListActive: () => null,
  isProfileActive: false,
  setIsProfileActive: () => null,
  isEditProfileActive: false,
  setIsEditProfileActive: () => null,
  Reset: () => null
}
export const AppContext = createContext<AppContextInterface>(initialAppContext)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isMsgBoxActive, setIsMsgBoxActive] = useState<boolean>(initialAppContext.isMsgBoxActive)
  const [isMsgListActive, setIsMsgListActive] = useState<boolean>(initialAppContext.isMsgListActive)
  const [isProfileActive, setIsProfileActive] = useState<boolean>(initialAppContext.isProfileActive)
  const [isEditProfileActive, setIsEditProfileActive] = useState<boolean>(initialAppContext.isEditProfileActive)
  const [currentChatUserId, setCurrentChatUserId] = useState<null | number>(null)

  const Reset = (): Promise<void> => {
    return new Promise<void>((resolve) => {
      clearLS()
      setIsMsgBoxActive(false)
      setIsMsgListActive(false)
      setIsProfileActive(false)
      setIsEditProfileActive(false)
      resolve()
    })
  }
  const appContextValue = useMemo(
    () => ({
      isMsgBoxActive,
      setIsMsgBoxActive,
      isMsgListActive,
      setIsMsgListActive,
      isProfileActive,
      setIsProfileActive,
      isEditProfileActive,
      setIsEditProfileActive,
      setCurrentChatUserId,
      currentChatUserId,
      Reset
    }),
    [isMsgBoxActive, isMsgListActive, currentChatUserId, isProfileActive, isEditProfileActive]
  )
  return <AppContext.Provider value={appContextValue}>{children}</AppContext.Provider>
}
