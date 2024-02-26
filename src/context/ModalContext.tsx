"use client"

import { Url } from "next/dist/shared/lib/router/router";
import { createContext, useContext, useState} from "react"
const ModalContext = createContext({})

export function ModalContextProvider({children}){
  let [modalShow, setModalShow] = useState(false);
  let [modalType, setModalType] = useState('');
  let [imgId, setImgId] = useState('');
  let [imgSrc, setImgSrc] = useState('');
  let [memoData, setMemoData]= useState<any>('');
  const downloadImg = async(id : string,src :string) => {
    const imgBlob = await fetch(src).then((res)=>res.arrayBuffer()).then((buffer)=>new Blob([buffer],{type: "image/jpeg"}))
    const link = document.createElement('a');
    link.href= URL.createObjectURL(imgBlob);
    link.download = 'pexels-photo' + id;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <ModalContext.Provider value={{modalShow, setModalShow,modalType, setModalType,imgId, setImgId, imgSrc, setImgSrc,downloadImg,memoData, setMemoData}}>
      {children}
    </ModalContext.Provider>
  )
}

export const useModalContext = () => useContext(ModalContext)