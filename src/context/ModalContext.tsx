"use client"

import { createContext, useContext, useState} from "react"
const ModalContext = createContext({})

export function ModalContextProvider({
  children,
}: {
  children: React.ReactNode
}){
  let [modalShow, setModalShow] = useState(false);
  let [modalType, setModalType] = useState('');
  let [imgId, setImgId] = useState('');
  let [imgSrc, setImgSrc] = useState('');
  let [memoData, setMemoData]= useState<any>('');
  let [groupIndex, setGroupIndex] = useState(0);
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
    <ModalContext.Provider value={{modalShow, setModalShow,modalType, setModalType,imgId, setImgId, imgSrc, setImgSrc,downloadImg,memoData, setMemoData,groupIndex, setGroupIndex }}>
      {children}
    </ModalContext.Provider>
  )
}

export const useModalContext = () => useContext(ModalContext)