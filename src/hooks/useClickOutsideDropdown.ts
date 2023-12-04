import { useEffect, useRef, useState } from 'react'

interface Props {
  type?: 'dropdown' | 'dialog'
  dom?: string
  initialOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function useClickOutsideDropdown({
  dom = 'button',
  initialOpen = false,
  open: controlledOpen,
  onOpenChange: setControlledOpen
}: Props) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(initialOpen)
  const nodeRef = useRef<HTMLElement>(null)
  const open = controlledOpen ?? uncontrolledOpen
  const setOpen = setControlledOpen ?? setUncontrolledOpen
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (nodeRef.current) {
        if (!nodeRef.current.contains(e.target as Node) && !(e.target as Element).matches(dom)) {
          setOpen(false)
        }
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  })

  return {
    open,
    setOpen,
    nodeRef
  }
}
