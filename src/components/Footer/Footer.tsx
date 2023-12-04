import { Link } from 'react-router-dom'
interface Props {
  className?: string
}
export default function Footer({ className }: Props) {
  return (
    <footer className={`${className}`}>
      <div className='grid grid-cols-5'>
        <div className='col-span-1'>
          <h2 className='text-white text-left text-xl font-semibold'>Legal</h2>
          <ul>
            <Link to={'#'}>
              <li className='text-white hover:text-[#fd3864] text-left  pt-3 font-light text-base'>Privacy</li>
            </Link>
            <Link to={'#'}>
              <li className='text-white hover:text-[#fd3864] text-left  pt-1 font-light text-base'>Terms</li>
            </Link>
            <Link to={'#'}>
              <li className='text-white hover:text-[#fd3864] text-left  pt-1 font-light text-base'>Cookie Policy</li>
            </Link>
            <Link to={'#'}>
              <li className='text-white hover:text-[#fd3864] text-left  pt-1 font-light text-base'>
                Intellectual Property
              </li>
            </Link>
          </ul>
        </div>
        <div className='col-span-1'>
          <h2 className='text-white text-left text-xl font-semibold'>Careers</h2>
          <ul>
            <Link to={'#'}>
              <li className='text-white hover:text-[#fd3864] text-left  pt-3  font-light text-base'>Careers Portal</li>
            </Link>
            <Link to={'#'}>
              <li className='text-white hover:text-[#fd3864] text-left  pt-1 font-light text-base'>Tech Blog</li>
            </Link>
          </ul>
        </div>
        <div className='col-span-1'>
          <h2 className='text-white text-left text-xl font-semibold'>Social</h2>
          <ul className='flex'>
            <Link to={'#'}>
              <li className='text-left mt-3'>
                <svg
                  className='h-6 mr-5 fill-white hover:fill-[#fd3864]'
                  focusable='false'
                  aria-hidden='true'
                  viewBox='0 0 24 24'
                >
                  <path d='M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.8,5.8 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.8,5.8 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4C4,18.39 5.61,20 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6C20,5.61 18.39,4 16.4,4H7.6M17.25,5.5A1.25,1.25 0 0,1 18.5,6.75A1.25,1.25 0 0,1 17.25,8A1.25,1.25 0 0,1 16,6.75A1.25,1.25 0 0,1 17.25,5.5M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z'></path>
                </svg>
              </li>
            </Link>
            <Link to={'#'}>
              <li className='text-left mt-3'>
                <svg
                  className='h-6 mr-5 fill-white hover:fill-[#fd3864]'
                  focusable='false'
                  aria-hidden='true'
                  viewBox='0 0 24 24'
                >
                  <path d='M12.205 2.039h3.407s-.19 4.376 4.73 4.684v3.382s-2.625.165-4.73-1.442l.036 6.984a6.314 6.314 0 11-6.314-6.313h.886v3.458a2.87 2.87 0 102.016 2.741l-.031-13.494z'></path>
                </svg>
              </li>
            </Link>
            <Link to={'#'}>
              <li className='text-left mt-3'>
                <svg
                  className='h-6 mr-5 fill-white hover:fill-[#fd3864]'
                  focusable='false'
                  aria-hidden='true'
                  viewBox='0 0 24 24'
                >
                  <path d='M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z'></path>
                </svg>
              </li>
            </Link>
            <Link to={'#'}>
              <li className='text-left mt-3'>
                <svg
                  className='h-6 mr-5 fill-white hover:fill-[#fd3864]'
                  focusable='false'
                  aria-hidden='true'
                  viewBox='0 0 24 24'
                >
                  <path d='M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.27C8.28,9.09 5.11,7.38 3,4.79C2.63,5.42 2.42,6.16 2.42,6.94C2.42,8.43 3.17,9.75 4.33,10.5C3.62,10.5 2.96,10.3 2.38,10C2.38,10 2.38,10 2.38,10.03C2.38,12.11 3.86,13.85 5.82,14.24C5.46,14.34 5.08,14.39 4.69,14.39C4.42,14.39 4.15,14.36 3.89,14.31C4.43,16 6,17.26 7.89,17.29C6.43,18.45 4.58,19.13 2.56,19.13C2.22,19.13 1.88,19.11 1.54,19.07C3.44,20.29 5.7,21 8.12,21C16,21 20.33,14.46 20.33,8.79C20.33,8.6 20.33,8.42 20.32,8.23C21.16,7.63 21.88,6.87 22.46,6Z'></path>
                </svg>
              </li>
            </Link>
            <Link to={'#'}>
              <li className='text-left mt-3'>
                <svg
                  className='h-6 mr-5 fill-white hover:fill-[#fd3864]'
                  focusable='false'
                  aria-hidden='true'
                  viewBox='0 0 24 24'
                >
                  <path d='M16.563 8.424h-3.12V6.378c0-.769.51-.948.868-.948h2.202V2.05l-3.033-.012c-3.366 0-4.132 2.52-4.132 4.133v2.252H7.4v3.482h1.947v9.852h4.095v-9.852h2.763l.357-3.482z'></path>
                </svg>
              </li>
            </Link>
          </ul>
        </div>
        <div className='col-span-1'>
          <ul>
            <Link to={'#'}>
              <li className='text-white hover:text-[#fd3864] text-left  pt-2 font-light text-base'>FAQ</li>
            </Link>
            <Link to={'#'}>
              <li className='text-white hover:text-[#fd3864] text-left  pt-1 font-light text-base'>Destinations</li>
            </Link>
            <Link to={'#'}>
              <li className='text-white hover:text-[#fd3864] text-left  pt-1 font-light text-base'>Press Room</li>
            </Link>
            <Link to={'#'}>
              <li className='text-white hover:text-[#fd3864] text-left  pt-1 font-light text-base'>Contact </li>
            </Link>
            <Link to={'#'}>
              <li className='text-white hover:text-[#fd3864] text-left  pt-1 font-light text-base'>Promo Code</li>
            </Link>
          </ul>
        </div>
      </div>
      <div className='w-full bg-[#333a44] mt-2 h-[1px] rounded-full' />
      <section className='flex items-center mt-7'>
        <h2 className='text-white text-left text-xl font-semibold'>Get the app!</h2>
        <Link to={'#'}>
          <img className='h-[51px] ml-7 object-contain' src='/assets/images/app_store.png' alt='' />
        </Link>
        <Link to={'#'}>
          <img className='h-[75px] ml-7 object-contain' src='/assets/images/google_play.png' alt='' />
        </Link>
      </section>
      <section>
        <p className='text-[#b9bfc8] mt-4 text-left text-sm'>
          Single people, listen up: If you&rsquo;re looking for love, want to start dating, or just keep it casual, you
          need to be on Tinder. With over 55 billion matches made, it&rsquo;s the place to be to meet your next best
          match. Let&rsquo;s be real, the dating landscape looks very different today, as most people are meeting
          online. With Tinder, the world&rsquo;s most popular free dating app, you have millions of other single people
          at your fingertips and they&rsquo;re all ready to meet someone like you. Whether you&rsquo;re straight or in
          the LGBTQIA community, Tinder&rsquo;s here to bring you all the sparks.
        </p>
        <p className='text-[#b9bfc8] mt-4 text-left text-sm'>
          There really is something for everyone on Tinder. Want to get into a relationship? You got it. Trying to find
          some new friends? Say no more. New kid on campus and looking to make the most of your college experience?
          Tinder U&rsquo;s got you covered. Tinder isn&rsquo;t your average dating site &mdash; it&rsquo;s the most
          diverse dating app, where adults of all backgrounds and experiences are invited to make connections, memories,
          and everything in between.
        </p>
      </section>
      <div className='w-full bg-[#333a44] mt-2 h-[1px] rounded-full' />
      <div className='flex justify-between items-center pt-5 pb-10'>
        <ul className='flex'>
          <Link className='text-[#b9bfc8] hover:text-[#fd3864] text-left text-sm' to={'#'}>
            FAQ
          </Link>
          <span className='text-[#b9bfc8] mx-2  text-left text-sm'>/</span>
          <Link className='text-[#b9bfc8] hover:text-[#fd3864] text-left text-sm' to={'#'}>
            Safety Tips
          </Link>
          <span className='text-[#b9bfc8] mx-2  text-left text-sm'>/</span>
          <Link className='text-[#b9bfc8] hover:text-[#fd3864] text-left text-sm' to={'#'}>
            Terms
          </Link>
          <span className='text-[#b9bfc8] mx-2  text-left text-sm'>/</span>
          <Link className='text-[#b9bfc8] hover:text-[#fd3864] text-left text-sm' to={'#'}>
            Cookie Policy
          </Link>
          <span className='text-[#b9bfc8] mx-2  text-left text-sm'>/</span>
          <Link className='text-[#b9bfc8] hover:text-[#fd3864] text-left text-sm' to={'#'}>
            Privacy Settings
          </Link>
        </ul>
        <span className='text-[#b9bfc8] block'>© 2023 Match Group, LLC, All Rights Reserved.</span>
      </div>
    </footer>
  )
}
