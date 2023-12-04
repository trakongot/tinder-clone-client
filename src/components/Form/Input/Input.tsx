interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: string
  classNameWrap?: string
  classNameInput?: string
  classNameError?: string
}
export default function Input({
  type = 'text',
  classNameWrap,
  classNameInput = 'h-[40px] px-2 text-sm outline-0 mt-2 w-full border border-solid border-[#ddd]',
  classNameError = 'block text-[#f44336] text-[0.8rem] mt-1',
  ...rest
}: Props) {
  return (
    <div className={classNameWrap}>
      <input className={classNameInput} type={type} {...rest} />
      <span className={classNameError}>You can&apos; leave this empty</span>
    </div>
  )
}
