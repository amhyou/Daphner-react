import React, { useEffect, useRef, useState } from 'react'
import { makeGet,makePost,backend } from '../services/auth'
import { AiFillCloseCircle } from "react-icons/ai"

const Share = ({post,accessToken,setEngagedPost,ws,setPosts,currUser}) => {
    const [comments,setComments] = useState([])
    const getComments = async () => {
        if (post){
            const res = await makeGet("click/"+post.id+"/comment",accessToken)
            console.log(res)
            setComments(prev => res)
        }
        
    }
    const cmi = useRef(null)
    const handleComment = async (elm)=>{
        if(cmi.current.value){
        // update the post comments in database && notif
        const res = await makePost("click/"+elm.id+"/comment",{msg:cmi.current.value},accessToken) 
        cmi.current.value = ""
        console.log(res)

        // update the post comments in frontend
        setComments(prev=> [res.new,...prev] )
        setPosts(prev => {
            return prev.map(e=> e.id == elm.id ? {...e,comments:e.comments+1 } : e )
        })
        
        // send event notification to owner
        ws.send(JSON.stringify({to:"user"+String(elm.owner),msg: currUser+" commented your post "+elm.id,event:"commentNotif"}))
    
        }
    }

    useEffect(()=>{
        getComments()
    },[post])
  return (
    <div className={`fixed left-0 top-0 w-full h-full backdrop-blur-2xl ${post ? 'scale-1' : 'scale-0'} duration-300 ease-in-out`}>
        <div className='w-[50%] h-[60%] mt-[25vh] mx-auto flex flex-col bg-gray-900 pb-5 gap-10 overflow-auto rounded-lg scrollbar-thin'>
            <div className='flex items-center justify-end' onClick={()=>setEngagedPost(null)}>
                <AiFillCloseCircle size="20" />
                <h1 className='underline cursor-pointer'>close</h1>
            </div>

            <div className='flex justify-center items-center gap-3'>
                <input className='text-black' ref={cmi} placeholder='type your comment' />
                <button className={`bg-green-500 rounded-sm px-2 hover:bg-green-300`} onClick={()=>handleComment(post)}>Comment</button> 
            </div>
            
            
            <div className='flex flex-col gap-5 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-700 scrollbar-track-blue-300'>
            {
                comments.length && comments.map((elm,key) => {return(
                    <div key={key} className='flex items-center gap-2 justify-center'>
                        <img className='h-[30px]' src={`http://${backend+elm.sender.image}`} />
                        <h1 className='text-white text-center underline cursor-pointer'>{elm.sender.name}</h1>
                        <p>: {elm.msg}</p>
                    </div>
                )})
                ||
                <h1 className='text-center'>you are the first person to comment this post.</h1>
            }
            </div>
        </div>
    </div>
  )
}

export default Share