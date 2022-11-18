import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import Conversation from '../components/Conversation'
import Navigation from '../components/Navigation'
import Login from "../components/Login"
import Signup from "../components/Signup"

export default function Home() {
  const [accessToken,setAccessToken] = useState("")
  const [relogin,setRelogin] = useState(3)
  useEffect(()=>{
    const tk = localStorage.getItem('token')
    setAccessToken(prev=> {
      const newv = tk ? tk : prev
      if(!newv){
        setRelogin(prev => 1)
      }
      return newv
    })
    
  },[])
  return (
    <div className=' bg-slate-900 text-white'>
      {
        relogin==0 && <Signup setAccessToken={setAccessToken} setRelogin={setRelogin} />
        ||
        relogin==1 && <Login setAccessToken={setAccessToken} setRelogin={setRelogin} />
        ||
        <>
        <Navigation />
        <Conversation />
        </>
      }
      
    </div>
  )
}
