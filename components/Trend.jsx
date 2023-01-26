import React, { useEffect, useState } from 'react'
import { makeGet,backend } from '../services/auth'

const Trend = ({accessToken,showOtherProfile}) => {
    const [trends , setTrends] = useState([])

    const getTrends = async () => {
        const res = await makeGet("topclicks",accessToken)
        setTrends( prev => res )
    }

    useEffect(()=>{
        getTrends()
    },[])

  return (
    <div className='flex-[.65] flex flex-col gap-2 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-700 scrollbar-track-blue-300'>
            {
                trends.length && trends.map((elm,i)=>{return(
                    <div key={i} className='mx-3 hover:scale-[1.05] flex items-center border-2 border-solid border-white rounded-lg'>
                        <img className='h-[35px] ml-5 mr-1 cursor-pointer' src={`https://${backend+elm.owners.image}`} onClick={()=>showOtherProfile(elm.owners.id)} />
                        <h1 className='text-md'>: {elm.msg.slice(0,30)}</h1>
                    </div>
                )})
            }
    </div>
  )
}

export default Trend