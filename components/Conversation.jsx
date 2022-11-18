import { data } from 'autoprefixer';
import React, { useEffect, useState } from 'react'
import SelectSearch from 'react-select-search';
import 'react-select-search/style.css'
import Message from './Message';

const Conversation = () => {
    const [opts,setOpts] = useState([])
    const options = [
        {name: 'Swedish', value: 'sv'},
        {name: 'English', value: 'en'},
    ];
    useEffect(()=>{
        const partners = async ()=>{
            const datas = await fetch('http://127.0.0.1:8000/api/partners')
            const djson = await datas.json()
            let opts = djson.data.map(elm=>{return {name:elm.name,value:elm.id,img:elm.image}})
            console.log(opts)
            setOpts(prev=>opts)
        }
        //partners()
        
    },[])
    
    const seech = (e)=>{
        console.log(e)
        if(e=="sv") setOpen((prev)=>!prev)
    }
  return (
    <div className='ml-[25%] h-screen flex flex-col'>
        <h1 className="text-xl ml-5 pt-5 mb-5">Conversations</h1>
        <SelectSearch options={opts} search="true" onChange={seech} placeholder="Choose your language" />
        <div className='flex flex-grow'>
            <div className='flex flex-col pt-7 items-center gap-5'>
                {
                    opts.map((elm,key)=>{ return (
                        <div key={key} className='flex items-center border-solid border-3 border-zinc-800 hover:bg-stone-700 cursor-pointer'>
                            <img src={`http://127.0.0.1:8000${elm.img}`} className="h-[50px]" />
                            <h1 className='text-xl ml-5'>{elm.name}</h1>
                        </div>
                    )})
                }
                
            </div>
            <Message />
        </div>
    </div>
  )
}

export default Conversation