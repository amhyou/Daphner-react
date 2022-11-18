import React from 'react'
import { HiOutlineHome } from "react-icons/hi"
import { AiOutlineMessage } from 'react-icons/ai'
import { MdOutlineNotifications } from "react-icons/md"
import { CgProfile } from "react-icons/cg"
const Navigation = () => {
  return (
    <div className='w-[20%] h-screen left-0 fixed bg-gray-700'>
        <div className='mt-20 flex flex-col gap-5'>
            <div className='flex items-center gap-3 hover:bg-stone-600 rounded-xl mx-auto px-10 py-3 duration-300'>
                <HiOutlineHome size="25" />
                <button className=''>Home</button>
            </div>
            <div className='flex items-center gap-3 hover:bg-stone-600 rounded-xl mx-auto px-10 py-3 duration-300'>
                <AiOutlineMessage size="25" />
                <button className=''>Messages</button>
            </div>
            <div className='flex items-center gap-3 hover:bg-stone-600 rounded-xl mx-auto px-10 py-3 duration-300'>
                <MdOutlineNotifications size="25" />
                <button className=''>Notifications</button>
            </div>
            <div className='flex items-center gap-3 hover:bg-stone-600 rounded-xl mx-auto px-10 py-3 duration-300'>
                <CgProfile size="25" />
                <button className=''>Profile</button>
            </div>
            
        </div>
    </div>
  )
}

export default Navigation