"use client"

import { createContext, useContext, useState, useRef } from "react"

const SearchContext = createContext({})

export function SearchContextProvider({children}){
  let [searchBtnShow, setSearchBtnShow] = useState(false);
	let [inputValue, setInputValue] = useState('');
	let [resultInfo, setResultInfo] = useState({});
	let [photosArr, setPhotosArr] = useState([]);
	let [loading, setLoading] = useState(true)
  const initFetch = useRef('')
	const firstSearch = useRef(true)
	const inputRef = useRef('')
  return (
    <SearchContext.Provider value={{
      searchBtnShow,setSearchBtnShow,
      inputValue, setInputValue,
      resultInfo, setResultInfo,
      photosArr, setPhotosArr,
      loading, setLoading,
      initFetch,
      firstSearch,
      inputRef
      }}>
      {children}
    </SearchContext.Provider>
  )
}

export const useSearchContext = () => useContext(SearchContext)