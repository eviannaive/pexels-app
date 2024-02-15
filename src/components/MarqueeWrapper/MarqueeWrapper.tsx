"use client"

import Marquee from "react-fast-marquee"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { useModalContext } from "@/context/ModalContext";
import { ModalWrapper } from "../ModalWrapper";

export default function MarqueeWrapper({data}){
  const { modalShow, setModalShow } : any = useModalContext()
  return (
    <>
      <ModalWrapper/>
      {
        data.map((data,index)=>(
          <Marquee direction={index%2? 'left': 'right'} key={index}>
            {data.map((photo,index)=>(
              <div className='w-64 h-64 relative overflow-hidden group cursor-pointer' key={index} onClick={()=>{setModalShow(true)}}>
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