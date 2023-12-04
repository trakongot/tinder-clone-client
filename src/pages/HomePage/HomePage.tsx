/* eslint-disable import/no-unresolved */
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Footer from 'src/components/Footer'
import NavHomePage from 'src/components/NavHomePage'
import DialogAuth from 'src/components/DialogAuth'
import 'swiper/css/bundle'
import { Autoplay, FreeMode } from 'swiper/modules'
import { SwiperSlide, Swiper } from 'swiper/react'
import { v4 as uuid } from 'uuid'

export default function HomePage() {
  const [isNavVisible, setIsNavVisible] = useState(true)
  const navRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [showLogin, setShowLogin] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (navRef.current && buttonRef.current) {
        const navBottom = navRef.current.getBoundingClientRect().bottom
        const buttonTop = buttonRef.current.getBoundingClientRect().top
        setIsNavVisible(buttonTop >= navBottom + 200)
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])
  return (
    <main className='hide-scrollbar'>
      {showLogin && <DialogAuth isLoginDialogAuth={false} setShowDialogAuth={setShowLogin}></DialogAuth>}
      <div
        className='relative'
        style={{
          width: '100%',
          height: '100vh',
          backgroundImage:
            'linear-gradient(to bottom, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.3)), url("/assets/images/background_homepage.webp")',
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center'
        }}
      >
        <NavHomePage ref={navRef} className='overlay sticky top-0 h-[90px] w-full'></NavHomePage>
        <div
          style={{ height: 'calc(100% - 90px)' }}
          className={`flex flex-col justify-center items-center ${isNavVisible ? '' : 'opacity-0'}`}
        >
          <h1 className='text-[8vw] font-medium text-white'>Swipe Right®</h1>
          <button
            ref={buttonRef}
            onClick={() => setShowLogin(true)}
            className='bg-[#fd3864] text-xl text-white rounded-full px-10 py-3'
          >
            Create account
          </button>
        </div>
      </div>
      <div className='bg-[#111418]'>
        <div className='px-10 pt-8 pb-[80px]'>
          <Swiper
            slidesPerView={3}
            freeMode={false}
            loop={true}
            modules={[FreeMode, Autoplay]}
            className='review-swiper'
          >
            {Array(6)
              .fill(0)
              .map(() => (
                <SwiperSlide key={uuid()}>
                  <Link className='ml-3 block w-[95%]' to={'#'}>
                    <div className='text-left relative p-6 rounded-lg border border-[#333a44] text-white border-solid'>
                      <figcaption className='w-3/4 mb-2 text-2xl font-medium'>Shannon & Julian</figcaption>
                      <div className='flex'>
                        <div className='w-3/4 bg-[#333a44] h-[1.5px] rounded-full' />
                        <span className='opacity-75 text-[9rem] absolute top-[-1.5rem] right-[2.5rem] text-[#333a44]'>
                          “
                        </span>
                      </div>
                      <blockquote>
                        <p className='whitespace-pre-wrap mt-5'>
                          I was feeling lonely back in my hometown because most of my friends had started romantic
                          relationships while I was abroad. We both decided to download Tinder and see what happened.
                          Without the app we may have never met and embarked on this wild, wonderful journey. Thank you
                          for bringing us and so many other couples together around the world. I will forever be
                          grateful.
                        </p>
                      </blockquote>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
        <Footer className='px-[86px]'></Footer>
      </div>
    </main>
  )
}
