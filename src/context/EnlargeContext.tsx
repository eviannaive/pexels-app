"use client"

import { createContext, useContext, useState} from "react"
const EnlargeContext = createContext({})

export function EnlargeContextProvider({children}){
  let [enlargeShow, setEnlargeShow] = useState(false);
  let [imgId, setImgId] = useState('')

  return (
    <EnlargeContext.Provider value={{enlargeShow, setEnlargeShow,imgId, setImgId}}>
      {children}
    </EnlargeContext.Provider>
  )
}

export const useEnlargeContext = () => useContext(EnlargeContext)