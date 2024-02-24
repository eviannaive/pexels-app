"use client"

import { createContext, useContext, useState} from "react"
const ModalContext = createContext({})

type ModalType = 'login' | 'like' | undefined;

export function ModalContextProvider({children}){
  let [modalShow, setModalShow] = useState(false);
  let [modalType, setModalType] = useState('');
  let [imgId, setImgId] = useState('');
  let [imgSrc, setImgSrc] = useState('');
  const downloadImg = async() => {
    const imgBlob = await fetch(imgSrc).then((res)=>res.arrayBuffer()).then((buffer)=>new Blob([buffer],{type: "image/jpeg"}))
    const link = document.createElement('a');
    link.href= URL.createObjectURL(imgBlob);
    link.download = 'pexels-photo' + imgId;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  // let [ scope, animate] = useAnimate();
  // const modalShow = useMemo(()=>{
  //   console.log('memo')
  //   return modalShow
  // },[modalShow]);

  return (
    <ModalContext.Provider value={{modalShow, setModalShow,modalType, setModalType,imgId, setImgId, imgSrc, setImgSrc,downloadImg}}>
      {children}
    </ModalContext.Provider>
  )
}

export const useModalContext = () => useContext(ModalContext)