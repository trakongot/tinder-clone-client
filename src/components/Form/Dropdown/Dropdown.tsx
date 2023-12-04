import React, { useEffect, useState } from 'react'
import { useClickOutside } from 'src/hooks/useClickOutsideDropdown'

interface Props {
  defaultOptionText?: string
  listOption: string[]
  className?: string
  classNameDropdown?: string
}

export default function Dropdown({
  defaultOptionText,
  listOption,
  className,
  classNameDropdown = 'absolute top-full left-0 w-full border border-solid border-gray-300 rounded shadow-md'
}: Props) {
  const { show, setShow, nodeRef } = useClickOutside({ dom: 'div' })
  const [optionText, setOptionText] = useState(defaultOptionText)

  const handleClick = () => {
    setShow(!show)
  }

  const handleSelect = (text: string) => {
    setShow(false)
    setOptionText(text)
  }

  useEffect(() => {
    if (defaultOptionText === '') {
      setOptionText(defaultOptionText)
    }
  }, [defaultOptionText])

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      handleClick()
    }
  }

  return (
    <div className='relative'>
      <div
        onClick={handleClick}
        onKeyDown={handleKeyPress}
        ref={nodeRef as React.MutableRefObject<HTMLDivElement>}
        className={`${className} 'flex items-center justify-between cursor-pointer'`}
        role='button'
        tabIndex={0}
      >
        <span>{optionText}</span>

        {show && (
          <div
            className={`transition-all ease-in-out duration-[1000ms] overflow-y-auto ${
              show ? 'max-h-300 opacity-100' : 'max-h-0 opacity-0'
            } ${classNameDropdown}`}
          >
            {listOption.map((value) => (
              <div
                className='pl-2 py-1 cursor-pointer hover:bg-gray-100'
                onClick={() => handleSelect(value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSelect(value)
                  }
                }}
                role='button'
                tabIndex={0}
                key={value}
              >
                {value}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
