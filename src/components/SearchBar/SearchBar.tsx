"use client;"

import { useSearchContext } from '@/context/searchContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { ChangeEvent, KeyboardEvent, KeyboardEventHandler } from 'react';

const SearchBar = ({ event } : { event: ()=>void}) => {
  let {loading,initFetch,inputRef,searchBtnShow,setSearchBtnShow,setInputValue} : any = useSearchContext();

  const inputHandler = (e : ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		if(value) setSearchBtnShow(true)
		else setSearchBtnShow(false)
		setInputValue(e.target.value)
	}

  const keyPress = (e : KeyboardEvent<HTMLInputElement>) => {
    e.key === 'Enter' ? event() : ''
  }

  return (
    <label className={`bg-white rounded-50px inline-flex items-center py-[6px] px-[8px] text-lg border-0 w-full max-w-[400px] max-[840px]:px-[5px] max-[840px]:py-[4px] ${loading? 'pointer-events-none' : ''}`}>
      <input type="text" placeholder={`${initFetch.current} ...`} className='bg-white/0 focus:outline-none text-slate-700 font-medium grow px-4 max-[840px]:text-base' onChange={inputHandler} onKeyDown={keyPress} ref={inputRef}/>
      <div className='w-[40px] h-[40px] flex justify-center items-center relative max-[840px]:w-[30px] max-[840px]:h-[30px]'>
        <div className={`w-full h-full bg-rose-100 rounded-full absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] scale-0 transition-transform duration-500 cursor-pointer ${searchBtnShow?'scale-100':''}`} onClick={event}></div>
        <FontAwesomeIcon icon={faMagnifyingGlass} color="#28ad80" className='relative z-10 pointer-events-none'/>
      </div>
    </label>
  )
}

export default SearchBar
