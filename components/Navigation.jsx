import React, { use, useEffect, useState } from 'react'
import { HiOutlineHome } from "react-icons/hi"
import { AiOutlineMessage } from 'react-icons/ai'
import { MdOutlineNotifications } from "react-icons/md"
import { CgProfile } from "react-icons/cg"
import { SlLogout } from "react-icons/sl"
import { makeGet,backend } from '../services/auth'
const Navigation = ({accessToken,setRelogin,setSection,showOtherProfile,currUser}) => {
    const [ prof , setProf ] = useState(null)
    const  getProfile = async () => {
        const res = await makeGet("profile",accessToken)
        setProf(prev => res)
    }
    useEffect(()=>{
        getProfile()
    },[])
  return (
    <div className='w-[20%] h-screen left-0 fixed bg-gray-700'>
        <div className='flex flex-col h-full justify-between'>
            <div className='flex flex-col gap-5'>
                {
                    prof &&
                    <div className='mt-10 flex flex-col items-center justify-center cursor-pointer'>
                        <img className='h-[100px] ml-5 mr-1 rounded-full' src={`http://${backend+prof.image}`} />
                        <h1 className='text-lg'>{prof.name}</h1>
                    </div>

                }
               
                <div onClick={()=>setSection(prev=>1)} className='flex items-center gap-3 hover:bg-stone-600 rounded-xl mx-auto px-10 py-3 duration-300 cursor-pointer'>
                    <HiOutlineHome size="25" />
                    <button className='hidden md:block'>Home</button>
                </div>
                <div onClick={()=>setSection(prev=>2)} className='flex items-center gap-3 hover:bg-stone-600 rounded-xl mx-auto px-10 py-3 duration-300 cursor-pointer'>
                    <AiOutlineMessage size="25" />
                    <button className='hidden md:block'>Messages</button>
                </div>
                <div onClick={()=>setSection(prev=>3)} className='flex items-center gap-3 hover:bg-stone-600 rounded-xl mx-auto px-10 py-3 duration-300 cursor-pointer'>
                    <MdOutlineNotifications size="25" />
                    <button className='hidden md:block'>Notifications</button>
                </div>
                <div onClick={()=>showOtherProfile(currUser)} className='flex items-center gap-3 hover:bg-stone-600 rounded-xl mx-auto px-10 py-3 duration-300 cursor-pointer'>
                    <CgProfile size="25" />
                    <button className='hidden md:block'>Profile</button>
                </div>
            </div>
           
            <div className='flex items-center gap-3 hover:bg-stone-600 rounded-xl mx-auto px-10 py-3 duration-300 cursor-pointer' onClick={()=>{localStorage.removeItem("token");setRelogin(prev=>1)}}>
                <SlLogout size="25" />
                <button className='hidden md:block'>Logout</button>
            </div>
        </div>
    </div>
  )
}

export default Navigation