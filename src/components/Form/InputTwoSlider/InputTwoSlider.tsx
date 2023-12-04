import classNames from 'classnames'
import React, { useEffect, useRef } from 'react'

interface Props {
  min?: number
  max?: number
  minRange: number
  maxRange: number
  minValue: number
  maxValue: number
  setMinValue: React.Dispatch<React.SetStateAction<number>> | ((value: number) => void)
  setMaxValue: React.Dispatch<React.SetStateAction<number>> | ((value: number) => void)
  step?: number
}

const RangeTwoSlider: React.FC<Props> = ({
  min,
  max,
  minRange,
  maxRange,
  minValue,
  maxValue,
  setMinValue,
  setMaxValue,
  step = 1
}) => {
  const minValRef = useRef<HTMLInputElement | null>(null)
  const maxValRef = useRef<HTMLInputElement | null>(null)
  const range = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (maxValRef.current) {
      if (range.current) {
        range.current.style.left = `${minValue}%`
        range.current.style.width = `${maxValue - minValue}%`
      }
    }
  }, [maxValue, minValue])

  useEffect(() => {
    if (minValRef.current) {
      if (range.current) {
        range.current.style.width = `${maxValue - minValue}%`
      }
    }
  }, [maxValue, minValue])

  return (
    <div className='range-two-slider w-full'>
      <input
        type='range'
        min={minRange}
        max={maxRange}
        value={minValue}
        ref={minValRef}
        onChange={(event) => {
          const value = Math.min(+event.target.value, maxValue - step)
          event.target.value = value.toString()
          if (min === undefined || value >= min) {
            setMinValue(value)
          }
        }}
        step={step}
        className={classNames('thumb thumb--zindex-3', {
          'thumb--zindex-5': minValue > maxRange - 100
        })}
      />
      <input
        type='range'
        min={minRange}
        max={maxRange}
        value={maxValue}
        ref={maxValRef}
        onChange={(event) => {
          const value = Math.max(+event.target.value, minValue + step)
          event.target.value = value.toString()
          if (max === undefined || value <= max) {
            setMaxValue(value)
          }
        }}
        step={step}
        className='thumb thumb--zindex-4'
      />

      <div className='slider'>
        <div className='slider__track' />
        <div ref={range} className='slider__range' />
      </div>
    </div>
  )
}

export default RangeTwoSlider
