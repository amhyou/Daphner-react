import React from 'react'
import { AiOutlineSend } from "react-icons/ai"
const Message = () => {
  return (
    <div className='ml-[40%] mr-5 w-full border-x-solid border-x-2 border-x-white flex flex-col'>
        <div className='flex flex-col flex-grow'>

        </div>
        <div className='flex items-center border-t-solid border-t-2 border-t-white pt-1'>
            <input placeholder='type a message' className='text-black w-full rounded-lg py-3 ml-5' />
            <AiOutlineSend color='black' size="25" className='ml-[-30px] mr-8 hover:bg-slate-700' />
        </div>
    </div>
  )
}

export default Message