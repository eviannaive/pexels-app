"use client"
import Image from 'next/image'
import axios from "axios";

import { ButtonExplore } from '@/components/Buttons'
import { TextTitle } from '@/components/Text'
import { ModalContextProvider } from "@/context/ModalContext"
import { MarqueeWrapper } from '@/components/MarqueeWrapper';
import { useEffect, useRef, useState } from 'react';
import { ModalWrapper } from "@/components/ModalWrapper";

const pexelsKey = process.env.NEXT_PUBLIC_PEXELS_KET;

const randomPage = () => {
  return Math.floor(Math.random()*50)
}

const initPhoto = async () => {
  let result = await axios.get("https://api.pexels.com/v1/curated?page="+randomPage()+"&per_page=30",{
    headers:{
      Authorization: pexelsKey
    }
  })
  return result.data.photos
}


export default function Home() {
  const initOnce = useRef(false)
  const [ data, setData ] = useState([])
  const marqueeData = async() => {
    const dataArr = await Promise.all(Array(2).fill(null).map(d=>initPhoto()));
    setData(dataArr)
    initOnce.current = true
  }
  useEffect(()=>{
    if(!initOnce.current){
      marqueeData();
    }
  },[])

  return (
    <ModalContextProvider>
      <div className="flex flex-col w-full min-h-custom">
        <ModalWrapper/>
        <MarqueeWrapper data={data}/>
        <div className='flex flex-col grow justify-center items-center my-[50px]'>
          <TextTitle text="Collect your favorite pictures." delay={1} />
          <ButtonExplore text="FIND MORE" delay={1.5} target="/photos" />
        </div>
      </div>
    </ModalContextProvider>
  )
}
