"use client"

import { createContext, useContext, useState} from "react"
// import { useAnimate } from "framer-motion"

const ModalContext = createContext({})

export function ModalContextProvider({children}){
  let [modalShow, setModalShow] = useState(false);
  // let [ scope, animate] = useAnimate();
  // const modalShow = useMemo(()=>{
  //   console.log('memo')
  //   return modalShow
  // },[modalShow]);

  return (
    <ModalContext.Provider value={{modalShow, setModalShow}}>
      {children}
    </ModalContext.Provider>
  )
}

export const useModalContext = () => useContext(ModalContext)