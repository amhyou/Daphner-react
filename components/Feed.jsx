import React, { useEffect, useState } from 'react'
import { makeGet, makePost } from '../services/auth'
import PostCreator from './PostCreator'
import { BiLike,BiCommentDetail,BiShareAlt } from "react-icons/bi"
import Share from './Share'
import Comment from './Comment'

const Feed = ({accessToken,currUser,ws}) => {
    const [posts,setPosts] = useState([])
    const [engagedPost , setEngagedPost] = useState(null)
    const [toCommentPost , setToCommentPost] = useState(null)

    const getPosts = async()=>{
        // get 10 posts from db
        const poz = await makeGet("feed?nb=10",accessToken)
        console.log(poz)
        setPosts(prev => poz)
    }
    useEffect(()=>{
        getPosts()
    },[])
    const handleLike = async (elm)=>{
        // update the post likes in database && notif
        const res = await makePost("click/"+elm.id+"/like",{},accessToken) 

        // update the post likes in frontend
        setPosts(prev => {
            return prev.map(e=> e.id == elm.id ? {...e,likes:e.likes+res.diff } : e )
        })
        
        // send event notification to owner
        ws.send(JSON.stringify({to:"user"+elm.owner,msg: currUser+" liked your post "+elm.id,event:"likeNotif"}))
    }


  return (
    <div className={`ml-[20%] h-screen max-h-screeen flex justify-between`}>
        <Share accessToken={accessToken} currUser={currUser} setPosts={setPosts} ws={ws} post={engagedPost} setEngagedPost={setEngagedPost} />
        <Comment accessToken={accessToken} currUser={currUser} setPosts={setPosts} ws={ws} post={toCommentPost} setEngagedPost={setToCommentPost} />
        <div className='flex flex-col items-center flex-1 border-x-solid border-x-white border-x-2 overflow-auto scrollbar-thin scrollbar-thumb-blue-700 scrollbar-track-blue-300 '>
            <PostCreator accessToken={accessToken} />
        
            {   posts &&
                posts.map((elm,key)=>{return(
                    <div key={key} className='flex flex-col gap-2 px-10 mt-5'>
                        <div className='flex items-center'>
                            <img className='h-[35px] ml-5 mr-1' src={`http://127.0.0.1:8000${elm.owners.image}`} />
                            <h1 className='text-md underline cursor-pointer'>{elm.owners.name}</h1>
                            <div className={`${elm.owner != elm.origin ? 'flex items-center':'hidden' } `}>
                                <p className='ml-2'>shared from</p>
                                <img className='h-[35px] ml-1  mr-1' src={`http://127.0.0.1:8000${elm.origins.image}`} />
                                <h1 className='text-md underline cursor-pointer'>{elm.origins.name}</h1>
                            </div>
                        </div>
                        
                        <h1 className='text-md'>{elm.msg}</h1>
                        <img className='rounded-xl ' src={`http://127.0.0.1:8000${elm.image}`} />
                        <div className='flex gap-5 justify-evenly border-solid border-2 border-neutral-400'>
                            <div className='flex items-center gap-1 hover:scale-[1.5] cursor-pointer bg-fuchsia-200 rounded-md p-2' onClick={()=>{handleLike(elm)}}>
                                <h1>{elm.likes}</h1>
                                <BiLike />
                            </div>
                            <div className='flex items-center gap-1 hover:scale-[1.5] cursor-pointer bg-fuchsia-200 rounded-md p-2' onClick={()=>{setToCommentPost(elm)}}>
                                <h1>{elm.comments}</h1>
                                <BiCommentDetail />
                            </div>
                            <div className='flex items-center gap-1 hover:scale-[1.5] cursor-pointer bg-fuchsia-200 rounded-md p-2' onClick={()=>{setEngagedPost(elm)}}>
                                <h1>{elm.shares}</h1>
                                <BiShareAlt />
                            </div>
                        </div>
                    </div>
                )})
            }
        </div>
        <div id="topclick-topprofiles" className='flex flex-col flex-[.4] items-center'>
            <div className='flex flex-col flex-[.65]'>
                <h1 className='text-2xl text-bold'>Trends for you</h1>
                
            </div>
            <div className='flex flex-col flex-[.35]'>
                <h1 className='text-2xl text-bold'>Who to follow</h1>
            </div>
        </div>
    </div>
  )
}

export default Feed