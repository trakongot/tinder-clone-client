interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: string
  text?: string
  className?: string
  classNameCheckBox?: string
  classNameError?: string
  classNameLabel?: string
}
export default function Radio({
  className = 'custom-checkbox w-full cursor-pointer',
  classNameCheckBox = 'bg-[#f57224] border border-solid border-[#f57224] w-7 h-5 custom-checkbox-square flex justify-center items-center rounded-sm',
  classNameLabel = 'cursor-pointer text-sm',
  classNameError = 'text-[#757575] text-xs',
  text,
  name,
  ...rest
}: Props) {
  return (
    <label className={className}>
      <input type='checkbox' {...rest} className='hidden' id={name} />
      <div className='flex items-center justify-between gap-x-3'>
        <div className={classNameCheckBox}>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 10 10'
            fill='none'
            stroke='white'
            strokeWidth='1'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='M8 2L4 7l-2-2' />
          </svg>
        </div>
        <label className={classNameLabel} htmlFor={name}>
          {text}
        </label>
      </div>
      <span className={classNameError}>You can&apos; leave this empty</span>
    </label>
  )
}
