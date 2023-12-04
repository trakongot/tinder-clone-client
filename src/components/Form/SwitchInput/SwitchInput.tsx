import { v4 as uuidv4 } from 'uuid'

interface SwitchInputProps {
  className?: string
  checked: boolean
  setChecked?: React.Dispatch<React.SetStateAction<boolean>> | ((value: boolean) => void)
}
export default function SwitchInput({ checked, className, setChecked }: Readonly<SwitchInputProps>) {
  const uniqueId = uuidv4()
  const handleCheckboxClick = () => {
    if (setChecked) setChecked(!checked)
  }
  return (
    <>
      <input
        className={`${className} h-0 w-0 hidden`}
        checked={checked}
        id={uniqueId}
        type='checkbox'
        onChange={handleCheckboxClick}
      />
      <label
        className={`
          'group flex justify-center items-center cursor-pointer w-[50px] h-[25px] rounded-[100px] relative transition-all duration-200',
          ${!checked ? 'bg-gray-400' : 'bg-[#ff4458]'}`}
        htmlFor={uniqueId}
      >
        <span
          style={{
            boxShadow: '0 0 2px 0 rgba(10, 10, 10, 0.29)',
            left: checked ? 'calc(100% - 2px)' : '',
            transform: checked ? 'translateX(-100%)' : ''
          }}
          className={
            'absolute left-[2px] w-[22px] h-[22px] rounded-[50%] transition-all duration-200  bg-white group-hover:bg-[#acacac]'
          }
        />
      </label>
    </>
  )
}
