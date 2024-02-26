"use client"
import { useSession, signOut } from 'next-auth/react';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretLeft, faCaretRight, faPenToSquare, faDownload, faTrash, faPen } from "@fortawesome/free-solid-svg-icons";
import 'swiper/css';
import 'swiper/css/navigation';
import imgValidateError from '@/lib/imgValidateError';
import { useModalContext } from "@/context/ModalContext";
import { Enlarge } from '@/components/Enlarge';
import axios from 'axios';
import delay from '@/lib/delay';
	
export default function Dashboard() {
	const { data: session, status, update } = useSession();
	const swiperRef = useRef();
	const [ groupIndex,setGroupIndex ] = useState(0);
	const [ enlargeShow, setEnlargeShow ] = useState(false);
	const [ editMode, setEditMode ] = useState(false);
	const [ fixedItem, setFixedItem] = useState(false);
	// const [ editGroupData, setEditGroupData ] = useState({
	// 	id: '',
	// 	name: '',
	// 	newName: ''
	// })
	const { modalShow, setModalShow, modalType, setModalType,imgId, setImgId, imgSrc, setImgSrc, downloadImg,memoData, setMemoData} : any = useModalContext()
	const imgLoadError = (id) => {
		imgValidateError(id,(res)=>{
			console.log(res)

		})
	}

	const handleEnlarge = (e) => {
		console.log(e.target,String(e.target?.getAttribute('img-id')))
		setImgId(String(e.target?.getAttribute('img-id')))
		setImgSrc(String(e.target?.getAttribute('src')))
		setEnlargeShow(true)
	}

	const handleDownload = (e) => {
		downloadImg(String(e.target?.closest('[box-wrap]').firstChild.getAttribute('img-id')),String(e.target?.closest('[box-wrap]').firstChild.getAttribute('src')))
	}

	const handleEdit = async() => {
		setEditMode(!editMode);
		await(500);
		swiperRef.current.update()
	}

	const deletePhoto = async(e) => {
		const group = session?.user.collections[groupIndex].groupId;
		const img = String(e.target?.closest('[box-wrap]').firstChild.getAttribute('img-id'))
		const data = {
      groupId: group,
      imgId: img
    }
		await axios.patch("http://localhost:3000/api/category/unlike",{
      _id: session?.user?._id,
      photoData: data
    }).then((res)=>{
      console.log(res.data)
			update()
    })
  }

	const handleChangeName = (e) =>{
		const id = e.target.closest('[goroup-id]').getAttribute('goroup-id');
		const group = session?.user.collections.find((g)=>g.groupId === id)
		setMemoData(group)
		setModalType('changeName')
		setModalShow(true)
		const input = e.target.closest('[goroup-id]').querySelector('input');
	}

	useEffect(()=>{
		window.addEventListener('scroll',(e)=>{
			window.scrollY >= 180 ? setFixedItem(true) : setFixedItem(false)
		})
	},[])
	return (
		<div className='py-[60px] px-[20px] relative'>
			<Enlarge state={enlargeShow} setEnlargeShow={setEnlargeShow}/>
			{/* collection<br/> */}
			{/* {
				session? (
					<>
						<p>provider: {session?.user.provider}</p>
						<p>
							username: {session?.user.name}
						</p>
						<p>
							email: {session?.user.email}
						</p>
						<button onClick={()=>{
							signOut()
						}}>sign out</button>
					</>
				) : ''
			} */}
			{
				session? (
					<div className='bg-white rounded-lg w-full p-[20px] relative max-[576px]:px-[10px]'>
						<button className={`flex items-center gap-1 absolute rounded-50px border border-orange-300 bg-orange-300 py-[2px] px-[10px] top-[-15px] right-[10px] transition duration-300 ${editMode?'text-fuchsia-800 hover:text-fuchsia-800' : 'text-white hover:text-slate-600'}`} onClick={handleEdit}>
							<div>Edit</div>
							<FontAwesomeIcon icon={faPenToSquare}/>
						</button>
						<div className={`${fixedItem?'fixed-controlbar': ''}`}>
							<div className='flex relative text-default items-center py-[10px]'>
								<button onClick={()=> swiperRef.current.slidePrev()} className='w-[30px] h-[30px] shrink-0 max-[840px]:w-[20px]'>
									<FontAwesomeIcon icon={faCaretLeft}/>
								</button>
								<Swiper spaceBetween={10} slidesPerView='auto' onSwiper={(swiper) => swiperRef.current = swiper}>
									{
										session.user.collections.map((g,index)=>(
											<SwiperSlide style={{width: 'auto'}} key={index}>
												<div className={`flex items-center rounded-50px border border-teal-400 transition duration-300 hover:bg-teal-500 hover:text-white cursor-pointer py-[2px] ${index===groupIndex? 'bg-teal-500 text-white' : ''} ${editMode?'px-[10px]':'px-[20px]'}`} goroup-id={g.groupId} onClick={()=>setGroupIndex(index)}>
													<span>{g.name}</span>
													{
														editMode && (
															<>
																<button className='ml-[6px] w-[20px] h-[20px] rounded-full bg-white/70 flex-center border border-slate-400/50 hover:bg-white/100 hover:border-teal-500/50' onClick={handleChangeName}>
																	<FontAwesomeIcon icon={faPen} color="#da7d8d" size="2xs"/>
																</button>
																<button className='ml-[3px] w-[20px] h-[20px] rounded-full bg-white/70 flex-center hover:bg-white/100 border border-slate-400/50 hover:bg-white/100 hover:border-teal-500/50'>
																	<FontAwesomeIcon icon={faTrash} color="#da7d8d" size="2xs"/>
																</button>
															</>
														)
													}
												</div>
											</SwiperSlide>
										))
									}
								</Swiper>
								<button onClick={()=> swiperRef.current.slideNext()} className='w-[30px] h-[30px] shrink-0 max-[840px]:w-[20px]'>
									<FontAwesomeIcon icon={faCaretRight}/>
								</button>
							</div>
							<div className='w-full h-[1px] bg-slate-300'></div>
						</div>
						<div className='py-[20px] flex flex-wrap'>
							{
								session.user.collections[groupIndex]?.photos.map((p,index)=>(
									<div className='w-1/5 p-1 max-[840px]:w-1/3 max-[500px]:w-full group hover:z-30' key={index}>
										<div className='pb-[100%] relative cursor-pointer overflow-hidden' box-wrap="">
											<img src={p.imgSrc} className='absolute-center w-full h-full object-cover transition duration-700 group-hover:scale-[1.15]' onError={()=>{imgLoadError(p.imgId)}} onClick={handleEnlarge} img-id={p.imgId}/>
											{
												editMode && (
												<div className='absolute top-[15px] right-[15px] transition group-hover:opacity-100'>
													<div className='opacity-100 transition-all w-[30px] h-[30px] flex-center bg-rose-400 rounded-full hover:bg-rose-600' onClick={deletePhoto}>
														<FontAwesomeIcon icon={faTrash} size="sm" color="#f9f9f9"/>
													</div>
												</div>
												)
											}
											{
												!editMode && (
													<div className='absolute bottom-[15px] right-[15px] opacity-0 transition group-hover:opacity-100'>
														<div className='opacity-75 hover:opacity-100 transition-all' onClick={handleDownload}>
															<FontAwesomeIcon icon={faDownload} size="lg" color="#f9f9f9"/>
														</div>
													</div>
												)
											}
											<div className='absolute-center w-[101%] h-[101%] border-4 border-orange-300 opacity-0 group-hover:opacity-100 pointer-events-none transition duration-300 z-10'></div>
										</div>
									</div>
								))
							}

						</div>
					</div>
				) : ''
			}
		</div>
	)
}
