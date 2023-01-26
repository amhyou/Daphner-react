import React, { useEffect, useState } from 'react'
import { makeGet, makePost,backend } from '../services/auth'

const Follow = ({accessToken,ws,currUser,showOtherProfile}) => {
    const [trends , setTrends] = useState([])

    const getTrends = async () => {
        const res = await makeGet("follow",accessToken)
        console.log("this is trends "+res)
        setTrends( prev => res )
    }

    const handleFollow = async (pro) => {
        // add the folloer to the database
        const res = await makePost("follow",{star_id:pro.id},accessToken)
        console.log(res)
        // remove the profile from suggestions list
        setTrends(prev => prev.filter(p=>p.id != pro.id))
        // send websocket to post owner
        ws.send(JSON.stringify({to:"user"+pro.id,msg: currUser+" followed you",event:"followNotif"}))
    }

    useEffect(()=>{
        getTrends()
    },[])

  return (
    <div className='flex-[.35] flex flex-col gap-2 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-700 scrollbar-track-blue-300'>
            {
                trends.length && trends.map((elm,i)=>{return(
                    <div key={i} className='mx-3 flex items-center border-[.5] border-solid border-white rounded-lg'>
                        <img className='h-[35px] ml-5 mr-1' src={`https://${backend+elm.image}`} onClick={()=>showOtherProfile(elm.id)} />
                        <h1 className='text-md underline cursor-pointer' onClick={()=>showOtherProfile(elm.id)}>{elm.name}</h1>
                        <button className={`text-black bg-green-600 ml-1 hover:scale-[1.05] rounded-lg p-1 hover:bg-green-200`} onClick={()=>handleFollow(elm)}>Follow</button>
                    </div>
                )})
            }
    </div>
  )
}

export default Follow