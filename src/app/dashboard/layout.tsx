"use client"
import { redirect } from "next/navigation"
import { useSession } from 'next-auth/react';
import { useEffect, useState } from "react";
import { LoadingFull } from "@/components/Loading";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session } = useSession();
  const [ loading , setLoading] = useState(true);
  useEffect(()=>{
    if(!session){
      redirect('login')
    }else{
      setLoading(false)
    }
  },[session])
  return (
    <>
      {loading && (<LoadingFull />)}
      {!loading && (
        <>
          {children}
        </>
      )}
    </>
  )
}