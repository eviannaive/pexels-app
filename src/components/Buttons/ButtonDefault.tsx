"use client"

export default function ButtonDefault({textColor, bgColor,event,children}:{textColor?: string,bgColor?: string,event?:()=>void,children: React.ReactNode}){
  return (
    <button className={`text-sm p-2 py-[5px] px-[15px] rounded-50px ${textColor??'text-white'} ${bgColor??'bg-zinc-500'}`} onClick={event}>
      {children}
    </button>
  )

}