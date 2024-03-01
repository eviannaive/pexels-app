"use client"
import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from "react"
import { ButtonDefault } from '../Buttons';
import { useAnimate } from "framer-motion"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useModalContext } from "@/context/ModalContext";

const AccountDropdown = ({state} :{state: boolean}) => {
  const { data: session, status } = useSession();
  const user = session?.user;
  let [ scope, animate] = useAnimate();
  const { modalShow, setModalShow, modalType, setModalType,avatarPreview, setAvatarPreview,avatar, setAvatar } : any = useModalContext()

  const avatarChange = () => {
    setModalType('changeAvatar')
    setModalShow(true);
  }
  useEffect(()=>{
    session?.user.image? setAvatar(session?.user.image) : '';
    if(state){
      animate([[scope.current, { opacity: 1, height: '230px' }]])
    }else{
      animate([[scope.current, { opacity: 0, height: '0'}]])
    }
  },[state])
  return (
    <div className={`bg-white rounded-lg absolute top-[95%] right-[20px] p-[20px] shadow-lg shadow-stone-300/50 opacity-0 h-0 overflow-hidden`} ref={scope} onClick={(e)=>{e.stopPropagation()}}>
      <div className='text-sm flex flex-col text-center text-slate-700 gap-2'>
        <div className="w-[60px] h-[60px] rounded-full overflow-hidden cursor-pointer hover: border-2 border-rose-200 transition-all hover:border-amber-300 mx-auto mb-2">
          <div className='relative w-full h-full'>
            {
              avatar ? (
                <img src={avatar} alt="" className="w-full h-full object-cover"/>
              ) : (
                <div className='w-full h-full flex-center'>
                  <FontAwesomeIcon icon={faUser} color="#fbc9d5" size="2x" />
                </div>

              )
            }
            {
              <div className='w-full h-full absolute-center group cursor-pointer' onClick={avatarChange}>
                <p className='text-xs absolute-center opacity-0 group-hover:opacity-100 transition duration-300'>change avatar</p>
              </div>
            }
          </div>
        </div>
        <div>
          <p>{user?.name}</p>
          <p>{user?.email}</p>
        </div>
        <ButtonDefault bgColor='bg-zinc-400' hover='hover:bg-orange-300'>My Account</ButtonDefault>
        <ButtonDefault bgColor='bg-zinc-400' hover='hover:bg-orange-300' event={()=>{signOut()}}>Logout</ButtonDefault>
      </div>
    </div>
  )
}

export default AccountDropdown
