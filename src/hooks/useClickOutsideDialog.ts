import { useEffect } from 'react'
interface Props {
  dialogRef: React.RefObject<HTMLDivElement>
  setShow: React.Dispatch<React.SetStateAction<boolean>>
}
export function useClickOutsideDialog({ dialogRef, setShow }: Props) {
  useEffect(() => {
    function useClickOutsideDialog(event: MouseEvent) {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        setShow(false)
      }
    }
    document.addEventListener('mousedown', useClickOutsideDialog)

    return () => {
      document.removeEventListener('mousedown', useClickOutsideDialog)
    }
  }, [dialogRef, setShow])
}
