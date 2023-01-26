import React, { useEffect, useState } from 'react'
import { makeGet,makePost,backend } from '../services/auth'
import { AiFillCloseCircle } from "react-icons/ai"

const Share = ({post,accessToken,setEngagedPost,ws,setPosts,currUser}) => {
    const [shares,setShares] = useState([])
    const getShares = async () => {
        if (post){
            const res = await makeGet("click/"+post.id+"/share",accessToken)
            console.log(res)
            setShares(prev => res)
        }
        
    }

    const handleShare = async (elm)=>{
        // update the post likes in database && notif
        const res = await makePost("click/"+elm.id+"/share",{},accessToken) 
        console.log(res)

        // update the post likes in frontend
        setShares(prev=> [res.new,...prev] )
        setPosts(prev => {
            return prev.map(e=> e.id == elm.id ? {...e,shares:e.shares+1 } : e )
        })
        
        // send event notification to owner
        ws.send(JSON.stringify({to:"user"+String(elm.owner),msg: currUser+" shared your post "+elm.id,event:"shareNotif"}))
    }

    useEffect(()=>{
        getShares()
    },[post])
  return (
    <div className={`fixed left-0 top-0 w-full h-full backdrop-blur-2xl ${post ? 'scale-1' : 'scale-0'} duration-300 ease-in-out`}>
        <div className='w-[50%] h-[60%] mt-[25vh] mx-auto flex flex-col bg-gray-900 pb-5 gap-10 overflow-auto rounded-lg scrollbar-thin'>
            <div className='flex items-center justify-end' onClick={()=>setEngagedPost(null)}>
                <AiFillCloseCircle size="20" />
                <h1 className='underline cursor-pointer'>close</h1>
            </div>
            { 
                post && post.owner == currUser ? <h1 className='text-green-500 text-center'>you can't reshare you own post</h1>
                :
                !shares.some(sh => sh.sender.id == currUser) ? <button className={`bg-green-200 mx-auto px-5 rounded-md hover:bg-green-100`} onClick={()=>handleShare(post)}>Confirm Share</button> 
                :
                <h1 className='text-green-500 text-center'>you already shared this post</h1>
            }
            
            
            <div className='flex flex-col gap-5 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-700 scrollbar-track-blue-300'>
            {
                shares.length && shares.map((elm,key) => {return(
                    <div key={key} className='flex items-center gap-2 justify-center'>
                        <img className='h-[30px]' src={`http://${backend+elm.sender.image}`} />
                        <h1 className='text-white text-center underline cursor-pointer'>{elm.sender.name}</h1>
                        <p>published it at {elm.time.slice(0,16)}</p>
                    </div>
                )})
                ||
                <h1 className='text-center'>you are the first person to share this post.</h1>
            }
            </div>
        </div>
    </div>
  )
}

export default Share