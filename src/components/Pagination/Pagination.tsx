"use client;"

import { useSearchContext } from '@/context/searchContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { useRef } from 'react'


const Pagination = ({totalPages,event} : {totalPages : number ,event: Record<string,any> }) => {
  const { resultInfo } : Record<string,any> = useSearchContext()
  const refInput= useRef<HTMLInputElement>(resultInfo.page)
  return (
    <div className='flex items-center mt-[50px] text-slate-800'>
      {
        resultInfo.page === 1 ? '' : (
          <div className='flex'>
            <div className='cursor-pointer' onClick={()=>{event.toPage(1)}}>1</div>
            <div className="mx-2">...</div> 
          </div>
        )
      }
      {

        resultInfo.prev_page?
          (
            <FontAwesomeIcon icon={faAngleLeft} color="#373939" className="p-2 cursor-pointer" onClick={()=>{event.prev()}}/>
          ) : ''
      }
      <input type="text" onChange={(e)=>{e.target.value = e.target.value.replace(/[^0-9]/g, '')}} maxLength={3} className='w-10 mr-2 p-1 text-center transition-all placeholder:text-slate-500 focus:placeholder:text-white focus-visible:outline-slate-500' placeholder={resultInfo.page} ref={refInput} />
      <div className='w-[30px] h-[30px] rounded-full bg-orange-100  text-orange-400 flex justify-center items-center text-sm cursor-pointer' onClick={()=>{event.toPage(refInput.current.value)}}>Go</div>
      {
        resultInfo.next_page?
          (
            <FontAwesomeIcon icon={faAngleRight} color="#373939" className="p-2 cursor-pointer" onClick={()=>{event.next()}}/>
          ) : ''

      }
      {
        resultInfo.page === totalPages ? '' : (
          <div className='flex'>
            <div className="mx-2">...</div>
            <div className='cursor-pointer' onClick={()=>{event.toPage(totalPages)}}>{totalPages}</div>
          </div>
        )
      }
    </div>
  )
}

export default Pagination
