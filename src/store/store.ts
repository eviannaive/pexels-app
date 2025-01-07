import { create } from "zustand";
import { Collection } from '../../types'

type modalsVariable = {
  userId: string | null,
  modalDisplay: boolean,
  modalType: string | null,
  selectImg: {
    id: string | null,
    src: string | null,
  } | null,
  selectGroup: Collection | null,
  avatar: string | ArrayBuffer | null,
  avatarPreview: string | null,
}

type modalActions = {
  modalOpen: () => void,
  modalClose: () => void,
  setUserId: (id : string | undefined | null) => void,
  setModalType: (type : string) => void,
  setSelectImg: (id : string | null,src : string | null) => void,
  setSelectGroup: (groupData : Collection) => void,
  setAvatar: (data: string | ArrayBuffer | null) => void,
  setAvatarPreview: (data: any) => void,
}

export const useModalStore = create<modalsVariable & modalActions>((set)=>({
    userId: null,
    modalDisplay: false,
    modalType: null,
    selectImg: null,
    selectGroup: null,
    avatar : null,
    avatarPreview : null,
    setUserId: (id)=>set(()=>({userId: id})),
    modalOpen: ()=>set(()=>({modalDisplay: true})),
    modalClose: ()=>set(()=>({modalDisplay: false})),
    setModalType: (type)=>set(()=>({modalType: type})),
    setSelectImg: (id,src) => set(()=>({
      selectImg: {
        id,src
      },
    })),
    setSelectGroup: (groupData) => set(()=>({
      selectGroup: {
        ...groupData
      }
    })),
    setAvatar: (data) => set(()=>({
      avatar: data
    })),
    setAvatarPreview: (data) => set(()=>({
      avatarPreview: data
    })),
  }
))