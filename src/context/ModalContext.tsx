"use client"

import { createContext, useContext, useState} from "react"
const ModalContext = createContext({})

type ModalType = 'login' | 'like' | undefined;

export function ModalContextProvider({children}){
  let [modalShow, setModalShow] = useState(false);
  let [modalType, setModalType] = useState('');
  let [imgId, setImgId] = useState('')
  let [imgSrc, setImgSrc] = useState('')
  // let [ scope, animate] = useAnimate();
  // const modalShow = useMemo(()=>{
  //   console.log('memo')
  //   return modalShow
  // },[modalShow]);

  return (
    <ModalContext.Provider value={{modalShow, setModalShow,modalType, setModalType,imgId, setImgId, imgSrc, setImgSrc}}>
      {children}
    </ModalContext.Provider>
  )
}

export const useModalContext = () => useContext(ModalContext)