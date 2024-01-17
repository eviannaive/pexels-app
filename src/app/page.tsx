"use client"

import Image from 'next/image'
import axios from "axios";
import Marquee from "react-fast-marquee"
import { useEffect, useState } from 'react';

const pexelsKey = process.env.NEXT_PUBLIC_PEXELS_KET;

const randomPage = () => {
  return Math.floor(Math.random()*50)
}

export default function Home() {
  let [dataLine1, setDataLine1] = useState([])
  let [dataLine2, setDataLine2] = useState([])
  const initPhoto = async (setData) => {
    let result = await axios.get("https://api.pexels.com/v1/curated?page="+randomPage()+"&per_page=15",{
      headers:{
        Authorization: pexelsKey
      }
    })
    setData(result.data.photos)
  }
  useEffect(()=>{
    initPhoto(setDataLine1)
    initPhoto(setDataLine2)
  },[])
  return (
    <main className="min-h-screen pt-[68px] bg-gradient-to-br from-violet-700/20 to-cyan-700/30">
      <Marquee>
        {dataLine1.map((photo)=>(
          <div className='w-64 h-64 relative overflow-hidden'>
            <img src={photo.src.large} className='w-full h-full object-cover transition duration-500 hover:scale-[1.15]'/>
          </div>
        ))}
      </Marquee>
      <Marquee direction='right'>
        {dataLine2.map((photo)=>(
          <div className='w-64 h-64 relative overflow-hidden'>
            <img src={photo.src.large} className='absolute top-0 left-0 w-full h-full object-cover transition duration-500 hover:scale-[1.15]'/>
          </div>
        ))}
      </Marquee>
      <button className='rounded-full bg-[length:350px_120px] bg-left-top bg-gradient-to-br from-violet-500 to-pink-500 px-10 py-3 text-xl text-white tracking-wider font-bold my-[80px] ml-[50%] translate-x-[-50%] transition-all duration-500 hover:scale-[1.05] hover:bg-right-bottom'>EXPLORE</button>
    </main>
  )
}
