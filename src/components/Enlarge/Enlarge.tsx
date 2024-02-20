"use client"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart,faDownload  } from "@fortawesome/free-solid-svg-icons";
import { faHeart as reqularHeart} from "@fortawesome/free-regular-svg-icons";
import { useAnimate } from "framer-motion"

export default function Enlarge(){
  let [ scope, animate] = useAnimate();

  const modalClose = async() => {
    await animate([[scope.current, { opacity: 0 }]])
  }

  return(
    <div className={`fixed w-full h-full top-0 left-0 z-[100] flex bg-zinc-800/90 opacity-100 justify-center items-center p-[30px] pt-[80px] duration-300`} ref={scope}>
      <button className='absolute top-[20px] right-[30px] text-white text-2xl opacity-60 hover:opacity-100' onClick={modalClose}>✕</button>
      <div className="flex flex-col w-full h-full justify-center items-center">
        <img src="https://images.pexels.com/photos/1704120/pexels-photo-1704120.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt="" className='w-full h-enlarge object-contain'/>
        <div className='flex transition duration-500 group-hover:opacity-100 gap-3 ml-auto mt-[10px]'>
          <div className='opacity-60 hover:opacity-100 transition-all'>
            <FontAwesomeIcon icon={reqularHeart}  size="lg" color="#f9f9f9"/>
          </div>
          <div className='hidden'>
            <FontAwesomeIcon icon={faHeart} size="lg" color="#e61e7b"/>
          </div>
          <div className='opacity-75 hover:opacity-100 transition-all'>
            <FontAwesomeIcon icon={faDownload} size="lg" color="#f9f9f9"/>
          </div>
        </div>

      </div>
    </div>
  )

}