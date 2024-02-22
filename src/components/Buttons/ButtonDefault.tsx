"use client"

export default function ButtonDefault({textColor, bgColor, hover, event,children}:{textColor?: string,bgColor?: string,hover?: string,event?:()=>void,children: React.ReactNode}){
  return (
    <button className={`text-sm p-2 py-[5px] px-[15px] rounded-50px transition-all duration-300 ${textColor??'text-white'} ${bgColor??'bg-zinc-500'} ${hover??''}`} onClick={event}>
      {children}
    </button>
  )

}