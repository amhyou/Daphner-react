import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import Conversation from '../components/Conversation'
import Navigation from '../components/Navigation'
import Login from "../components/Login"
import Signup from "../components/Signup"
import jwt_decode from "jwt-decode";
import Profile from '../components/Profile'
import Feed from '../components/Feed'


export default function Home() {
  const [accessToken,setAccessToken] = useState("")
  const [relogin,setRelogin] = useState(1)
  const [ws,setWs] = useState("")
  const [currUser , setCurrUser] = useState(0)
  const [section,setSection] = useState(1)
  useEffect(()=>{
    const tk = localStorage.getItem('token')
    setAccessToken(prev=> {
      const newv = tk ? tk : prev
      if(!newv){
        setRelogin(prev => 1)
      }
      else{
        setRelogin(prev => 2)
      }
      return newv
    })
    
  },[])
  
  useEffect(()=>{
    if(relogin==2){
      const sock = new WebSocket("ws://127.0.0.1:8000/realtime?token="+accessToken)
      const decoded = jwt_decode(accessToken)
      const userid = decoded.user_id
      console.log(userid)
      setCurrUser(prev=>userid)
      setWs(prev=>sock)
    }
  },[accessToken])
  return (
    <div className=' bg-slate-900 text-white'>
      {
        relogin==0 && <Signup setAccessToken={setAccessToken} setRelogin={setRelogin} />
        ||
        relogin==1 && <Login setAccessToken={setAccessToken} setRelogin={setRelogin} />
        ||
        relogin==2 &&
        <>
        <Navigation accessToken={accessToken} />
        { 
          section==3 && <Conversation ws={ws} currUser={currUser} accessToken={accessToken} />
          ||
          section==4 && <Profile accessToken={accessToken} />
          ||
          section==1 && <Feed ws={ws} currUser={currUser} accessToken={accessToken} />
        }
        
        </>
      }
      
    </div>
  )
}
