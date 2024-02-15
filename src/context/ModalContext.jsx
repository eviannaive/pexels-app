"use client"

import { createContext, useContext, useState } from "react"

const ModalContext = createContext({})

export function ModalContextProvider({children}){
  let [modalLogin, setModalLogin] = useState(false);

  return (
    <ModalContext.Provider value={{modalLogin, setModalLogin}}>
      {children}
    </ModalContext.Provider>
  )
}

export const useModalContext = () => useContext(ModalContext)