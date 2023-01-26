import React, { useEffect, useState,useRef } from 'react'
import { AiOutlineSend } from "react-icons/ai"
import { MdAccessAlarm } from 'react-icons/md'
import { makeGet, makePost,backend } from '../services/auth'
import { FiRefreshCcw } from 'react-icons/fi'
const Message = ({partner,accessToken,ws,setConvs,setPartner,setOpts,showOtherProfile}) => {
  const [msgs,setMsgs] = useState([])

  const createMessage = async (e) => {
    if(e.key == "Enter" && e.target.value){
      console.log(e.target.value)
      const msg = await makePost("message",{partner:partner.value,msg:e.target.value},accessToken)
      if(msgs.length==0){
        ws.send(JSON.stringify({to:"user"+String(partner.value),msg: e.target.value,event:"chatcrt"}))
      }
      else{
        ws.send(JSON.stringify({to:"user"+String(partner.value),msg: e.target.value,event:"chat"}))
      }
      
      setMsgs(prev => [...prev,msg])
      e.target.value = ""
    }
  }
  const getMsg = async ()=>{
    if(!partner) return
    const msg = await makeGet("message?partner="+String(partner.value),accessToken)
    console.log(msg)
    setMsgs(prev=>msg)
  }
  const handleMessage = (e) => {
    console.log(e)
    if(partner && e.from == "user"+String(partner.value)){
      setMsgs(prev=>[...prev,{issuer:partner.value,msg:e.msg}])
    }
  }
  const handleConvDel = (e) => {
    console.log(e)
    setConvs(prev => { 
      const convs = prev.filter(elm => "user"+elm.value != e.from) 
      setPartner(pr => convs!=[] ? convs[0] : undefined)
      setOpts(pre => [...pre,prev.filter(elm=>"user"+elm.value == e.from)[0]])
      return convs
    })
  }
  const handleConvCrt = (e) => {
    console.log(e)
    setOpts(prev => {
      const opts = prev.filter(elm => "user"+elm.value != e.from)
      setConvs(pre => {
        const convs = [...pre,prev.filter(elm=> "user"+elm.value == e.from)[0]]
        if(convs.length == 1){
          setPartner(pr => convs[0])
        }
        return convs
      } )
      return opts
    })
  }
  useEffect(()=>{
    getMsg()
    if(ws){
      ws.onmessage = e =>{
        const event = JSON.parse(e.data)
        if(event.event=="chat") handleMessage(event)
        else if(event.event=="chatdel") handleConvDel(event)
        else if(event.event=="chatcrt") handleConvCrt(event)
      }
    }
  },[partner])
  const dummy = useRef(null);
  useEffect(() => {
  dummy.current.scrollIntoView({ behavior: "smooth" });
  }, [msgs]); 
  return (
    <div className='max-h-[80vh] mr-5 w-[130%] border-x-solid border-x-2 border-x-white flex flex-col px-3'>
        { partner && msgs!=[] &&
          <div className='flex items-center border-solid border-3 border-zinc-800'>
            <h1 className='text-xl'>Chatting with :</h1>
            <img src={`https://${backend+partner.img}`} className="h-[50px] ml-5 cursor-pointer" onClick={()=>{showOtherProfile(partner.value)}} />
            <h1 className='text-xl ml-2 underline cursor-pointer' onClick={()=>{showOtherProfile(partner.value)}}>{partner.name}</h1>
            <FiRefreshCcw size="30" className='ml-5 hover:bg-teal-600' onClick={getMsg} />          
          </div>
          
        }
        <div className='flex flex-col flex-grow gap-1 mt-5 px-5 pb-10 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-700 scrollbar-track-blue-300'>
          { partner && msgs!=[] &&
             msgs.map((elm,key)=>{ return (
              <div key={key}>
                <h1 className={`text-md ${partner && elm.issuer==partner.value ? "text-left":"text-right"}`}>{partner && elm.issuer==partner.value ? "Him:" : "You:"}   {elm.msg}</h1>
              </div>
          )
          })  

          }
          { !partner &&
          <h1 className='text-center text-2xl mt-20'>choose someone to talk to</h1> }
          <div ref={dummy} /> 
        </div>
        { partner && 
          <div className='flex items-center border-t-solid border-t-2 border-t-white pt-1'>
            <input onKeyDown={createMessage} placeholder='type a message' className='text-black w-full rounded-lg py-3 ml-5' />
            <AiOutlineSend color='black' size="25" className='ml-[-30px] mr-8 hover:bg-slate-700' />
          </div>
          
        }
        
        
    </div>
  )
}

export default Message