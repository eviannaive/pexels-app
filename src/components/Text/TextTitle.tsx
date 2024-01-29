"use client"
import { motion, MotionConfig } from "framer-motion"

const TextTitle = ({text,delay}:{text:string,delay:number}) => {
  
  return (
    <MotionConfig transition={{ duration: 0.5, delay: delay }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-[25px] text-3xl text-violet-600 font-bold tracking-wider" dangerouslySetInnerHTML={{__html:text}}></motion.div>
    </MotionConfig>
  )
}

export default TextTitle
