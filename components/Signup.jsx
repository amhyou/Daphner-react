import React, { useEffect, useState } from 'react'
import getToken,{signup} from "../services/auth"

const Signup = ({setAccessToken,setRelogin}) => {

    const handleSubmit = (e)=>{
        e.preventDefault()
        console.log(e.target.email.value)
        console.log(e.target.pass.value)
        const does = async ()=>{
            const data = await getToken(e.target.email.value,e.target.pass.value)
            if(data.hasOwnProperty("detail")) setErr(prev=>data.detail)
            else{
                console.log(data)
                setAccessToken(data.access)
                localStorage.setItem("token",data.access)
                setErr(prev=>"")
                setRelogin(prev=>3)
            }
        }
        const create = async ()=>{
            const data = await signup(e.target.name.value,e.target.email.value,e.target.pass.value)
            if(data.msg!="successfully created") setErr(prev=>data.msg)
            else{
                console.log(data)
                does()
            }
        }
        create()
        
    }

    const [err,setErr] = useState("")

  return (
    <div className='h-screen flex flex-col'>
        <div className='h-[35%] w-[50%] mx-auto my-auto'>
            <form method="post" onSubmit={handleSubmit} className='flex flex-col gap-5 justify-start'>
                <h1 className='text-xl'>SignUp</h1>
                <div className='flex flex-col'>
                    <h1>Name:</h1>
                    <input name="name" type="text" className='py-2' required />
                </div>
                <div className='flex flex-col'>
                    <h1>Email:</h1>
                    <input name="email" type="email" className='py-2' required />
                </div>
                <div className='flex flex-col'>
                    <h1>Password:</h1>
                    <input name="pass" type="password" className='py-2' required />
                </div>
                
                <button type='submit' className='bg-yellow-500 rounded-md w-[30%] hover:bg-yellow-800'>signup</button>
                <h1 className='text-red-500'>{err}</h1>
                <h1 className=' underline cursor-pointer' onClick={()=>setRelogin(prev=>1)}>login</h1>
            </form>
        </div>
    </div>
  )
}

export default Signup