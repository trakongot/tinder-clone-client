import classNames from 'classnames'
import React from 'react'
import { Link } from 'react-router-dom'
interface PropsSettingItem {
  className?: string
  type: 'Link' | 'Div' | 'Button'
  children?: React.ReactNode
  link?: string
  label?: string
  content?: string
  icon?: boolean
  onClick?: () => void
}
interface PropsWrap {
  type: 'Link' | 'Div' | 'Button'
  link?: string
  children: React.ReactNode
  className: string
  onClick?: () => void
}
export default function SettingItem({
  type,
  children,
  link,
  content,
  label,
  icon = true,
  className,
  onClick
}: Readonly<PropsSettingItem>) {
  return (
    <Wrap
      onClick={onClick}
      className={`${className} w-full group transition-all duration-500 flex items-center justify-between bg-white shadow-sm px-4 py-4 text-left border-[#bdbdbd] border-b-[0.5px]`}
      type={type}
      link={link}
    >
      <span className='text-[#353941]'>{label}</span>
      <div className={classNames({ 'w-1/2': content }, 'flex items-center justify-end')}>
        {children ?? (
          <>
            <p className='text-[#505965] line-clamp-1 group-hover:text-[#d6002f]'>{content}</p>
            {icon && (
              <svg className='w-4 h-4 rotate-180 ml-1' focusable='false' aria-hidden='true' viewBox='0 0 24 24'>
                <path
                  className='fill-[#505965] group-hover:fill-[#d6002f]'
                  d='M13.98 20.717a1.79 1.79 0 0 0 2.685 0 1.79 1.79 0 0 0 0-2.684l-7.158-6.62 7.158-6.8a1.79 1.79 0 0 0 0-2.684 1.79 1.79 0 0 0-2.684 0L5.929 9.98a1.79 1.79 0 0 0 0 2.684l8.052 8.052z'
                ></path>
              </svg>
            )}
          </>
        )}
      </div>
    </Wrap>
  )
}
function Wrap({ type, link, children, className, onClick }: Readonly<PropsWrap>) {
  switch (type) {
    case 'Link':
      return (
        <Link to={link ?? '#'} className={className}>
          {children}
        </Link>
      )
    case 'Button':
      return (
        <button onClick={onClick} className={className}>
          {children}
        </button>
      )
    default:
      return <div className={className}>{children}</div>
  }
}
