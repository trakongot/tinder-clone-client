import React, { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Link, useNavigate } from 'react-router-dom'
import path from 'src/constants/path'
import { useClickOutsideDialog } from 'src/hooks/useClickOutsideDialog'
import { Schema, schema } from 'src/utils/rules'
import { useMutation } from '@tanstack/react-query'
import authApi from 'src/apis/auth.api'
import Input from './Input'
import { ErrorResponse } from 'src/types/utils.type'
import { isAxiosUnprocessableEntityError } from 'src/utils/until'
import omit from 'lodash/omit'
import ReactFacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
// eslint-disable-next-line import/named
import { GoogleCredentialResponse, GoogleLogin } from '@react-oauth/google'
import { ReactFacebookLoginInfo } from 'react-facebook-login'

import config from 'src/constants/config'
import { toast } from 'react-toastify'
import { setUserIDToLS } from 'src/utils/auth'
import { useDispatch } from 'react-redux'
import { setUserID } from 'src/redux/slices/userProfile.slice'
interface PropsDialogAuth {
  isLoginDialogAuth: boolean
  setShowDialogAuth: React.Dispatch<React.SetStateAction<boolean>>
}
type FormData = Pick<Schema, 'username' | 'pass' | 'confirm_pass'>
const loginSchema = schema.pick(['username', 'pass'])
// const registerSchema = schema.pick(['username', 'pass', 'confirm_pass'])

export default function DialogAuth({ setShowDialogAuth, isLoginDialogAuth }: Readonly<PropsDialogAuth>) {
  const dispatch = useDispatch()
  const [isLogin, setIsLogin] = useState(isLoginDialogAuth)
  const [showLoginWithAccount, setShowLoginWithAccount] = useState(false)
  const navigate = useNavigate()

  const toggleLoginAccount = () => {
    setIsLogin(!isLogin)
  }
  const responseFacebook = async (response: ReactFacebookLoginInfo) => {
    const credential = response.accessToken
    try {
      const data = await authApi.getInfoUserFacebook(credential)
      dispatch(setUserID(data?.data?.userID ?? null))
      setUserIDToLS(data?.data?.userID ?? null)
      navigate(path.matched)
    } catch (error) {
      console.error('Lỗi khi lấy thông tin người dùng từ Facebook:', error)
    }
  }
  // const login = () => {
  //   // Gọi hàm đăng nhập từ thư viện OAuth
  //   GoogleLogin({
  //     onSuccess: (credentialResponse) => {
  //       console.log(credentialResponse)
  //     },
  //     onError: () => {
  //       console.log('Login Failed')
  //     }
  //   })
  // }
  // const login = useGoogleLogin({
  //   onSuccess: (codeResponse) => console.log(codeResponse)
  // })
  const responseGoogle = async (credentialResponse: GoogleCredentialResponse) => {
    const credential = credentialResponse.credential ?? ''

    try {
      const data = await authApi.getInfoUserGoogle(credential)
      dispatch(setUserID(data?.data?.userID ?? null))
      setUserIDToLS(data?.data?.userID ?? null)
      navigate(path.matched)
    } catch (error) {
      console.error('Lỗi khi lấy thông tin người dùng từ Google:', error)
    }
  }
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<Omit<FormData, 'confirm_pass'>>({
    resolver: yupResolver(loginSchema)
  })
  const loginAccountMutation = useMutation({
    mutationFn: (body: Omit<FormData, 'confirm_pass'>) => authApi.loginAccount(body)
  })
  const onSubmitFormLogin = handleSubmit((data) => {
    const body = omit(data, 'confirm_pass')
    loginAccountMutation.mutate(body, {
      onSuccess: (data) => {
        dispatch(setUserID(data?.data?.userID ?? null))
        setUserIDToLS(data?.data?.userID ?? null)
        navigate(path.matched)
      },
      onError: (error) => {
        console.log(error)
        if (isAxiosUnprocessableEntityError<ErrorResponse<Omit<FormData, 'confirm_pass'>>>(error)) {
          toast.error('vui long kiem tra lai tai khoan mat khau')
        }
      }
    })
  })

  const dialogRef = useRef<HTMLDivElement>(null)
  useClickOutsideDialog({ dialogRef, setShow: setShowDialogAuth })
  if (!showLoginWithAccount) {
    return (
      <div className='fixed z-20 inset-0 overlay'>
        <div className='dialog mt-[50vh] -translate-y-1/2'>
          <div ref={dialogRef} className='relative h-min-[600px] rounded-md mx-auto w-[440px] bg-white '>
            <div className='absolute top-5 right-5'>
              <svg
                onClick={() => setShowDialogAuth(false)}
                focusable='false'
                aria-hidden='true'
                viewBox='0 0 24 24'
                className='fill-[#505965] h-5 w-5'
              >
                <path d='M0.585786 0.585786C1.36683 -0.195262 2.63317 -0.195262 3.41422 0.585786L12 9.17157L20.5858 0.585787C21.3668 -0.195262 22.6332 -0.195262 23.4142 0.585787C24.1953 1.36684 24.1953 2.63317 23.4142 3.41421L14.8284 12L23.4142 20.5858C24.1953 21.3668 24.1953 22.6332 23.4142 23.4142C22.6332 24.1953 21.3668 24.1953 20.5858 23.4142L12 14.8284L3.41422 23.4142C2.63317 24.1953 1.36683 24.1953 0.585786 23.4142C-0.195262 22.6332 -0.195262 21.3668 0.585786 20.5858L9.17157 12L0.585786 3.41421C-0.195262 2.63317 -0.195262 1.36683 0.585786 0.585786Z'></path>
              </svg>
            </div>
            <div className='flex flex-col items-center px-[44px] py-[36px]'>
              <svg focusable='false' aria-hidden='true' viewBox='0 0 24 24' className='h-9 my-5'>
                <path
                  d='M8.21 10.08c-.02 0-.04 0-.06-.02-.67-.9-.84-2.44-.89-3.03 0-.11-.13-.18-.23-.12C4.93 8.08 3 10.86 3 13.54 3 18.14 6.2 22 11.7 22c5.15 0 8.7-3.98 8.7-8.46 0-5.87-4.2-9.77-7.93-11.53a.13.13 0 0 0-.19.14c.48 3.16-.18 6.6-4.07 7.93z'
                  fill='#fd3864'
                  fillRule='nonzero'
                ></path>
              </svg>
              <div className='text-[#21262e] text-3xl font-semibold'>{isLogin ? 'Get Started' : 'Create account'}</div>
              <div className='text-[#21262e] mt-4 text-sm'>
                By clicking
                <button onClick={toggleLoginAccount}>
                  <Link className='text-[#106bd5] font-semibold underline px-1' to='#'>
                    {isLogin ? 'Log in' : 'Sign up'}
                  </Link>
                </button>
                , you agree to our
                <Link className='text-[#106bd5] font-semibold underline px-1' to={'#'}>
                  Terms
                </Link>
                . Learn how we process your data in our
                <Link className='text-[#106bd5] font-semibold underline px-1' to={'#'}>
                  Privacy Policy
                </Link>
                and
                <Link className='text-[#106bd5] font-semibold underline px-1' to={'#'}>
                  Cookie Policy
                </Link>
              </div>
              <div className='mt-2 '>
                <GoogleLogin
                  onSuccess={responseGoogle}
                  onError={() => {
                    console.log('Login Failed')
                  }}
                  shape='circle'
                  ux_mode='popup'
                  width='352px'
                />
              </div>

              {/* <button
                onClick={() => login()}
                className='mt-2 bg-[#e9ebee] w-full flex items-center rounded-full px-5 py-[10px]'
              >
                <svg
                  viewBox='0 0 32 32'
                  data-name='Layer 1'
                  id='Layer_1'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='#000000'
                  className='w-5 h-5'
                >
                  <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
                  <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g>
                  <g id='SVGRepo_iconCarrier'>
                    <path
                      d='M23.75,16A7.7446,7.7446,0,0,1,8.7177,18.6259L4.2849,22.1721A13.244,13.244,0,0,0,29.25,16'
                      fill='#00ac47'
                    ></path>
                    <path
                      d='M23.75,16a7.7387,7.7387,0,0,1-3.2516,6.2987l4.3824,3.5059A13.2042,13.2042,0,0,0,29.25,16'
                      fill='#4285f4'
                    ></path>
                    <path
                      d='M8.25,16a7.698,7.698,0,0,1,.4677-2.6259L4.2849,9.8279a13.177,13.177,0,0,0,0,12.3442l4.4328-3.5462A7.698,7.698,0,0,1,8.25,16Z'
                      fill='#ffba00'
                    ></path>
                    <polygon fill='#2ab2db' points='8.718 13.374 8.718 13.374 8.718 13.374 8.718 13.374'></polygon>
                    <path
                      d='M16,8.25a7.699,7.699,0,0,1,4.558,1.4958l4.06-3.7893A13.2152,13.2152,0,0,0,4.2849,9.8279l4.4328,3.5462A7.756,7.756,0,0,1,16,8.25Z'
                      fill='#ea4435'
                    ></path>
                    <polygon fill='#2ab2db' points='8.718 18.626 8.718 18.626 8.718 18.626 8.718 18.626'></polygon>
                    <path d='M29.25,15v1L27,19.5H16.5V14H28.25A1,1,0,0,1,29.25,15Z' fill='#4285f4'></path>
                  </g>
                </svg>
                <div className='text-[#7c8591] flex-1 text-center'>Log in with Google</div>
              </button> */}

              <ReactFacebookLogin
                appId={config.clientIdFacebook}
                autoLoad={false}
                callback={responseFacebook}
                render={(renderProps) => (
                  <button
                    onClick={() => {
                      renderProps.onClick()
                    }}
                    className='mt-2 bg-[#e9ebee] w-full flex items-center rounded-full px-5 py-[10px] overflow-hidden'
                  >
                    <svg
                      fill='#106bd5'
                      viewBox='0 0 32 32'
                      version='1.1'
                      xmlns='http://www.w3.org/2000/svg'
                      stroke='#106bd5'
                      className='w-5 h-5'
                    >
                      <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
                      <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g>
                      <g id='SVGRepo_iconCarrier'>
                        <title>facebook</title>{' '}
                        <path d='M30.996 16.091c-0.001-8.281-6.714-14.994-14.996-14.994s-14.996 6.714-14.996 14.996c0 7.455 5.44 13.639 12.566 14.8l0.086 0.012v-10.478h-3.808v-4.336h3.808v-3.302c-0.019-0.167-0.029-0.361-0.029-0.557 0-2.923 2.37-5.293 5.293-5.293 0.141 0 0.281 0.006 0.42 0.016l-0.018-0.001c1.199 0.017 2.359 0.123 3.491 0.312l-0.134-0.019v3.69h-1.892c-0.086-0.012-0.185-0.019-0.285-0.019-1.197 0-2.168 0.97-2.168 2.168 0 0.068 0.003 0.135 0.009 0.202l-0.001-0.009v2.812h4.159l-0.665 4.336h-3.494v10.478c7.213-1.174 12.653-7.359 12.654-14.814v-0z'></path>{' '}
                      </g>
                    </svg>
                    <div className='text-[#7c8591] flex-1 text-center'>Log in with Facebook</div>
                  </button>
                )}
              />
              <button
                onClick={() => setShowLoginWithAccount(true)}
                className='mt-2 border-1 border-solid border-[#888787] w-full flex items-center rounded-full px-5 py-[10px]'
              >
                <svg focusable='false' aria-hidden='true' viewBox='0 0 16 16' className='h-6 w-6 fill-[#505965]'>
                  <path d='M14.5831 13.2893C14.5641 13.1585 14.3351 12.9303 13.8963 12.6053C13.7793 12.5069 11.8473 10.8596 11.7564 10.794C11.6654 10.7282 11.5715 10.6869 11.4752 10.6699C11.3381 10.6457 11.1492 10.713 10.9084 10.8724C10.6682 11.0318 10.4417 11.2117 10.2294 11.4118C10.0967 11.5368 9.82283 11.7641 9.82283 11.7641L9.51721 11.9911C9.31581 12.1268 9.15829 12.1846 9.0447 12.1646C8.98283 12.1536 8.24161 11.6155 8.22932 11.6062C7.38012 10.9184 6.6633 10.1894 6.10888 9.39762C5.55426 8.60571 5.11382 7.68192 4.7579 6.64876C4.75361 6.63334 4.72543 6.56148 4.67384 6.43214C4.62219 6.30266 4.50112 5.75332 4.51203 5.69171C4.53174 5.57957 4.63772 5.45333 4.82890 5.31258L5.14658 5.10248C5.29976 5.00821 5.45913 4.91938 5.62457 4.83582C5.88523 4.70473 6.13089 4.55314 6.36295 4.38210C6.59572 4.21033 6.72355 4.05581 6.74784 3.91816C6.76462 3.82234 6.75790 3.71986 6.72734 3.61204C6.69662 3.50363 5.80942 1.12477 5.75697 0.981249C5.66979 0.688778 5.58890 0.468262 5.51414 0.319439C5.45514 0.202226 5.4 0.129611 5.34848 0.101725C5.32488 0.0862987 5.29376 0.0724876 5.25509 0.0603906C5.22174 0.0497769 5.18255 0.0405146 5.13782 0.0326037C4.95260 0.0000702 4.70440 -0.00800546 4.39330 0.00788221C4.08251 0.0237039 3.83430 0.0543915 3.64929 0.0996153C3.55386 0.121304 3.45389 0.161056 3.34930 0.218806C3.32837 0.230441 3.30717 0.242736 3.28585 0.255789L2.97571 0.485567C2.77606 0.657332 2.56260 0.883319 2.33513 1.16439C2.26455 1.25315 2.19804 1.34251 2.13564 1.43247C1.78763 1.93359 1.56619 2.45247 1.47179 2.98811C1.43906 3.17342 1.41895 3.35570 1.41222 3.53547C1.40540 3.71495 1.41371 3.92024 1.43678 4.15110C1.45989 4.38167 1.48105 4.55373 1.49997 4.66653C1.51905 4.77932 1.55581 4.98260 1.61039 5.27573C1.66511 5.56870 1.69718 5.74755 1.70654 5.81341C1.82876 6.52914 2.00748 7.18034 2.24399 7.76766C2.63129 8.74204 3.21165 9.78173 3.98441 10.8846C4.40257 11.4816 4.82217 12.0195 5.24369 12.4979C5.60070 12.9031 5.95887 13.2658 6.31828 13.5858C6.35560 13.6194 6.39327 13.6527 6.43164 13.6858C6.87676 14.0707 7.39004 14.4287 7.97090 14.7593C8.02901 14.7906 8.18680 14.8819 8.44341 15.0336C8.69939 15.1850 8.87781 15.2891 8.97736 15.3454C9.07756 15.4026 9.23189 15.4807 9.44074 15.5819C9.64975 15.6823 9.83984 15.7598 10.011 15.8149C10.1814 15.8698 10.3597 15.9139 10.545 15.9466C11.1774 16.0580 11.8470 15.9951 12.5546 15.7589C12.9006 15.6396 13.1891 15.5146 13.4202 15.3838L13.7408 15.1697C13.8541 15.0784 13.9420 14.9844 14.0040 14.8880C14.0048 14.8867 14.0057 14.8854 14.0065 14.8842C14.1121 14.7261 14.2243 14.5048 14.3452 14.2202C14.4665 13.9335 14.5438 13.6976 14.5765 13.5123C14.5935 13.4158 14.5956 13.3417 14.5831 13.2893'></path>
                </svg>
                <div className='text-[#505965] text-xl font-semibold flex-1 text-center'>Log in with account</div>
              </button>
              <Link className='text-[#106bd5] text-sm mt-2 font-semibold underline' to={'#'}>
                Trouble Logging In?
              </Link>
              <h3 className='mt-4 font-semibold text-lg'>Get the app!</h3>
              <div className='flex justify-center items-center'>
                <Link to={'#'}>
                  <img className='ml-3 h-[48px] object-contain' src='/assets/images/app_store.png' alt='' />
                </Link>
                <Link to={'#'}>
                  <img className='h-[72px] object-contain' src='/assets/images/google_play.png' alt='' />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  } else
    return (
      <div className='fixed z-20 inset-0 overlay'>
        <div className='dialog mt-[50vh] -translate-y-1/2'>
          <div ref={dialogRef} className='relative h-min-[600px] rounded-md mx-auto w-[440px] bg-white '>
            <div className='absolute top-5 right-5'>
              <svg
                onClick={() => setShowDialogAuth(false)}
                focusable='false'
                aria-hidden='true'
                viewBox='0 0 24 24'
                className='fill-[#505965] h-5 w-5'
              >
                <path d='M0.585786 0.585786C1.36683 -0.195262 2.63317 -0.195262 3.41422 0.585786L12 9.17157L20.5858 0.585787C21.3668 -0.195262 22.6332 -0.195262 23.4142 0.585787C24.1953 1.36684 24.1953 2.63317 23.4142 3.41421L14.8284 12L23.4142 20.5858C24.1953 21.3668 24.1953 22.6332 23.4142 23.4142C22.6332 24.1953 21.3668 24.1953 20.5858 23.4142L12 14.8284L3.41422 23.4142C2.63317 24.1953 1.36683 24.1953 0.585786 23.4142C-0.195262 22.6332 -0.195262 21.3668 0.585786 20.5858L9.17157 12L0.585786 3.41421C-0.195262 2.63317 -0.195262 1.36683 0.585786 0.585786Z'></path>
              </svg>
            </div>
            <div className='flex flex-col items-center px-5 py-5'>
              <svg focusable='false' aria-hidden='true' viewBox='0 0 24 24' className='h-9 my-5'>
                <path
                  d='M8.21 10.08c-.02 0-.04 0-.06-.02-.67-.9-.84-2.44-.89-3.03 0-.11-.13-.18-.23-.12C4.93 8.08 3 10.86 3 13.54 3 18.14 6.2 22 11.7 22c5.15 0 8.7-3.98 8.7-8.46 0-5.87-4.2-9.77-7.93-11.53a.13.13 0 0 0-.19.14c.48 3.16-.18 6.6-4.07 7.93z'
                  fill='#fd3864'
                  fillRule='nonzero'
                ></path>
              </svg>
              {/* <div className='text-[#21262e] text-4xl py-5 font-semibold'>
                {isLogin ? 'Create your account' : 'Enter your account'}
              </div> */}
              <div className='text-[#21262e] mt-4 px-5 text-sm mb-4'>
                By clicking
                <button onClick={toggleLoginAccount}>
                  <Link className='text-[#106bd5] font-semibold underline px-1' to={'#'}>
                    {isLogin ? 'Log in' : 'Sign up'}
                  </Link>
                </button>
                , you agree to our
                <Link className='text-[#106bd5] font-semibold underline px-1' to={'#'}>
                  Terms
                </Link>
                . Learn how we process your data in our
                <Link className='text-[#106bd5] font-semibold underline px-1' to={'#'}>
                  Privacy Policy
                </Link>{' '}
                and
                <Link className='text-[#106bd5] font-semibold underline px-1' to={'#'}>
                  Cookie Policy
                </Link>
              </div>
              <Input
                name='username'
                register={register}
                type='text'
                errorMessage={errors.username?.message}
                placeholder='Confirm Password'
                autoComplete='on'
              />
              <Input
                name='pass'
                register={register}
                type='password'
                errorMessage={errors.pass?.message}
                placeholder='Enter your Password'
                autoComplete='on'
              />
              {/* <Input
                name='confirm_pass'
                register={register}
                type='password'
                errorMessage={errors.confirm_pass?.message}
                placeholder='Enter your confirm Password'
                autoComplete='on'
              /> */}
              <button
                onClick={onSubmitFormLogin}
                disabled={loginAccountMutation.isPending}
                className='bg-[#fd3864] my-4 text-xl text-white rounded-full px-10 py-3'
              >
                {loginAccountMutation?.isPending ? 'Loading...' : 'Continue'}
              </button>
              <p className='text-sm text-[#505965] px-5'>
                When you tap &ldquo;Continue&ldquo;, Tinder will send a text with verification code. Message and data
                rates may apply. The verified phone number can be used to login.
                <Link
                  className='text-[#106bd5] text-sm font-semibold '
                  to={'https://www.help.tinder.com/hc/en-us/articles/360005147211?utm_source=web'}
                >
                  Learn what happens when your username changes.
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    )
}
