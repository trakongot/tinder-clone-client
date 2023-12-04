export const LocalStorageEventTarget = new EventTarget()
export const clearLS = () => {
  localStorage.removeItem('id')
  const clearLSEvent = new Event('clearLS')
  LocalStorageEventTarget.dispatchEvent(clearLSEvent)
}

export const getUserIDFromLS = () => {
  const result = localStorage.getItem('id')
  return result ? JSON.parse(result) : null
}

export const setUserIDToLS = (Id: string) => {
  localStorage.setItem('id', JSON.stringify(Id))
}
