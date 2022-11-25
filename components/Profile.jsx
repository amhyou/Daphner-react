import React, { useEffect, useRef, useState } from 'react'
import { makeGet, makePost,makeMedia } from '../services/auth'

const Profile = ({accessToken,otherUser,currUser}) => {
    const [pro,setPro] = useState()
    const [tedit,setTedit] = useState(false)
    const [img , setImg] = useState()
    const [stats , setStats ] = useState({followers:0,following:0,followed:false})
    const grabPro = async ()=>{
        const req = await makeGet("profile?stats="+otherUser,accessToken)
        console.log(req)
        setPro(prev => req)
    }
    const smya = useRef(null)
    const onNameChange = async (e)=>{
        console.log(smya.current.value)
        if(smya.current.value && smya.current.value!=pro.name){
            const req = await makePost("profile",{type:"smya",value:smya.current.value},accessToken)
            console.log(req)
            setPro(prev=>{prev.name=smya.current.value;return prev})
            setTedit(!tedit)
        }
        
    }
    const onImageChange = async (e)=>{
        if(img){
            let data = new FormData()
            data.append("image", img,img.name)
            const req = await makeMedia("profile",data,accessToken)
            console.log(req)
            setPro(prev=>{prev.image=req.url;return prev})
            setImg(prev => null)
        }
        
    }
    const getStats = async () => {
        const res = await makeGet("follow?stats="+otherUser,accessToken)
        setStats(prev => res)
    }
    const handleFollow = async () => {
        const res = await makePost("follow",{star_id:otherUser},accessToken)
        setStats(prev => { return {...prev,followed:true,followers:prev.followers+1} })

    }
    useEffect(()=>{
        grabPro()
        getStats()
    },[otherUser])
  return (
    <div className='flex flex-col items-center'>
        { pro &&
            <div className='flex flex-col'>
                <img src={`http://127.0.0.1:8000${pro.image}`} className="h-[300px]" />
                <div className='flex gap-5 items-center mb-5'>
                    <h1 className='text-2xl text-bold text-center'>{pro.name}</h1>
                    <h1 className='text-lg text-center'>Followers:{stats.followers}</h1>
                    <h1 className='text-lg text-center'>Following:{stats.following}</h1>
                    <button className={`${stats.followed || otherUser==currUser ?'hidden':''} text-black bg-green-600 hover:scale-[1.05] rounded-lg p-1 hover:bg-green-200`} onClick={handleFollow}>Follow</button>
                </div>

                
                
                {
                    currUser == otherUser &&
                    <div className='flex mt-2 items-center gap-3'>
                        change photo: <input type="file" onChange={(evt) => setImg(evt.target.files[0])} /> 
                        <h1 className='underline cursor-pointer' onClick={onImageChange}>upload</h1>
                    </div>
                }
               
                
                {   !tedit && currUser==otherUser && 
                    <div className='flex mt-1 items-center gap-3'>
                        Your Name is : <h1 className='text-2xl text-bold'>{pro.name}</h1>
                        <h1 className='underline cursor-pointer' onClick={()=>setTedit(!tedit)}>edit</h1>
                    </div>
                    ||
                    currUser==otherUser &&
                    <div className='flex mt-10 items-center gap-3'>
                        Your Name will be : <input type="text" ref={smya} placeholder='type your prefered name' />
                        <h1 className='underline cursor-pointer' onClick={onNameChange}>change</h1>
                    </div>
                }
                    
            </div>
        }
        
    </div>
  )
}

export default Profile