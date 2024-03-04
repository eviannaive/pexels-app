"use client"

import { redirect } from "next/navigation"
import { useSession } from 'next-auth/react';
import { LoadingFull } from "@/components/Loading";
import { useEffect, useState } from "react";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session,status } = useSession();
  const [ loading , setLoading] = useState(true);
  useEffect(()=>{
    if(session){
      redirect('dashboard');
    }else{
      setLoading(false)
    }
  },[status])
  return (
    <>
      {loading && (<LoadingFull />)}
      {!loading && (<>{children}</>)}
    </>
  )
}