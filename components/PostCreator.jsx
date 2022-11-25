import React, { useRef, useState } from 'react'
import { makeMedia } from '../services/auth'
const PostCreator = ({accessToken,setPosts}) => {
    const [img,setImg] = useState(null)
    const post = useRef(null)
    const [result , setResult ] = useState("")
    const handlePost = async()=>{
        console.log(img,post.current.value)
        if(img && post.current.value){
            const data = new FormData()
            data.append('img',img,img.name)
            data.append('msg',post.current.value)
            const resp = await makeMedia("click",data,accessToken)
            console.log(resp)
            setResult(prev => "post succesfully published")
            setPosts(prev=>[resp.new,...prev])
        }
        post.current.value = ""
        setImg(prev => null)
        
    }
  return (
    <div className='border-y-solid border-y-2 border-y-white py-5'>
        <h1 className="text-2xl">Share your thought with the community</h1>
        <div className='flex flex-col justify-center px-10 mt-10'>
            <textarea type="text" ref={post} placeholder='what do you have in mind ?' />
            <input type="file" onChange={(e)=>setImg(e.target.files[0])} placeholder='text section' />
            <button onClick={handlePost} className="mt-2 p-3 rounded-xl bg-lime-900 hover:bg-green-800">share</button>
            <h1 className='text-red-500'>{result}</h1>
        </div>
    </div>
  )
}

export default PostCreator