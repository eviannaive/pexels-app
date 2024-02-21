"use client"

import { useModalContext } from "@/context/ModalContext";
import { useRouter} from "next/navigation"
import { useEffect, useRef, useState } from "react";
import delay from "@/lib/delay";
import { useAnimate } from "framer-motion"
import { ButtonDefault } from "../Buttons";
import { useSession } from 'next-auth/react';
import axios from "axios";

export default function ModdleWrapper(){
  let { modalShow, setModalShow, modalType, setModalType, imgId, setImgId, imgSrc, setImgSrc } : any = useModalContext();
  const router = useRouter();
  const [group, setGroup] = useState([]);
  const [selectGroup, setSelectGroup] = useState('00000')
  const { data: session } = useSession();
  let [ scope, animate] = useAnimate();
  let inputRef = useRef<HTMLInputElement>(null);

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

  const newGroup = async() => {
    const data = inputRef.current?.value;
    if(!data){
      return
    }
    await axios.patch("http://localhost:3000/api/category",{
      _id: session?.user?._id,
      fileName: data
    }).then((res)=>{
      const data = res.data.collections;
      setGroup(data);
      inputRef.current.value = ''
    }).catch((err)=>{
      console.log(err)
    })
  }

  const onLabelChange = (e) => {
    setSelectGroup(e.target.value)
  }

  const sendLike = async(e) => {
    e.preventDefault();
    // console.log([...e.target].find(input=>input.checked))
    const data = {
      groupId : selectGroup,
      imgId,
      imgSrc,
    }
    await axios.patch("http://localhost:3000/api/category/like",{
      _id: session?.user?._id,
      photoData: data
    }).then((res)=>{
      console.log(res.data.exist)
      photoExist(res.data.exist)
    })
  }

  const photoExist = (exist: boolean) => {
    exist? setModalType('photoExist') : modalClose()
  }

  const defaultGroup = () => {
    const defaultGroupId = group.find(g=>(g.groupId === selectGroup));
    defaultGroupId??setSelectGroup('00000')
  }

  useEffect(()=>{
    if(modalShow){
      !group.length? setGroup(session?.user?.collections) : '';
      defaultGroup();
      animate([[scope.current, { opacity: 1 }],['#modalBox',{ scale: 1 }]])
    }
  },[modalShow,group])
  return(
    <>
      {
        modalShow && (
          <div className={`fixed w-full h-full top-0 left-0 z-[1000] flex bg-slate-600/70 opacity-0 justify-center items-center p-[30px] duration-300`} ref={scope} modal-type={modalType}>
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
                      <input type="text" placeholder="name" className="w-[130px] mr-[5px] focus:outline-none border-b-2 text-sm" ref={inputRef}/>
                      <ButtonDefault event={newGroup}>
                        + New Group
                      </ButtonDefault>
                    </div>
                    <form onSubmit={sendLike}>
                      <div className="text-sm mt-[20px] h-[160px] overflow-y-scroll">
                        {
                          group.slice().reverse().map((file,index)=>(
                            <label className="flex w-full border rounded-50px py-2 px-4 cursor-pointer hover:border-lime-600 mt-[10px]" key={index}>
                              <input type="radio" name="group" value={file.groupId} onChange={onLabelChange} checked={file.groupId === selectGroup}/>
                              <p className="ml-[10px]">{file.name}</p>
                            </label>
                          ))
                        }
                      </div>
                      <button className="inline-block bg-orange-600/70 text-white rounded-50px py-[5px] px-[30px] mt-[20px]">ok
                      </button>
                    </form>
                  </div>
                ) : ''
              }
              {
                modalType == 'photoExist' ? (
                  <div>
                    <p>
                      Photo exists.
                    </p>
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