"use client"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart,faDownload  } from "@fortawesome/free-solid-svg-icons";
import { useAnimate } from "framer-motion"
import { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { useModalContext } from "@/context/ModalContext";
import imgValidateError from '@/lib/imgValidateError'
import { AxiosResponse } from 'axios';

export default function Enlarge({state, setEnlargeShow, eventLike}:{state: boolean, setEnlargeShow: Dispatch<SetStateAction<boolean>>, eventLike: (e:MouseEvent)=>void}){
  let [ scope, animate] = useAnimate();
  let imgRef = useRef<any>(null)
  let { imgId, imgSrc, setImgSrc} : any = useModalContext();

  const imgShow = async() => {
    await animate([[imgRef.current, { opacity: 1 }]])
  }

  const imgOnError = async(res: AxiosResponse) => {
    setImgSrc(res.data.src.large)
    imgShow()
  } 

  const modalOpen = async() => {
    await animate([[scope.current, { opacity: 1 }]])
  }

  const modalClose = async() => {
    await animate([[scope.current, { opacity: 0 }]]);
    setEnlargeShow(false)
  }

  useEffect(()=>{
    if(state){
      modalOpen()
    }
  },[state])


  return(
    <>
      {
        state && (
          <div className={`fixed w-full h-full top-0 left-0 z-[100] flex bg-zinc-800/90 opacity-0 justify-center items-center p-[30px] pt-[80px] duration-500`} ref={scope} onClick={modalClose}>
            <button className='absolute top-[20px] right-[30px] text-white text-2xl opacity-60 hover:opacity-100' >✕</button>
            <div className="flex flex-col w-full h-full justify-center items-center" onClick={(e)=>{
              e.stopPropagation();
            }} box-wrap="">
              {/* {createImg()} */}
              <img src={imgSrc} alt="" className='w-full h-enlarge object-contain opacity-0' onLoad={imgShow} onError={()=>{imgValidateError(imgId,imgOnError)}} ref={imgRef} img-id={imgId}/>
              <div className='flex transition duration-500 group-hover:opacity-100 gap-3 ml-auto mt-[10px]'>
                <div className='opacity-60 hover:opacity-100 transition-all cursor-pointer' onClick={eventLike}>
                  <FontAwesomeIcon icon={faHeart} size="lg" color="#f9f9f9" className='pointer-events-none'/>
                </div>
                <div className='hidden'>
                </div>
                <div className='opacity-75 hover:opacity-100 transition-all cursor-pointer'>
                  <FontAwesomeIcon icon={faDownload} size="lg" color="#f9f9f9" className='pointer-events-none'/>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </>
    
  )

}