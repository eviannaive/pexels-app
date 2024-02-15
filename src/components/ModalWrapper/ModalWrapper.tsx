"use client"

import { useModalContext } from "@/context/ModalContext";
import { useRouter} from "next/navigation"
import { useEffect } from "react";
import delay from "@/lib/delay";
import { useAnimate } from "framer-motion"

export default function ModdleWrapper(){
  const { modalShow, setModalShow } : any = useModalContext();
  const router = useRouter()
  let [ scope, animate] = useAnimate();

  const modalClose = async() => {
    if(modalShow){
      await animate([['#modalBox',{ scale: 0}],[scope.current, { opacity: 0 }]])
      setModalShow(false)
    }
  }

  const goLoginPage = async() => {
    await modalClose();
    await delay(300)
    router.push('/login')
  }

  useEffect(()=>{
    if(modalShow){
      console.log('open')
      animate([[scope.current, { opacity: 1 }],['#modalBox',{ scale: 1 }]])
    }
  },[modalShow])
  return(
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
    </>

  )
}