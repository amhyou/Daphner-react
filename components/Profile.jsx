import React, { useEffect, useRef, useState } from 'react'
import { makeGet, makePost,makeMedia } from '../services/auth'

const Profile = ({accessToken}) => {
    const [pro,setPro] = useState()
    const [tedit,setTedit] = useState(false)
    const [img , setImg] = useState()
    const grabPro = async ()=>{
        const req = await makeGet("profile",accessToken)
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
    useEffect(()=>{
        grabPro()
    },[])
  return (
    <div className='ml-[25%] h-screen max-h-screeen flex flex-col items-center'>
        { pro &&
            <div className='flex flex-col mt-10'>
                <img src={`http://127.0.0.1:8000${pro.image}`} className="h-[350px]" />
                
                <div className='flex mt-2 items-center gap-3'>
                    change photo: <input type="file" onChange={(evt) => setImg(evt.target.files[0])} /> 
                    <h1 className='underline cursor-pointer' onClick={onImageChange}>upload</h1>
                </div>
                
                {   !tedit && 
                    <div className='flex mt-10 items-center gap-3'>
                        Your Name is : <h1 className='text-2xl text-bold'>{pro.name}</h1>
                        <h1 className='underline cursor-pointer' onClick={()=>setTedit(!tedit)}>edit</h1>
                    </div>
                    ||
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