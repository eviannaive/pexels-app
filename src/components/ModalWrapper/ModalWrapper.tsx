"use client"

import { useModalContext } from "@/context/ModalContext";
import { useRouter} from "next/navigation"
import { useEffect } from "react";
import delay from "@/lib/delay";
import { useAnimate } from "framer-motion"
import { ButtonDefault } from "../Buttons";
import { useSession } from 'next-auth/react';

export default function ModdleWrapper(){
  const { modalShow, setModalShow, modalType, setModalType } : any = useModalContext();
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
          <div className={`fixed w-full h-full top-0 left-0 z-[100] flex bg-slate-600/70 opacity-0 justify-center items-center p-[30px] duration-300`} ref={scope} modal-type={modalType}>
            <div className="w-full max-w-80 bg-white rounded-2xl p-[30px] text-lg relative text-default text-center scale-0 duration-300" id="modalBox">
              <button className="bg-stone-700 text-white rounded-full absolute w-[40px] h-[40px] top-[-10px] right-[-10px] flex-center" onClick={modalClose}>✕</button>
              {
                modalType == 'login' ? (
                  <div>
                    <p>
                      Please log in first.
                    </p>
                    <button className="inline-block bg-orange-600/70 text-white rounded-50px py-[5px] px-[30px] mt-[20px]" onClick={goLoginPage}>ok
                    </button>
                  </div>
                ) : ''
              }
              {
                modalType == 'like' ? (
                  <div>
                    <div className="flex">
                      <input type="text" className="w-[130px] mr-[5px] focus:outline-none border-b-2 text-sm"/>
                      <ButtonDefault>
                        + New Group
                      </ButtonDefault>
                    </div>
                    <div className="text-sm mt-[20px]">
                      <label className="flex w-full border rounded-50px py-2 px-4 cursor-pointer hover:border-lime-600 mt-[10px]">
                        <input type="radio" name="group"/>
                        <p className="ml-[10px]">category1</p>
                      </label>
                      <label className="flex w-full border rounded-50px py-2 px-4 cursor-pointer hover:border-lime-600 mt-[10px]">
                        <input type="radio" name="group"/>
                        <p className="ml-[10px]">category1</p>
                      </label>
                      <label className="flex w-full border rounded-50px py-2 px-4 cursor-pointer hover:border-lime-600 mt-[10px]">
                        <input type="radio" name="group"/>
                        <p className="ml-[10px]">category1</p>
                      </label>
                    </div>
                    <button className="inline-block bg-orange-600/70 text-white rounded-50px py-[5px] px-[30px] mt-[20px]" onClick={modalClose}>ok
                    </button>
                  </div>
                ) : ''
              }
            </div>
          </div>
        )
      }
    </>

  )
}