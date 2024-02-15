"use client"

import Marquee from "react-fast-marquee"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { useModalContext } from "@/context/ModalContext";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation"
import delay from "@/lib/delay";
import { useAnimate } from "framer-motion"

export default function MarqueeWrapper({data}){
  const router = useRouter();
  const [ scope, animate] = useAnimate()
  const { modalLogin, setModalLogin } = useModalContext()
  const modalShow = useMemo(()=>{
    return modalLogin
  },[modalLogin])
  const modalClose = async() => {
    if(modalShow){
      await animate([['#modalBox',{ scale: 0}],[scope.current, { opacity: 0 }]])
      setModalLogin(false)
    }
  }
  const goLoginPage = async() => {
    await modalClose();
await delay(400)
    router.push('/login')
  }
  useEffect(()=>{
    if(modalShow){
      animate([[scope.current, { opacity: 1 }],['#modalBox',{ scale: 1 }]])
    }
  },[modalShow])
  return (
    <>
      {
        modalShow && (
          <div className={`fixed w-full h-full top-0 left-0 z-[100] flex bg-slate-600/70 opacity-0 justify-center items-center p-[30px] duration-300`} ref={scope}>
            <div className="w-full max-w-80 bg-white rounded-2xl p-[30px] text-lg relative text-default text-center scale-0 duration-300" id="modalBox">
              <button className="bg-stone-700 text-white rounded-full absolute w-[40px] h-[40px] top-[-10px] right-[-10px] flex-center" onClick={modalClose}>✕</button>
              <p>
                Please log in first.
              </p>
              <button className="inline-block bg-orange-600/70 text-white rounded-50px py-[5px] px-[30px] mt-[20px]" onClick={goLoginPage}>ok
              </button>
            </div>
          </div>
        )
      }
      {
        data.map((data,index)=>(
          <Marquee direction={index%2? 'left': 'right'} key={index}>
            {data.map((photo,index)=>(
              <div className='w-64 h-64 relative overflow-hidden group cursor-pointer' key={index} onClick={()=>{setModalLogin(true)}}>
                <img src={photo.src.large} className='w-full h-full object-cover transition duration-500 group-hover:scale-[1.15]'/>
                <div className='flex absolute bottom-0 right-2 p-[10px] opacity-0 transition duration-300 group-hover:opacity-100'>
                  <FontAwesomeIcon icon={faHeart} size="lg" color="#e61e7b"/>
                </div>
              </div>
            ))}
          </Marquee>
        ))
      }
      
    </>
  )
}