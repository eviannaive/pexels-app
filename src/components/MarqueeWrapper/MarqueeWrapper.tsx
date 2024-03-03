"use client"

import Marquee from "react-fast-marquee"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { useModalContext } from "@/context/ModalContext";
import { useSession } from 'next-auth/react';


export default function MarqueeWrapper({data}){
  const { data: session } = useSession();
  const { modalShow, setModalShow, modalType, setModalType, imgId, setImgId, imgSrc, setImgSrc} : any = useModalContext()
  const modalOpen = (e: MouseEvent) => {
    console.log(String(e.target?.getAttribute('img-id')))
    setModalShow(true);
    session ? setModalType('like') : setModalType('login');
    setImgId(String(e.target?.getAttribute('img-id')))
    setImgSrc(String(e.target?.getAttribute('src')))
  }
  return (
    <>
      {
        data.map((data,index)=>(
          <div key={index} className={`${index === 1 ?'max-[600px]:hidden':''}`}>
            <Marquee direction={index%2? 'left': 'right'} key={index}>
              {data.map((photo,index)=>(
                <div key={index} className='w-64 h-64 relative overflow-hidden group cursor-pointer' onClick={(e)=>{modalOpen(e)}}>
                  <img src={photo.src.large} img-id={photo.id} className='w-full h-full object-cover transition duration-500 group-hover:scale-[1.15]'/>
                  <div className='flex absolute bottom-0 right-2 p-[10px] opacity-0 transition duration-300 group-hover:opacity-100 pointer-events-none'>
                    <FontAwesomeIcon icon={faHeart} size="lg" color="#e61e7b"/>
                  </div>
                </div>
              ))}
            </Marquee>
          </div>
        ))
      }
      
    </>
  )
}