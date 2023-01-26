import React, { useEffect, useState } from 'react'
import { makeGet,backend } from '../services/auth'

const Notification = ({accessToken,ws,showOtherProfile}) => {
    const [notifs , setNotifs] = useState([])
    const getNotifs = async ()=>{
        const res = await makeGet("notification",accessToken)
        console.log(res)
        setNotifs(prev => res)
    }
    useEffect(()=>{
        getNotifs()
        
    },[])
  return (
    <div className='ml-[20%] h-screen max-h-screeen flex flex-col items-center'>
        <h1 className='text-2xl'>Notifications:</h1>
        <div className='flex flex-col overflow-y-auto mt-10 gap-3'>
            {
                notifs.length!=0 && notifs.map((elm,i)=>{return(
                    <div key={i} className='mx-3 flex items-center border-2 border-solid border-white rounded-lg cursor-pointer hover:scale-[1.05]'>
                        <img className='h-[35px] ml-5 mr-1' src={`http://${backend+elm.pro.image}`} onClick={()=>showOtherProfile(elm.pro.id)} />
                        <h1 className='text-md underline cursor-pointer' onClick={()=>showOtherProfile(elm.pro.id)}>{elm.pro.name}</h1>
                        <h1 className='ml-3'>{elm.msg.slice(2)}</h1>
                        <h1 className='ml-3'>at {elm.time.slice(0,16)}</h1>
                    </div>
                )})
            }
        </div>
    </div>
  )
}

export default Notification