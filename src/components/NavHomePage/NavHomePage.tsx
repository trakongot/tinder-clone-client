import { Link } from 'react-router-dom'
import { forwardRef, useState } from 'react'
import DialogAuth from '../DialogAuth'

interface Props {
  className?: string
}
const NavHomePage = forwardRef<HTMLDivElement, Props>(({ className }, ref) => {
  const [showSignUp, setShowSignUp] = useState(false)

  return (
    <>
      {showSignUp && <DialogAuth isLoginDialogAuth={true} setShowDialogAuth={setShowSignUp}></DialogAuth>}
      <div ref={ref} className={`${className} flex justify-between`}>
        <div className='ml-10 flex items-center flex-1'>
          <Link to={'#'}>
            <svg className='h-9 mr-6' viewBox='0 0 519 123'>
              <g fill='none' fillRule='evenodd'>
                <title>Tinder</title>
                <path
                  d='M31.5 49.6C55 41.5 59 20.4 56 1c0-.7.6-1.2 1.2-1C79.7 11 105 35 105 71c0 27.6-21.4 52-52.5 52a50 50 0 0 1-28.2-92.7c.6-.4 1.4 0 1.4.7.3 3.7 1.3 13 5.4 18.6h.4z'
                  fill='white'
                ></path>
                <path
                  d='M171.2 101.1l1.7-2 5.3 16.8-.7.7c-4 3.7-10 5.6-17.7 5.6h-.3c-7 0-12.5-2-16.3-5.7-3.8-3.8-5.8-9.5-5.8-16.7V54h-13.5V35.5h13.5V13.2h20.8v22.3h16.5V54h-16.6v41.3c0 1.9.5 8 6.3 8 3 0 5.8-1.1 6.8-2.3zm11 19.2V35.6H203v84.7h-20.8zM192.5 1A12.5 12.5 0 1 1 180 13.6C180 6.8 185.7 1 192.5 1zm66.4 32.5c18 0 27.9 9.8 27.9 27.7v59H266V66.2c-.4-9.6-5-14-14.8-14-8.8 0-15.9 5.4-19.5 10v58h-20.8V35.7h20.8v9c6-5.8 15.6-11 27.2-11zM356 44.4V4.6h20.8v115.8H356v-8.8a34.3 34.3 0 0 1-24.7 10.7c-22.7 0-37.9-17.8-37.9-44.3 0-26.6 15.2-44.4 37.9-44.4A34 34 0 0 1 356 44.4zm0 17.9a25.6 25.6 0 0 0-19.6-10c-12.9 0-21.5 10.3-21.5 25.7 0 15.3 8.6 25.6 21.5 25.6 7.5 0 15.7-4 19.6-9.8V62.3zm69.4-28.7c24.6 0 41.7 19 41.7 46v5.7h-62.9c2.1 11.9 11.5 19.5 24.3 19.5 8.1 0 17-3.5 22.1-8.6L452 95l9.9 14.2-1 .9a48.6 48.6 0 0 1-34.1 12.2c-26 0-44.3-18.3-44.3-44.4a42.8 42.8 0 0 1 43-44.3zm-21.3 36h42.7c-1.2-12.7-11.7-18.5-21.4-18.5-14.6 0-20.1 11-21.3 18.6zm113.3-36h1.5v21l-1.8-.3c-1.5-.3-3.4-.5-5.3-.5-6.7 0-16 4.7-19.5 9.7v56.7h-20.8V35.6h20.9V45c6.9-7.2 16-11.4 25-11.4z'
                  fill='white'
                ></path>
              </g>
            </svg>
          </Link>
          <ul className='flex items-center'>
            <Link className='mr-5 text-white hover:text-[#fd3864] hover:underline text-2xl' to={'#'}>
              Products
            </Link>
            <Link className='mr-5 text-white hover:text-[#fd3864] hover:underline text-2xl' to={'#'}>
              Learn
            </Link>
            <Link className='mr-5 text-white hover:text-[#fd3864] hover:underline text-2xl' to={'#'}>
              Safety
            </Link>
            <Link className='mr-5 text-white hover:text-[#fd3864] hover:underline text-2xl' to={'#'}>
              Support
            </Link>
            <Link className='mr-5 text-white hover:text-[#fd3864] hover:underline text-2xl' to={'#'}>
              Download
            </Link>
          </ul>
        </div>
        <div className='mr-10 flex items-center justify-end'>
          <button className='flex items-center'>
            <svg focusable='false' aria-hidden='true' viewBox='0 0 12 12' width='24px' height='24px' className='h-9'>
              <path
                fill='white'
                d='M11.38,3.97c-.2-.19-.44-.34-.7-.44-.26-.1-.54-.15-.83-.15h-2.13v-1.38c0-.53-.23-1.04-.63-1.42-.41-.38-.95-.59-1.53-.59H2.16C1.59,0,1.04,.21,.63,.59c-.41,.38-.63,.89-.63,1.42v3.16c0,.26,.06,.52,.16,.77,.11,.24,.27,.46,.47,.65,.41,.38,.95,.59,1.53,.59h2.13v1.38c0,.26,.05,.52,.16,.76,.11,.24,.27,.46,.47,.65,.19,.19,.43,.34,.69,.44,.26,.1,.54,.16,.82,.15h3.41c.28,0,.56-.05,.83-.15,.26-.1,.5-.25,.7-.43,.4-.38,.63-.88,.64-1.42v-3.17c0-.26-.05-.52-.16-.77-.11-.24-.27-.46-.47-.65ZM2.16,6.27c-.32,0-.62-.12-.84-.32-.22-.21-.35-.49-.35-.78V2.01c0-.15,.03-.29,.09-.43,.06-.13,.15-.26,.26-.36,.11-.1,.24-.18,.39-.24,.15-.06,.3-.08,.46-.08h3.4c.32,0,.62,.12,.84,.32,.22,.21,.35,.49,.35,.78v3.16c0,.29-.13,.57-.35,.78-.22,.21-.53,.32-.84,.33H2.16Zm8.89,2.28c0,.15-.03,.29-.09,.42-.06,.13-.15,.26-.26,.36-.11,.1-.24,.18-.39,.24-.14,.05-.3,.08-.46,.08h-3.41c-.16,0-.31-.03-.46-.08-.14-.06-.28-.14-.39-.24-.22-.21-.35-.49-.35-.78v-1.38h.31c.36,0,.71-.08,1.02-.24,.31-.16,.58-.38,.78-.66l-1.09,2.6v.05h.88l.34-.81h1.38l.35,.81h.94l-1.62-3.84h-.64l-.19,.45c0-.11,0-.22,0-.33v-.92h2.13c.16,0,.31,.03,.46,.08,.15,.06,.28,.14,.39,.24,.11,.1,.2,.23,.26,.36,.06,.13,.09,.28,.09,.43v3.17Zm-3.33-1.09l.28-.79,.2-.64,.21,.64,.26,.79h-.95Z'
              ></path>
              <path
                fill='white'
                d='M5.94,5.92l.4-.71-.13-.04c-.62-.14-1.21-.37-1.75-.68,.47-.49,.82-1.08,1.01-1.71h.8v-.69h-1.98l.15-.11-.1-.1c-.23-.22-.48-.42-.76-.59h-.06l-.08-.08-.61,.42,.15,.1c.14,.1,.27,.2,.39,.31l.06,.04H1.38v.69h.84c.22,.63,.56,1.21,1.02,1.71-.55,.33-1.16,.57-1.81,.68l-.17,.04,.4,.71h.11c.74-.2,1.45-.51,2.07-.94,.62,.39,1.29,.69,2,.9l.11,.04Zm-1.32-3.15c-.18,.45-.45,.86-.79,1.22-.35-.35-.62-.77-.79-1.22h1.59Z'
              ></path>
            </svg>
            <span className='text-white ml-2 mr-5 text-2xl font-semibold'>Language</span>
          </button>
          <button
            onClick={() => setShowSignUp(true)}
            className='bg-white font-semibold text-lg text-black rounded-full h-9 px-8'
          >
            Log in
          </button>
        </div>
      </div>
    </>
  )
})
NavHomePage.displayName = 'CampaignBanner'
export default NavHomePage
