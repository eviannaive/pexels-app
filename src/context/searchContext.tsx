"use client"

import { createContext, useContext, useState, useRef, useTransition } from "react"

const SearchContext = createContext({})

export function SearchContextProvider({
  children,
}: {
  children: React.ReactNode
}){
  let [searchBtnShow, setSearchBtnShow] = useState(false);
	let [inputValue, setInputValue] = useState('');
	let [resultInfo, setResultInfo] = useState({});
	let [photosArr, setPhotosArr] = useState([]);
  const [ isPending, startTransition ] = useTransition();
  const initFetch = useRef('')
	const firstSearch = useRef(true)
	const inputRef = useRef('')
  return (
    <SearchContext.Provider value={{
      searchBtnShow,setSearchBtnShow,
      inputValue, setInputValue,
      resultInfo, setResultInfo,
      photosArr, setPhotosArr,
      isPending, startTransition,
      initFetch,
      firstSearch,
      inputRef
      }}>
      {children}
    </SearchContext.Provider>
  )
}

export const useSearchContext = () => useContext(SearchContext)