"use client"

import { NavList } from "."
// import { getServerSession } from "next-auth"
// import { options } from '@/app/api/auth/[...nextauth]/options'
import { useSession, signOut } from 'next-auth/react';
import Link from "next/link"
import { ButtonLogin } from "../Buttons"
// import AuthProvider from "@/context/AuthProvider"
import AccountDropdown from "../AccountDropdown"
import { useState, useMemo, useEffect, useRef, useTransition, startTransition } from "react";
import delay from "@/lib/delay";

const logItem = {
    name: 'LOG IN',
    link: '/login',
    icon: 'faRightToBracket'
  };

const Nav = ({list}) => {
  const { data: session, status } = useSession();
  const [ open, setOpen ] = useState(false);
  const [ dropdown, setDropdown ] = useState(false);
  const [ isPending, startTransition ] = useTransition();

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
  useEffect(()=>{
    dropdownHandle()
  },[open])


  return (
  <nav className='fixed top-0 left-0 w-full flex justify-end text-lg gap-x-5 px-5 py-2 bg-gradient-to-r from-sky-300 to-teal-700 z-10 h-[var(--navHeight)]'>
    {list.map((li,index)=><NavList key={index} listData={li}/>)}
    {!session && (<NavList listData={logItem}/>)}
    {session && (
      <button className="w-[40px] h-[40px] rounded-full overflow-hidden hover: border-2 border-rose-200 transition-all hover:border-amber-300" onClick={()=>{setOpen(!open)}} disabled={isPending}>
        <img src={session?.user.image} alt="" className="w-full h-full object-cover"/>
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

export default Nav
