"use client";

// import { useModalContext } from "@/context/ModalContext";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import delay from "@/lib/delay";
import { useAnimate } from "framer-motion";
import { ButtonDefault } from "../Buttons";
import { useSession } from "next-auth/react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckToSlot,
  faTriangleExclamation,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { Collection } from "../../../types";
import { LoadingFull } from "../Loading";
import { useModalStore } from "@/store/store";

export default function ModdleWrapper() {
  // let { modalShow, setModalShow, modalType, setModalType, imgId, setImgId, imgSrc, setImgSrc,memoData, setMemoData,groupIndex, setGroupIndex,avatarPreview, setAvatarPreview,avatar, setAvatar } : any = useModalContext();
  const router = useRouter();
  // const [group, setGroup] = useState<Collections[] | undefined>([]);
  // const [selectGroup, setSelectGroup] = useState('')
  const { data: session, update } = useSession();
  let [scope, animate] = useAnimate();
  let [groupIndex, setGroupIndex] = useState(0);
  let inputRef = useRef<HTMLInputElement>(null);
  let imgRef = useRef<HTMLImageElement>(null);
  let renameRef = useRef<HTMLInputElement>(null);
  let [isPending, startTransition] = useTransition();
  // stores
  const stores = useModalStore((state) => state);
  const {
    userId,
    modalDisplay,
    modalType,
    selectImg,
    selectGroup,
    avatar,
    avatarPreview,
    modalOpen,
    modalClose,
    setModalType,
    setSelectImg,
    setSelectGroup,
    setAvatar,
    setAvatarPreview,
  } = stores;

  const handleModalClose = async (callback?: () => void) => {
    if (modalDisplay) {
      callback?.();
      callback ? await delay(500) : "";
      await animate([
        ["#modalBox", { scale: 0 }],
        [scope.current, { opacity: 0 }],
      ]);
      modalClose();
    }
  };

  // const modalClose = async(callback ?: ()=>void) => {
  //   if(modalShow){
  //     callback?.();
  //     callback? await delay(500) : ''
  //     await animate([['#modalBox',{ scale: 0}],[scope.current, { opacity: 0 }]])
  //     setModalShow(false)
  //   }
  // }

  const redirectLoginPage = async () => {
    await handleModalClose();
    await delay(300);
    router.push("/login");
  };

  const newGroup = async () => {
    startTransition(async () => {
      const groupName = inputRef.current?.value;
      console.log(groupName);
      if (!groupName) {
        return;
      }
      await axios
        .post(`/api/category/${userId}`, {
          fileName: groupName,
        })
        .then((res) => {
          const data = res.data.collections;
          setSelectGroup(data);
          // setGroup(data);
          inputRef.current!.value = "";
          update();
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };

  const onLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const groupId = (e.target as HTMLInputElement)?.value;
    const findGroupData = session?.user?.collections?.find(
      (data) => data?.groupId === groupId,
    );
    if (findGroupData) setSelectGroup(findGroupData);
  };

  const photoExist = (exist: boolean) => {
    exist
      ? setModalType("photoExist")
      : handleModalClose(async () => {
          setModalType("checked");
        });
  };

  const sendLike = async (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      console.log(selectImg, selectGroup);
      await axios
        .post(`/api/category/${userId}/${selectGroup?.groupId}`, {
          imgId: selectImg?.id,
          imgSrc: selectImg?.src,
        })
        .then((res) => {
          if (res.status.toString().startsWith("2")) {
            photoExist(res.data.exist);
          }
          update();
        });
    });
  };

  const changeGroupName = async () => {
    const newName = renameRef.current!.value;
    if (newName) {
      await new Promise((resolve) => {
        startTransition(async () => {
          await axios
            .patch(`/api/category/${userId}/${selectGroup!.groupId}`, {
              newName,
            })
            .then((res) => {
              resolve(res);
            });
        });
      });
      await handleModalClose(async () => {
        setModalType("success");
        await update();
      });
    }
  };

  const deleteGroup = async () => {
    await new Promise(async (resolve) => {
      startTransition(async () => {
        await axios
          .delete(`/api/category/${userId}/${selectGroup!.groupId}`)
          .then((res) => {
            resolve(res);
          });
      });
    });
    await handleModalClose(async () => {
      setModalType("success");
      update();
      // const collections = session!.user!.collections;
      setGroupIndex(groupIndex - 1);
    });
  };

  const handleChangeAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const render = new FileReader();
    const files = (e.target as HTMLInputElement)?.files;
    const size = files ? files[0]?.size : "";
    const maxFileSize = 2 * 1024 * 1024;
    if (size && size >= maxFileSize) {
      setModalType("overSize");
      return;
    }
    render.onload = () => {
      if (render.readyState === 2) {
        setAvatarPreview(render.result);
      }
    };
    if (files?.length) {
      setAvatarPreview(render.readAsDataURL(files[0]));
    }
  };

  const saveAvatar = async () => {
    if (avatar === avatarPreview) {
      await handleModalClose(async () => {
        setModalType("success");
      });
      return;
    }
    await new Promise(async (resolve) => {
      startTransition(async () => {
        await axios
          .patch(`/api/profile/${userId}`, {
            image: "",
            imgData: avatarPreview,
          })
          .then((res) => {
            resolve(res);
          });
      });
    });
    handleModalClose(async () => {
      setModalType("success");
      setAvatar(avatarPreview);
      update();
    });

    // await axios.patch(`/api/profile/${_id}`,{
    //   image: '',
    //   imgData: avatarPreview
    // }).then(async(res)=>{
    //   await modalClose(async()=>{setModalType('success');
    //   setAvatar(avatarPreview)})
    //   update()
    // })
  };

  useEffect(() => {
    // const collections = session?.user?.collections;
    !!avatarPreview ? "" : setAvatarPreview(avatar);
    const group = session?.user?.collections[0];
    selectGroup ?? (group && setSelectGroup(group));
    if (modalDisplay) {
      // !group?.length? setGroup(session?.user?.collections) : '';
      // defaultGroup();
      animate([
        [scope.current, { opacity: 1 }],
        ["#modalBox", { scale: 1 }],
      ]);
    }
  }, [modalDisplay]);
  return (
    <>
      {modalDisplay && (
        <div
          className={`fixed w-full h-full top-0 left-0 z-[1000] flex bg-slate-600/70 transition-all justify-center items-center p-[30px] duration-300`}
          ref={scope}
          modal-type={modalType}
        >
          {isPending && <LoadingFull />}
          <div
            className="w-full max-w-80 bg-white rounded-2xl p-[30px] text-lg relative text-default text-center scale-0 duration-300"
            id="modalBox"
          >
            {modalType != "changeAvatar" ? (
              <button
                className="bg-stone-700 text-white rounded-full absolute w-[40px] h-[40px] top-[-10px] right-[-10px] flex-center"
                onClick={() => {
                  handleModalClose();
                }}
              >
                ✕
              </button>
            ) : (
              ""
            )}
            {modalType == "login" ? (
              <div>
                <p>Please log in first.</p>
                <button
                  className="inline-block bg-orange-600/70 text-white rounded-50px py-[5px] px-[30px] mt-[20px]"
                  onClick={redirectLoginPage}
                >
                  ok
                </button>
              </div>
            ) : (
              ""
            )}
            {modalType == "like" ? (
              <div>
                <div className="flex">
                  <input
                    type="text"
                    placeholder="name"
                    className="w-[130px] mr-[5px] focus:outline-none border-b-2 text-sm"
                    ref={inputRef}
                  />
                  <ButtonDefault event={newGroup}>+ New Group</ButtonDefault>
                </div>
                <form onSubmit={sendLike}>
                  <div className="text-sm mt-[20px] h-[160px] overflow-y-scroll">
                    {session?.user?.collections
                      ?.slice()
                      .reverse()
                      .map((file, index) => (
                        <label
                          className="flex items-center w-full border rounded-50px py-2 px-4 cursor-pointer hover:border-lime-600 mt-[10px]"
                          key={index}
                        >
                          <input
                            type="radio"
                            name="group"
                            value={file.groupId}
                            onChange={onLabelChange}
                            checked={file.groupId === selectGroup?.groupId}
                          />
                          <p className="ml-[10px]">{file.name}</p>
                        </label>
                      ))}
                  </div>
                  <button className="inline-block bg-orange-600/70 text-white rounded-50px py-[5px] px-[30px] mt-[20px]">
                    ok
                  </button>
                </form>
              </div>
            ) : (
              ""
            )}
            {modalType === "checked" && (
              <div className="py-[60px]">
                <div className="w-[120px] h-[120px] border-2 p-[20px] border-spacing-10 rounded-full flex justify-center items-center m-auto">
                  <FontAwesomeIcon
                    icon={faCheckToSlot}
                    color="#1f987d"
                    size="3x"
                  />
                </div>
              </div>
            )}
            {modalType === "photoExist" ? (
              <div>
                <p>Photo exists.</p>
                <button
                  className="inline-block bg-orange-600/70 text-white rounded-50px py-[5px] px-[30px] mt-[20px]"
                  onClick={() => {
                    handleModalClose();
                  }}
                >
                  ok
                </button>
              </div>
            ) : (
              ""
            )}
            {modalType === "changeName" ? (
              <div>
                <input
                  type="text"
                  value={selectGroup?.name}
                  className="border-2 rounded-md px-2 text-default"
                  ref={renameRef}
                />
                <button
                  className="inline-block bg-orange-600/70 text-white rounded-50px py-[5px] px-[30px] mt-[20px]"
                  onClick={changeGroupName}
                >
                  update
                </button>
              </div>
            ) : (
              ""
            )}
            {modalType === "fail" ? (
              <div className="py-[60px]">
                <div className="h-[120px] p-[20px] rounded-full flex flex-col justify-center items-center m-auto">
                  <FontAwesomeIcon
                    icon={faTriangleExclamation}
                    color="#cd3c56"
                    size="4x"
                  />
                  <p className="mt-[20px] w-full">FAIL</p>
                  <p className="w-full">Please try again.</p>
                  <button
                    className="inline-block bg-orange-600/70 text-white rounded-50px py-[5px] px-[30px] mt-[20px]"
                    onClick={() => {
                      handleModalClose();
                    }}
                  >
                    Understand.
                  </button>
                </div>
              </div>
            ) : (
              ""
            )}
            {modalType === "success" ? (
              <div className="py-[60px]">
                <div className="w-[120px] h-[120px] p-[20px] rounded-full flex flex-col justify-center items-center m-auto">
                  <FontAwesomeIcon
                    icon={faCircleCheck}
                    color="#1f987d"
                    size="4x"
                  />
                  <p className="mt-[20px]">UPDATE SUCCESSFUL</p>
                </div>
              </div>
            ) : (
              ""
            )}
            {modalType === "doubleCheck" ? (
              <div className="py-[20px]">
                <div className="min-h-[120px] rounded-full flex flex-col justify-center items-center m-auto">
                  <FontAwesomeIcon
                    icon={faTriangleExclamation}
                    color="#cd3c56"
                    size="4x"
                  />
                  <p className="mt-[20px] w-full">
                    There are{" "}
                    <span className="text-rose-400">
                      {selectGroup!.photos.length}
                    </span>{" "}
                    photos
                  </p>
                  <p className="w-full">
                    in
                    <span>『 </span>
                    <span
                      className="text-rose-400"
                      style={{ wordWrap: "break-word" }}
                    >
                      {selectGroup!.name}
                    </span>
                    <span> 』</span>
                  </p>
                  <p className="w-full">Are you sure to delete?</p>
                  <div className="flex gap-3">
                    <button
                      className="inline-block bg-orange-600/70 text-white rounded-50px py-[5px] px-[30px] mt-[20px]"
                      onClick={() => {
                        handleModalClose();
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className="inline-block bg-orange-600/70 text-white rounded-50px py-[5px] px-[30px] mt-[20px]"
                      onClick={deleteGroup}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
            {modalType === "changeAvatar" ? (
              <div className="py-[20px]">
                <div className="min-h-[120px] rounded-full flex flex-col justify-center items-center m-auto">
                  <div className="w-[120px] h-[120px] rounded-full overflow-hidden hover: border-2 border-rose-200 mx-auto mb-2">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt=""
                        className="w-full h-full object-cover"
                        ref={imgRef}
                      />
                    ) : (
                      <div className="w-full h-full flex-center">
                        <FontAwesomeIcon
                          icon={faUser}
                          color="#fbc9d5"
                          size="3x"
                        />
                      </div>
                    )}
                  </div>
                  <label className="border border-emerald-400 rounded-50px relative mt-[10px] cursor-pointer transition duration-300 group hover:bg-emerald-400">
                    <input
                      name="avatar"
                      type="file"
                      className="opacity-0 w-0 absolute-center"
                      accept="image/png, image/jpeg"
                      onChange={handleChangeAvatar}
                    />
                    <p className="text-sm px-5 py-1 group-hover:text-white transition-all duration-300">
                      choose file
                    </p>
                  </label>
                  <div className="flex w-full gap-3 mt-[40px]">
                    <button
                      className="inline-block bg-orange-600/70 text-white w-1/2  rounded-50px py-[5px]"
                      onClick={() => {
                        handleModalClose();
                        setAvatarPreview(avatar);
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className="inline-block bg-orange-600/70 text-white w-1/2 rounded-50px py-[5px]"
                      onClick={saveAvatar}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
            {modalType === "overSize" ? (
              <div className="py-[60px]">
                <div className="h-[120px] p-[20px] rounded-full flex flex-col justify-center items-center m-auto">
                  <FontAwesomeIcon
                    icon={faTriangleExclamation}
                    color="#cd3c56"
                    size="4x"
                  />
                  <p className="mt-[20px] w-full">FAIL</p>
                  <p className="w-full">Maximum upload file size: 2MB</p>
                  <button
                    className="inline-block bg-orange-600/70 text-white rounded-50px py-[5px] px-[30px] mt-[20px]"
                    onClick={() => {
                      setModalType("changeAvatar");
                    }}
                  >
                    Understand.
                  </button>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      )}
    </>
  );
}
