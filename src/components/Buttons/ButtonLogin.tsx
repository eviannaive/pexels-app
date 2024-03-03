"use client;"

export default function ButtonLogin({event,disabled,addClass,children}:{event?:(e:React.MouseEvent<HTMLButtonElement>)=>void,disabled?:any,addClass?:string,children: React.ReactNode}){
  return(
    <button className={`flex gap-2 items-center justify-center p-3 py-[10px] px-[20px] border border-slate-300 rounded-50px w-full text-neutral-600 transition duration-300 hover:border-slate-700 ${addClass}`} onClick={event} disabled={disabled}>{children}</button>
  )
}