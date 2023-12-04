import React from 'react'
interface Props {
  value?: number
  setValue?: React.Dispatch<React.SetStateAction<number>> | ((value: number) => void)
  min?: number
  max?: number
}

export default function RangeSlider({ value, setValue, min = 2, max = 100 }: Props) {
  const handleDistanceRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (setValue) setValue(Number(e.target.value))
    document.documentElement.style.setProperty('--percent', `${value}%`)
  }
  return (
    <>
      <input
        style={{
          background: `linear-gradient(to right, #ff4458 ${value}%, #a2a9b6 0%)`
        }}
        type='range'
        className='range-slider'
        min={min}
        max={max}
        value={value}
        onChange={handleDistanceRangeChange}
      />
    </>
  )
}
