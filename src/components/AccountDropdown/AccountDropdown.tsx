"use client"
import { useSession, signOut } from 'next-auth/react';
import { useEffect } from "react"

const AccountDropdown = () => {
  useEffect(()=>{
    console.log('hellllllllllllllllllllllllllo')
  },[])
  const { data: session, status } = useSession();
  return (
    <div>
      <button onClick={()=>{signOut()}}>Log out</button>
    </div>
  )
}

export default AccountDropdown
