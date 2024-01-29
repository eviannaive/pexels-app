"use client;"

export default function ButtonLogin({event,addClass,children}:{event:any,addClass?:string,children: React.ReactNode}){
  return(
    <button className={`p-3 text-left py-[10px] px-[20px] border border-slate-300 rounded-50px w-full ${addClass}`} onClick={event}>{children}</button>
  )
}