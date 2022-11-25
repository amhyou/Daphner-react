import { data } from 'autoprefixer';
import React, { useEffect, useState } from 'react'
import SelectSearch from 'react-select-search';
import 'react-select-search/style.css'
import Message from './Message';
import { makeGet,makePost,makeDelete } from '../services/auth';
import { AiFillDelete } from "react-icons/ai"
import { HiOutlineStatusOnline } from "react-icons/hi"

const Conversation = ({accessToken,ws,showOtherProfile}) => {
    const [opts,setOpts] = useState([])
    const [convs,setConvs] = useState([])
    const [partner,setPartner] = useState()

    const handleNewUserCon = (e) => {
        console.log(e)
        setOpts(prev => prev.map(elm => e.who=="user"+elm.value ? {...elm,online:e.what} : elm))
        setConvs(prev => prev.map(elm => e.who=="user"+elm.value ? {...elm,online:e.what} : elm))
        setPartner(prev => e.who=="user"+prev.value ? {...prev,online:e.what} : prev)
    }
    useEffect(()=>{
        const partners = async ()=>{
            const res1 = await makeGet('partners',accessToken)
            const opts = res1.map(elm=>{return {name:elm.name,value:elm.id,img:elm.image}})
            const res2 = await makeGet("conversation",accessToken)
            const convs = res2.map(elm=>{return {name:elm.name,value:elm.id,img:elm.image}})
            setOpts(prev=>opts)
            setConvs(prev=>convs)
            setPartner(prev=>convs[0])
        }
        partners()
        if(ws){
            ws.onmessage = e => {
                if(e.event=="online") handleNewUserCon()
            }
        }
        
    },[])
    
    const createConversation = (e)=>{
        const conv = opts.filter(elm => elm.value==e ) [0]
        console.log(conv)
        // add it to convs   &  remove it from opts
        setConvs(prev => [conv,...prev])
        setOpts(prev => prev.filter(elm => elm.value!=e))

        // make post request to create conversation
        const create = async ()=>{
            const req = await makePost("conversation",{partner:e},accessToken)
            console.log(req)
        }
        create()
        // focus on it to message
        setPartner(prev=>conv)
    }
    const deleteConversation = async (elm) => {
        const msg = await makeDelete("conversation",{partner:elm.value},accessToken)
        console.log(msg)
        setOpts(prev=>[...prev,elm])
        setConvs(prev=>{const newconv = prev.filter(e => e.value!=elm.value );setPartner(prev=>newconv[0]);return newconv })
        ws.send(JSON.stringify({to:"user"+String(partner.value),msg:"conv deleted",event:"chatdel"}))
    }
  return (
    <div className='ml-[25%] h-screen max-h-screeen flex flex-col'>
        <h1 className="text-xl ml-5 pt-5 mb-5">Conversations</h1>
        <SelectSearch options={opts} search="true" onChange={createConversation} placeholder="Choose your language" />
        <div className='flex flex-grow'>
            <div className='flex flex-col pt-7 items-start gap-5 w-full max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-700 scrollbar-track-blue-300'>
                {
                    convs.map((elm,key)=>{ return (
                        <div key={key} className='flex items-center flex-between'>
                            <div onClick={()=>setPartner(prev=>elm)} className='flex items-center border-solid border-3 border-zinc-800 rounded-lg hover:bg-stone-700 cursor-pointer'>
                                {/* <HiOutlineStatusOnline size="15" color={`${elm.online ? "green" : "red"}`} /> this is for connected feature  */}
                                <img src={`http://127.0.0.1:8000${elm.img}`} className="h-[50px]" />
                                <h1 className='text-xl ml-5'>{elm.name}</h1>
                            </div>
                            <AiFillDelete size="30" className='ml-7 hover:bg-cyan-600' onClick={()=>deleteConversation(elm)} />
                        </div>
                    )})
                }
                
            </div>
            <Message showOtherProfile={showOtherProfile} setOpts={setOpts} setPartner={setPartner} setConvs={setConvs} ws={ws} partner={partner} accessToken={accessToken} />
        </div>
    </div>
  )
}

export default Conversation