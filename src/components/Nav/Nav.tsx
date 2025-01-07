"use client"

import { NavList } from "."
import { useSession, signOut } from 'next-auth/react';
import Link from "next/link"
// import { ButtonLogin } from "../Buttons"
import AccountDropdown from "../AccountDropdown"
import { useState, useEffect, useTransition } from "react";
import delay from "@/lib/delay";
import Image from "next/image";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from "@fortawesome/free-solid-svg-icons";
// import { useModalContext } from "@/context/ModalContext";
import fetchUserData from "@/lib/fetchUserData";
import { NavData } from "../../../types";
import { useModalStore } from "@/store/store";

const logItem : NavData = {
    name: 'login',
    link: '/login',
    icon: 'faRightToBracket'
  };

export default function Nav({list}:{list: NavData[]}){
  const { data: session, status} = useSession();
  const [ open, setOpen ] = useState(false);
  const [ dropdown, setDropdown ] = useState(false);
  const [ isPending, startTransition ] = useTransition();
  const stores = useModalStore((state)=>state);
  const {avatar, setUserId, setAvatar} = stores;

  // let { avatar, setAvatar, fetchUser, setFetchUser } : any = useModalContext();

  const dropdownHandle = () => {
    startTransition(async()=>{
      if(open){
        setDropdown(true)
      }else{
        await delay(500)
        setDropdown(false)
      }
    })
  }

  const refreshAvatar = async(userId : string)=>{
    const img = session?.user?.image;
    const userData = await fetchUserData(userId,(res)=>{
      // console.log(res,'updateData')
    });
    userData && userData['imgData'] ? setAvatar(userData['imgData']): setAvatar(img as string);

  }

  useEffect(()=>{
    window.addEventListener('click', ()=>{
      setOpen(false)
    })
  },[])

  useEffect(()=>{
    if(session?.error){
      console.warn('auth error,sign out...')
      signOut()
    }
    if(session?.user?._id){
      const stringId = session.user._id.toString();
      setUserId(stringId)
      refreshAvatar(stringId);
    }
  },[status,avatar])

  useEffect(()=>{
    dropdownHandle()
  },[open])

  
  return (
  <nav className='fixed top-0 left-0 w-full flex justify-end text-lg gap-x-5 px-5 py-2 bg-gradient-to-r from-sky-300 to-teal-700 z-[99] h-[var(--navHeight)] max-[600px]:gap-x-3'>
    <Link href="/" className="mr-auto flex-center">
      <Image width="40" height="40" src="/logo.png" alt="pexels app"></Image>
    </Link>
    {list.map((li,index)=><NavList key={index} listData={li}/>)}
    {!session && (<NavList listData={logItem}/>)}
    {session && (
      <button className="w-[40px] h-[40px] rounded-full overflow-hidden hover: border-2 border-rose-200 transition-all hover:border-amber-300" onClick={(e)=>{e.stopPropagation();setOpen(!open)}} disabled={isPending}>
        {
          avatar? (
            <img src={avatar as string} alt="" className="w-full h-full object-cover"/>
          ) : (
            <div>
              <FontAwesomeIcon icon={faUser} color="#fff" />
            </div>

          )
        }
      </button>)
    }
    {
      session && dropdown &&(
        <AccountDropdown state={open}/>
      )
    }
  </nav>
  )
}
