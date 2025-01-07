"use client"

import Marquee from "react-fast-marquee"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from "@fortawesome/free-solid-svg-icons";
// import { useModalContext } from "@/context/ModalContext";
import { useSession } from 'next-auth/react';
import { useModalStore } from "@/store/store";

export default function MarqueeWrapper({marqueeData} : {marqueeData : {[key:string]: any}[]}){
  const { data: session } = useSession();
  // const { setModalShow, setModalType, setImgId, setImgSrc} : any = useModalContext()
  const stores = useModalStore((state)=>state);
  const {modalOpen, setModalType, selectImg, setSelectImg} = stores;
  const handleModalOpen = (e: React.MouseEvent<HTMLDivElement>) => {
    modalOpen();
    const $img = e.target as HTMLElement;
    session ? setModalType('like') : setModalType('login');
    setSelectImg($img?.getAttribute('img-id'),$img?.getAttribute('src'))
    // setImgId(String($img?.getAttribute('img-id')))
    // setImgSrc(String($img?.getAttribute('src')))
  }
  return (
    <>
      {
        marqueeData.map((data,index)=>(
          <div key={index} className={`${index === 1 ?'max-[600px]:hidden':''}`}>
            <Marquee direction={index%2? 'left': 'right'} key={index}>
              {data.map((photo : {[key: string]: any},index : number)=>(
                <div key={index} className='w-64 h-64 relative overflow-hidden group cursor-pointer' onClick={(e)=>{handleModalOpen(e)}}>
                  <img src={photo?.src?.large} img-id={photo.id} className='w-full h-full object-cover transition duration-500 group-hover:scale-[1.15]'/>
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