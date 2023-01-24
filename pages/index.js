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
import Notification from '../components/Notification'
import FeedProfile from '../components/FeedProfile'


export default function Home() {
  const [accessToken,setAccessToken] = useState("")
  const [relogin,setRelogin] = useState(1)
  const [ws,setWs] = useState("")
  const [currUser , setCurrUser] = useState(0)
  const [otherUser,setOtherUser ] = useState(0)
  const [section,setSection] = useState(1)

  const showOtherProfile = (other)=>{
    setSection(prev => 4)
    setOtherUser(prev => other)
  }
  useEffect(()=>{
    const tk = localStorage.getItem('token')
    setAccessToken(prev=> {
      const newv = tk ? tk : prev
      if(!newv){
        setRelogin(prev => 1)
      }
      else{
        try{
          const decoded = jwt_decode(newv)
          const userid = decoded.user_id
          if (decoded.exp*1000 < Date.now()){
            setRelogin(prev => 1)
            localStorage.removeItem("token")
            return ""
          }
          else{
            setCurrUser(prev=>userid)
            setRelogin(prev => 2)
          }
        }
        catch{
          setRelogin(prev => 1)
          localStorage.removeItem("token")
          return ""
        }
        
      }
      return newv
    })
    
  },[])
  
  useEffect(()=>{
    if(relogin==2){
      const sock = new WebSocket("wss://daphner.azurewebsites.net/realtime?token="+accessToken)
    
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
        <Navigation showOtherProfile={showOtherProfile} currUser={currUser} setSection={setSection} accessToken={accessToken} setRelogin={setRelogin} />
        { 
          section==2 && <Conversation showOtherProfile={showOtherProfile} ws={ws} currUser={currUser} accessToken={accessToken} />
          ||
          section==4 && <FeedProfile showOtherProfile={showOtherProfile} otherUser={otherUser} ws={ws} currUser={currUser} accessToken={accessToken} />
          ||
          section==1 && <Feed showOtherProfile={showOtherProfile} ws={ws} currUser={currUser} accessToken={accessToken} />
          ||
          section==3 && <Notification showOtherProfile={showOtherProfile} ws={ws} accessToken={accessToken} />
        }
        
        </>
      }
      
    </div>
  )
}
