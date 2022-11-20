import React, { useEffect, useState } from 'react'
import getToken from "../services/auth"

const Login = ({setAccessToken,setRelogin}) => {

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
                setRelogin(prev=>2)
            }
        }
        does()
    }

    const [err,setErr] = useState("")

  return (
    <div className='h-screen flex flex-col'>
        <div className='h-[35%] w-[50%] mx-auto my-auto'>
            <form method="post" onSubmit={handleSubmit} className='flex flex-col gap-5 justify-start'>
                <h1 className='text-xl'>Login</h1>
                <div className='flex flex-col'>
                    <h1>Email:</h1>
                    <input name="email" type="email" className='py-2 text-black' required />
                </div>
                <div className='flex flex-col'>
                    <h1>Password:</h1>
                    <input name="pass" type="password" className='py-2 text-black' required />
                </div>
                <button type='submit' className='bg-yellow-500 rounded-md w-[30%] hover:bg-yellow-800'>Submit</button>
                <h1 className='text-red-500'>{err}</h1>
                <h1 className=' underline cursor-pointer' onClick={()=>setRelogin(prev=>0)}>create one</h1>
            </form>
        </div>
    </div>
  )
}

export default Login