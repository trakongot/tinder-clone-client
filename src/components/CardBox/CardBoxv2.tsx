import TinderCard from 'react-tinder-card'
import MatchedProfile from 'src/components/MatchedProfile'
import { v4 as uuid } from 'uuid'
import { useEffect, useRef, useState } from 'react'
import { useClickOutsideDialog } from 'src/hooks/useClickOutsideDialog'

const images = [
  'https://picsum.photos/id/1/2500/2500',
  'https://picsum.photos/id/10/2500/1667',
  'https://picsum.photos/id/1/2500/2500',
  'https://picsum.photos/id/10/2500/1667'
]
type Direction = 'left' | 'right' | 'up' | 'down'

export default function CardUserPage() {
  const [showProfile, setShowProfile] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const cardRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  const divOverlayRef = useRef<HTMLDivElement>(null)
  const nextSlide = () => {
    setActiveIndex((activeIndex + 1) % images.length)
  }

  const prevSlide = () => {
    setActiveIndex((activeIndex - 1 + images.length) % images.length)
  }
  const onSwipe = (direction: Direction) => {
    console.log('You swiped: ' + direction)
  }

  const onCardLeftScreen = (myIdentifier: string) => {
    console.log(myIdentifier + ' left the screen')
  }
  useEffect(() => {
    const divElement = cardRef.current
    const divOverlayElement = divOverlayRef.current

    if (divElement && divOverlayElement) {
      const divRect = divElement.getBoundingClientRect()
      const divOverlayStyle = {
        top: `${divRect.top + 600}px`,
        width: `${divRect.width}px`
      }
      Object.assign(divOverlayElement.style, divOverlayStyle)
    }
  }, [])
  useClickOutsideDialog({ dialogRef: profileRef, setShow: setShowProfile })

  return (
    <main className='w-full h-full bg-[#f0f2f4] flex items-center justify-center relative'>
      {Array(10)
        .fill(0)
        .map((_, index) => (
          <TinderCard
            key={uuid()}
            onSwipe={onSwipe}
            onCardLeftScreen={() => onCardLeftScreen('Card' + index)} // Pass a unique identifier
            className={`z-[${index}] absolute card rounded-lg h-[600px] w-[360px] overflow-hidden`}
          >
            <div ref={cardRef} className='card w-full h-full'>
              <div
                className='flex h-full'
                style={{ transform: `translateX(-${activeIndex * 100}%)`, transition: 'transform 0.5s' }}
              >
                {images.map((image, index) => (
                  <div key={uuid()} className='min-w-full'>
                    <img src={image} alt={`Slide ${index + 1}`} className='w-full h-full object-cover' />
                  </div>
                ))}
              </div>
              <button className='absolute top-1/2 left-1 -translate-y-1/2 z-100' onClick={prevSlide}>
                <svg
                  className='fill-[#fcfcfc] opacity-70 hover:opacity-100 w-10 h-10 rotate-180'
                  version='1.1'
                  id='XMLID_287_'
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  stroke='#fcfcfc'
                >
                  <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
                  <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g>
                  <g id='SVGRepo_iconCarrier'>
                    <g id='next'>
                      <g>
                        <polygon points='6.8,23.7 5.4,22.3 15.7,12 5.4,1.7 6.8,0.3 18.5,12 '></polygon>
                      </g>
                    </g>
                  </g>
                </svg>
              </button>
              <button className='absolute top-1/2 right-1 -translate-y-1/2 z-100' onClick={nextSlide}>
                <svg
                  className='fill-[#fcfcfc] opacity-70 hover:opacity-100 w-10 h-10'
                  version='1.1'
                  id='XMLID_287_'
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  stroke='#fcfcfc'
                >
                  <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
                  <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g>
                  <g id='SVGRepo_iconCarrier'>
                    <g id='next'>
                      <g>
                        <polygon points='6.8,23.7 5.4,22.3 15.7,12 5.4,1.7 6.8,0.3 18.5,12 '></polygon>
                      </g>
                    </g>
                  </g>
                </svg>
              </button>
              <div className='absolute bottom-0 w-full '>
                <div className='p-5 flex justify-between items-center'>
                  <div className='info text-white'>
                    <div className='text-sm text-left'>Recently Active</div>
                    <div className='flex items-center'>
                      <span>Thanh Tra</span> <span>19</span>
                    </div>
                    <div className='flex items-center'>
                      <svg className='w-5 h-5' focusable='false' aria-hidden='true' viewBox='0 0 24 24'>
                        <g fill='#fff' stroke='#fff' strokeWidth='.5' fillRule='evenodd'>
                          <path d='M11.436 21.17l-.185-.165a35.36 35.36 0 0 1-3.615-3.801C5.222 14.244 4 11.658 4 9.524 4 5.305 7.267 2 11.436 2c4.168 0 7.437 3.305 7.437 7.524 0 4.903-6.953 11.214-7.237 11.48l-.2.167zm0-18.683c-3.869 0-6.9 3.091-6.9 7.037 0 4.401 5.771 9.927 6.897 10.972 1.12-1.054 6.902-6.694 6.902-10.95.001-3.968-3.03-7.059-6.9-7.059h.001z'></path>
                          <path d='M11.445 12.5a2.945 2.945 0 0 1-2.721-1.855 3.04 3.04 0 0 1 .641-3.269 2.905 2.905 0 0 1 3.213-.645 3.003 3.003 0 0 1 1.813 2.776c-.006 1.653-1.322 2.991-2.946 2.993zm0-5.544c-1.378 0-2.496 1.139-2.498 2.542 0 1.404 1.115 2.544 2.495 2.546a2.52 2.52 0 0 0 2.502-2.535 2.527 2.527 0 0 0-2.499-2.545v-.008z'></path>
                        </g>
                      </svg>
                      <span>6 kilometers away</span>
                    </div>
                  </div>
                  <button className='hover:scale-105' onClick={() => setShowProfile(true)}>
                    <svg className='w-5 h-5' focusable='false' aria-hidden='true' viewBox='0 0 24 24'>
                      <path
                        fill='#fff'
                        d='M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z'
                      ></path>
                    </svg>
                  </button>
                </div>
                <div
                  style={{
                    background: 'linear-gradient(to bottom, transparent, rgb(0, 0, 0) 20%)'
                  }}
                  className='h-[80px] w-full flex items-center'
                >
                  <div className='flex w-full justify-evenly items-center py-3'>
                    <button className='group rounded-full w-14 h-14  flex justify-center items-center border-[#eab72c] border border-solid'>
                      <svg
                        className='group-hover:scale-105 w-9 h-9 fill-[#efc44c]'
                        focusable='false'
                        aria-hidden='true'
                        viewBox='0 0 24 24'
                      >
                        <path d='M12.119 4.599V3.307c0-1.216-.76-1.672-1.824-.988l-.608.304L6.04 5.13l-.456.304c-1.064.76-1.064 1.748 0 2.28l.38.38c.987.76 2.66 1.824 3.647 2.432l.532.304c.912.76 1.748.228 1.748-.912V8.246a5.125 5.125 0 0 1 5.167 5.167c0 2.888-2.28 5.092-5.167 5.092-3.04 0-5.32-2.28-5.32-5.168 0-.912-.76-1.671-1.747-1.671-1.064 0-1.824.76-1.824 1.671C3 18.125 6.951 22 11.815 22c4.787 0 8.738-3.8 8.738-8.663.076-4.711-3.875-8.51-8.662-8.51l.228-.228z'></path>
                      </svg>
                    </button>
                    <button className='group rounded-full w-16 h-16 flex justify-center items-center border-[#ff4458] border border-solid'>
                      <svg
                        className='group-hover:scale-105 w-9 h-9 fill-[#ff4458]'
                        focusable='false'
                        aria-hidden='true'
                        viewBox='0 0 24 24'
                      >
                        <path d='m15.44 12 4.768 4.708c1.056.977 1.056 2.441 0 3.499-.813 1.057-2.438 1.057-3.413 0L12 15.52l-4.713 4.605c-.975 1.058-2.438 1.058-3.495 0-1.056-.813-1.056-2.44 0-3.417L8.47 12 3.874 7.271c-1.138-.976-1.138-2.44 0-3.417a1.973 1.973 0 0 1 3.25 0L12 8.421l4.713-4.567c.975-1.139 2.438-1.139 3.413 0 1.057.814 1.057 2.44 0 3.417L15.44 12Z'></path>
                      </svg>
                    </button>
                    <button className='group rounded-full w-16 h-16 flex justify-center items-center border-[#3cc6f7] border border-solid'>
                      <svg
                        className='group-hover:scale-105 w-9 h-9 fill-[#3cc6f7]'
                        focusable='false'
                        aria-hidden='true'
                        viewBox='0 0 24 24'
                      >
                        <path d='M21.06 9.06l-5.47-.66c-.15 0-.39-.25-.47-.41l-2.34-5.25c-.47-.99-1.17-.99-1.56 0L8.87 7.99c0 .16-.23.4-.47.4l-5.47.66c-1.01 0-1.25.83-.46 1.65l4.06 3.77c.15.16.23.5.15.66L5.6 20.87c-.16.98.4 1.48 1.33.82l4.69-2.79h.78l4.69 2.87c.78.58 1.56 0 1.25-.98l-1.02-5.75s0-.4.23-.57l3.91-3.86c.78-.82.78-1.64-.39-1.64v.08z '></path>
                      </svg>
                    </button>
                    <button className='group rounded-full w-16 h-16 flex justify-center items-center border-[#2be8ca] border border-solid'>
                      <svg
                        className='group-hover:scale-105 w-9 h-9 fill-[#2be8ca]'
                        focusable='false'
                        aria-hidden='true'
                        viewBox='0 0 24 24'
                      >
                        <path d='M21.994 10.225c0-3.598-2.395-6.212-5.72-6.212-1.78 0-2.737.647-4.27 2.135C10.463 4.66 9.505 4 7.732 4 4.407 4 2 6.62 2 10.231c0 1.52.537 2.95 1.533 4.076l8.024 7.357c.246.22.647.22.886 0l7.247-6.58.44-.401.162-.182.168-.174a6.152 6.152 0 0 0 1.54-4.09 '></path>
                      </svg>
                    </button>
                    <button className='group rounded-full w-14 h-14 flex justify-center items-center border-[#b64af3] border border-solid'>
                      <svg
                        className='group-hover:scale-105 w-9 h-9 fill-[#b64af3]'
                        focusable='false'
                        aria-hidden='true'
                        viewBox='0 0 24 24'
                      >
                        <path d='M15.979 14.018c.637-.638.51-1.275-.192-1.722l-1.275-.765c-.638-.383-1.148-1.275-.956-2.104L15.15 2.73c.191-.765-.128-.956-.765-.446L6.414 9.937c-.638.638-.51 1.275.19 1.722l1.276.765c.638.382 1.148 1.275.957 2.168l-1.658 6.632c-.191.829.191 1.02.765.446l8.035-7.652z'></path>{' '}
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </TinderCard>
        ))}
      {showProfile && (
        <div className={`z-10 relative rounded-lg h-[600px] w-[360px] `}>
          <div className='w-full h-full overflow-auto hide-scrollbar'>
            <MatchedProfile ref={profileRef}></MatchedProfile>
          </div>
          <div
            style={{
              background: 'linear-gradient(0deg, rgba(255,255,255,1) 63%, rgba(238,238,238,0.0027660722492122147) 100%)'
            }}
            className='absolute w-full bottom-0 h-[80px] flex items-center justify-center '
          >
            <div className='w-full flex justify-evenly items-center py-3'>
              <button className='group rounded-full w-16 h-16 flex justify-center items-center border-[#ff4458] border border-solid'>
                <svg
                  className='group-hover:scale-105 w-9 h-9 fill-[#ff4458]'
                  focusable='false'
                  aria-hidden='true'
                  viewBox='0 0 24 24'
                >
                  <path d='m15.44 12 4.768 4.708c1.056.977 1.056 2.441 0 3.499-.813 1.057-2.438 1.057-3.413 0L12 15.52l-4.713 4.605c-.975 1.058-2.438 1.058-3.495 0-1.056-.813-1.056-2.44 0-3.417L8.47 12 3.874 7.271c-1.138-.976-1.138-2.44 0-3.417a1.973 1.973 0 0 1 3.25 0L12 8.421l4.713-4.567c.975-1.139 2.438-1.139 3.413 0 1.057.814 1.057 2.44 0 3.417L15.44 12Z'></path>
                </svg>
              </button>
              <button className='group rounded-full w-16 h-16 flex justify-center items-center border-[#3cc6f7] border border-solid'>
                <svg
                  className='group-hover:scale-105 w-9 h-9 fill-[#3cc6f7]'
                  focusable='false'
                  aria-hidden='true'
                  viewBox='0 0 24 24'
                >
                  <path d='M21.06 9.06l-5.47-.66c-.15 0-.39-.25-.47-.41l-2.34-5.25c-.47-.99-1.17-.99-1.56 0L8.87 7.99c0 .16-.23.4-.47.4l-5.47.66c-1.01 0-1.25.83-.46 1.65l4.06 3.77c.15.16.23.5.15.66L5.6 20.87c-.16.98.4 1.48 1.33.82l4.69-2.79h.78l4.69 2.87c.78.58 1.56 0 1.25-.98l-1.02-5.75s0-.4.23-.57l3.91-3.86c.78-.82.78-1.64-.39-1.64v.08z '></path>
                </svg>
              </button>
              <button className='group rounded-full w-16 h-16 flex justify-center items-center border-[#2be8ca] border border-solid'>
                <svg
                  className='group-hover:scale-105 w-9 h-9 fill-[#2be8ca]'
                  focusable='false'
                  aria-hidden='true'
                  viewBox='0 0 24 24'
                >
                  <path d='M21.994 10.225c0-3.598-2.395-6.212-5.72-6.212-1.78 0-2.737.647-4.27 2.135C10.463 4.66 9.505 4 7.732 4 4.407 4 2 6.62 2 10.231c0 1.52.537 2.95 1.533 4.076l8.024 7.357c.246.22.647.22.886 0l7.247-6.58.44-.401.162-.182.168-.174a6.152 6.152 0 0 0 1.54-4.09 '></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
