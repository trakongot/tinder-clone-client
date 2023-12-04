import { useState } from 'react'
type MessageInputProps = {
  text: string
  setText: React.Dispatch<React.SetStateAction<string>>
}
export default function MessageInput({ setText, text }: Readonly<MessageInputProps>) {
  const [textareaHeight, setTextareaHeight] = useState('h-[1rem]')

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = event.target
    setTextareaHeight('h-auto')
    textarea.style.height = 'auto'
    const newHeight = textarea.scrollHeight

    if (newHeight <= 5 * parseFloat(getComputedStyle(textarea).lineHeight)) {
      textarea.style.height = newHeight + 'px'
    } else {
      textarea.style.height = 5 * parseFloat(getComputedStyle(textarea).lineHeight) + 'px'
      setTextareaHeight('h-[5em]')
    }
    setText(textarea.value)
  }
  return (
    <div className='w-full flex items-center'>
      <div className='relative px-2 flex items-center justify-center'>
        <div className='cursor-pointer pr-4'>
          <button className='cursor-pointer'>
            <svg
              className='w-6 h-6'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              focusable='false'
              aria-hidden='true'
            >
              <g fill='#656e7b'>
                <path d='M20.308 20.538a6 6 0 0 0 3.235-3.242C24 16.194 24 14.796 24 12c0-2.796 0-4.193-.457-5.296a6 6 0 0 0-3.235-3.242c.051.087.1.177.147.268C21 4.8 21 6.2 21 9v6c0 2.8 0 4.2-.545 5.27-.046.091-.096.18-.147.268Z'></path>
                <path
                  fillRule='evenodd'
                  d='M.545 3.73C0 4.8 0 6.2 0 9v6c0 2.8 0 4.2.545 5.27a5 5 0 0 0 2.185 2.185C3.8 23 5.2 23 8 23h3c2.8 0 4.2 0 5.27-.545a5 5 0 0 0 2.185-2.185C19 19.2 19 17.8 19 15V9c0-2.8 0-4.2-.545-5.27a5 5 0 0 0-2.185-2.185C15.2 1 13.8 1 11 1H8c-2.8 0-4.2 0-5.27.545A5 5 0 0 0 .545 3.73Zm11.976 6.09c0 1.475-.353 2.33-.909 2.81 1.254.868 2.48 2.324 2.146 3.182-.705 1.813-6.754 1.712-7.67 0-.427-.795.777-2.227 2.038-3.116-.6-.465-.985-1.333-.985-2.876 0-1.509 1.205-2.732 2.69-2.732 1.486 0 2.69 1.223 2.69 2.732Z'
                  clipRule='evenodd'
                ></path>
              </g>
            </svg>
            <span className='hidden'>Choose a contact card</span>
          </button>
        </div>
        <div className='cursor-pointer pr-4'>
          <button className='cursor-pointer'>
            <svg
              className='w-6 h-6'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              focusable='false'
              aria-hidden='true'
            >
              <path
                fill='transparent'
                d='M.401 4.289C.646 2.208 2.208.646 4.29.401 6.086.19 8.636 0 12 0c3.52 0 6.149.208 7.956.43 1.945.24 3.412 1.66 3.647 3.607.21 1.74.397 4.316.397 7.963 0 3.818-.206 6.461-.427 8.202-.23 1.81-1.56 3.14-3.371 3.371-1.74.221-4.384.427-8.202.427-3.648 0-6.223-.188-7.963-.397C2.09 23.368.67 21.9.43 19.956.208 18.15 0 15.52 0 12c0-3.364.19-5.914.401-7.711Z'
              ></path>
              <path
                fill='#656e7b'
                fillRule='evenodd'
                d='M4.289.401C2.208.646.646 2.208.401 4.29.19 6.086 0 8.636 0 12c0 3.52.208 6.149.43 7.956.24 1.945 1.66 3.412 3.607 3.647 1.74.21 4.315.397 7.963.397 3.818 0 6.461-.206 8.202-.427 1.81-.23 3.14-1.56 3.371-3.371.221-1.74.427-4.384.427-8.202 0-3.647-.188-6.223-.397-7.963C23.368 2.09 21.9.67 19.956.43 18.15.208 15.52 0 12 0 8.636 0 6.086.19 4.289.401Zm6.424 14.79c-.807.902-1.934 1.495-3.37 1.495-2.314 0-4.213-1.614-4.213-4.106 0-2.504 1.899-4.094 4.213-4.094 1.65 0 2.682.831 3.275 1.768l-1.4.76a2.241 2.241 0 0 0-1.875-1.032c-1.436 0-2.48 1.103-2.48 2.598 0 1.495 1.044 2.6 2.48 2.6.7 0 1.365-.31 1.685-.606v-.95H6.94v-1.47h3.773v3.037Zm3.026-6.574v7.915h-1.685V8.617h1.685Zm3.252 4.64v3.275h-1.685V8.617h5.6V10.1h-3.915v1.673h3.832v1.484h-3.832Z'
                clipRule='evenodd'
              ></path>
            </svg>
            <span className='hidden'>GIF</span>
          </button>
        </div>
        <div className='cursor-pointer pr-4'>
          <button className='cursor-pointer'>
            <svg
              className='w-6 h-6'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              focusable='false'
              aria-hidden='true'
            >
              <g fill='#656e7b'>
                <path d='M.27 5.363a.445.445 0 0 1 0-.818l.042-.018c1.597-.68 2.837-2 3.42-3.638l.033-.094a.443.443 0 0 1 .835 0l.033.094a6.214 6.214 0 0 0 3.42 3.638l.041.018c.36.153.36.665 0 .818l-.041.018c-1.597.68-2.838 2-3.42 3.638l-.033.094a.443.443 0 0 1-.835 0l-.033-.094a6.214 6.214 0 0 0-3.42-3.638L.27 5.363Z'></path>
                <path
                  fillRule='evenodd'
                  d='M21.818 14.434c.547-.548.179-1.465-.592-1.409-2.418.178-4.27.898-5.521 2.153-1.252 1.256-1.97 3.113-2.147 5.54-.056.772.858 1.141 1.404.593l6.856-6.877Z'
                ></path>
                <path d='M1.08 12.085c0-1.21.186-2.378.53-3.475.384.494.694 1.046.914 1.641.57 1.542 2.746 1.542 3.316 0a6.255 6.255 0 0 1 3.491-3.599c1.504-.614 1.504-2.782 0-3.396a6.269 6.269 0 0 1-2.098-1.41A11.46 11.46 0 0 1 12.621.51c5.693 0 10.422 4.136 11.367 9.575.093.538-.36.993-.903.977-3.869-.111-6.806.812-8.74 2.753-1.83 1.836-2.754 4.57-2.754 8.146 0 .205.003.412.01.622.016.545-.438.998-.974.905-5.423-.948-9.546-5.692-9.546-11.403Z'></path>
              </g>
            </svg>
            <span className='hidden'>Sticker</span>
          </button>
        </div>
        <div className='cursor-pointer pr-4'>
          <button className='cursor-pointer'>
            <svg
              className='w-6 h-6'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              focusable='false'
              aria-hidden='true'
            >
              <circle cx='12' cy='12' r='12' fill='transparent'></circle>
              <path
                fill='#656e7b'
                d='M11.995 0C5.381 0 0 5.382 0 11.996 0 18.616 5.381 24 11.995 24 18.615 24 24 18.615 24 11.996 24 5.382 18.615 0 11.995 0ZM5.908 16.404a14.55 14.55 0 0 1 4.238-.638c2.414 0 4.797.612 6.892 1.77.125.068.238.292.29.572.05.28.03.567-.052.716a.61.61 0 0 1-.834.24A13.106 13.106 0 0 0 6.277 18.03a.61.61 0 0 1-.771-.402c-.107-.35.114-1.13.402-1.224Zm-.523-4.42a18.157 18.157 0 0 1 4.76-.635c2.894 0 5.767.7 8.31 2.026a.729.729 0 0 1 .402.726.746.746 0 0 1-.084.284c-.227.444-.493.743-.66.743a.768.768 0 0 1-.35-.086 16.33 16.33 0 0 0-7.617-1.854 16.337 16.337 0 0 0-4.366.585.75.75 0 0 1-.92-.525c-.112-.422.145-1.16.525-1.264ZM5.25 9.098a.88.88 0 0 1-1.073-.641c-.123-.498.188-1.076.64-1.19a22.365 22.365 0 0 1 5.328-.649c3.45 0 6.756.776 9.824 2.307a.888.888 0 0 1 .4 1.19c-.143.288-.453.598-.795.598a.924.924 0 0 1-.388-.087A20.026 20.026 0 0 0 10.145 8.5c-1.635 0-3.282.201-4.895.598Z'
              ></path>
            </svg>
            <span className='hidden'>Vinyl</span>
          </button>
        </div>
      </div>
      <form className='flex-1 items-center'>
        <div>
          <textarea
            value={text}
            className={`hide-scrollbar w-full ${textareaHeight} font-light text-[#575c63] text-sm tracking-wide resize-none focus:outline-none`}
            onChange={handleInputChange}
          />
        </div>
      </form>
      <div className='flex mx-2'>
        <button type='button'>
          <svg className='w-8 h-8' focusable='false' aria-hidden='true' viewBox='0 0 24 24'>
            <path
              d='M12 17.5c2.33 0 4.3-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5M8.5 11a1.5 1.5 0 100-3 1.5 1.5 0 000 3m7 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3M12 20a8 8 0 110-16 8 8 0 010 16m0-18C6.47 2 2 6.5 2 12a10 10 0 0010 10c5.523 0 10-4.477 10-10A10 10 0 0012 2z'
              fill='#7c8591'
              fillRule='nonzero'
            ></path>
          </svg>
        </button>
        <button className='bg-[#e9ebee] rounded-full px-7 py-2 text-[#656e7b] text-lg ml-2'>Send</button>
      </div>
    </div>
  )
}
