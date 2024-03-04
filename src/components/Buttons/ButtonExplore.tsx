"use client"
import { motion, MotionConfig } from "framer-motion"
import { useRouter } from "next/navigation"

export default function ButtonExplore({text,delay,target}:{text:string,delay?:number,target?:any}){
  const router = useRouter();
  return (
    <MotionConfig transition={{ duration: 0.5, delay: delay }}>
      <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`rounded-full bg-[length:350px_120px] bg-left-top bg-gradient-to-br from-violet-500 to-pink-500 px-10 py-3 text-xl text-white tracking-wider font-bold transition-all duration-500 hover:scale-[1.05] hover:bg-right-bottom animate-[twinkling_3s_infinite]`} onClick={()=>{router.push(target)}}>{text}</motion.button>
    </MotionConfig>
  )
}