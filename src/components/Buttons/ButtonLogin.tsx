"use client;"

export default function ButtonLogin({event,addClass,children}:{event:any,addClass?:string,children: React.ReactNode}){
  return(
    <button className={`flex gap-2 items-center p-3 text-left py-[10px] px-[20px] border border-slate-300 rounded-50px w-full text-neutral-600 transition duration-300 hover:border-violet-400 ${addClass}`} onClick={event}>{children}</button>
  )
}