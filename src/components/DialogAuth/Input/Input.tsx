import { InputHTMLAttributes } from 'react'
import type { UseFormRegister, RegisterOptions } from 'react-hook-form'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
  classNameInput?: string
  classNameError?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: UseFormRegister<any>
  rules?: RegisterOptions
}

export default function Input({
  errorMessage,
  className = 'w-full flex flex-col items-center rounded-full px-5 ',
  name,
  register,
  rules,
  classNameInput = 'outline-none text-[#505965] w-full h-[40px]',
  classNameError = 'my-2 text-left w-full line-clamp-1 text-sm text-[#ea4435]',
  ...rest
}: Readonly<InputProps>) {
  const registerResult = register && name ? register(name, rules) : null
  return (
    <div className={className}>
      <input className={classNameInput} {...registerResult} {...rest} />
      <div className={classNameError}>{errorMessage}</div>
    </div>
  )
}
