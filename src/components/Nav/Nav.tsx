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
import Image from "next/image";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from "@fortawesome/free-solid-svg-icons";

const logItem = {
    name: 'login',
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

  useEffect(()=>{
    window.addEventListener('click', ()=>{
      setOpen(false)
    })
  },[])


  return (
  <nav className='fixed top-0 left-0 w-full flex justify-end text-lg gap-x-5 px-5 py-2 bg-gradient-to-r from-sky-300 to-teal-700 z-[99] h-[var(--navHeight)] max-[600px]:gap-x-3'>
    <Link href="/" className="mr-auto flex-center">
      <Image width="40" height="40" src="/logo.png"></Image>
    </Link>
    {list.map((li,index)=><NavList key={index} listData={li}/>)}
    {!session && (<NavList listData={logItem}/>)}
    {session && (
      <button className="w-[40px] h-[40px] rounded-full overflow-hidden hover: border-2 border-rose-200 transition-all hover:border-amber-300" onClick={(e)=>{e.stopPropagation();setOpen(!open)}} disabled={isPending}>
        {
          session?.user.image ? (
            <img src={session?.user.image} alt="" className="w-full h-full object-cover"/>
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

export default Nav
