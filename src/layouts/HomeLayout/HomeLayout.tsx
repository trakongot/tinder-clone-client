import { Outlet } from 'react-router-dom'
import Footer from 'src/components/Footer'
import NavHomePage from 'src/components/NavHomePage'

export default function HomeLayout() {
  return (
    <main className='relative'>
      <NavHomePage className='fixed z-20 w-full h-[90px]'></NavHomePage>
      <main className='z-10 flex justify-center items-center'>
        <Outlet />
      </main>
      <div className='bg-[#111418]'>
        <Footer className='px-[4.25rem]'></Footer>
      </div>
    </main>
  )
}
