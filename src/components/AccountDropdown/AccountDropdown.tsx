"use client"
import { useSession, signOut } from 'next-auth/react';
import { useEffect } from "react"
import { ButtonDefault } from '../Buttons';
import { useAnimate } from "framer-motion"

const AccountDropdown = ({state} :{state: boolean}) => {
  const { data: session, status } = useSession();
  const user = session?.user;
  let [ scope, animate] = useAnimate();
  useEffect(()=>{
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
          <img src={user?.image} alt="" className="w-full h-full object-cover"/>
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
