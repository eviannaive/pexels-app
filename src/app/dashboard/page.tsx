"use client"
import { useSession } from 'next-auth/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useEffect, useRef, useState, useTransition } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretLeft, faCaretRight, faPenToSquare, faDownload, faTrash, faPen } from "@fortawesome/free-solid-svg-icons";
import 'swiper/css';
import 'swiper/css/navigation';
import imgValidateError from '@/lib/imgValidateError';
import { useModalContext } from "@/context/ModalContext";
import { Enlarge } from '@/components/Enlarge';
import axios from 'axios';
import delay from '@/lib/delay';
import { LoadingFull } from '@/components/Loading';
import { Swiper as typeSwiper } from 'swiper';
	
export default function Dashboard() {
	const { data: session, update } = useSession();
	const _id = session?.user?._id;
	const [ enlargeShow, setEnlargeShow ] = useState(false);
	const [ editMode, setEditMode ] = useState(false);
	const [ fixedItem, setFixedItem] = useState(false);
	const [ swiper, setSwiper ] = useState<null | typeSwiper>(null)
	const [ isPending, startTransition] = useTransition();

	const { setModalShow, setModalType, setImgId, setImgSrc, downloadImg, setMemoData,groupIndex, setGroupIndex } : any = useModalContext()
	const imgLoadError = (id : string) => {
		imgValidateError(id,(res)=>{
			console.log(res)
		})
	}

	const handleEnlarge = (e : React.MouseEvent<HTMLImageElement>) => {
		setImgId(String((e.target as HTMLElement)?.getAttribute('img-id')))
		setImgSrc(String((e.target as HTMLElement)?.getAttribute('src')))
		setEnlargeShow(true)
	}

	const handleDownload = (e : React.MouseEvent<HTMLDivElement>) => {
		const $el = (e.target as HTMLElement)?.closest('[box-wrap]')?.
		firstChild;
		downloadImg(String(($el as HTMLElement).getAttribute('img-id')),String(($el as HTMLElement).getAttribute('src')))
	}

	const handleEdit = async() => {
		setEditMode(!editMode);
		await(500);
		swiper?.update()
	}

	const deletePhoto = (e : React.MouseEvent<HTMLDivElement>) => {
		startTransition(async()=>{
			const group = session?.user?.collections[groupIndex].groupId;
			const $el = (e.target as HTMLElement)?.closest('[box-wrap]')?.firstChild 
			const img = String(($el as HTMLElement).getAttribute('img-id'))
			await axios.delete(`http://localhost:3000/api/category/${_id}/${group}/${img}`).then((res)=>{
				update()
			})
		})
  }

	const handleChangeName = (e : React.MouseEvent<HTMLButtonElement>) =>{
		const $el = (e.target as HTMLElement)?.closest('[group-id]')
		const id = ($el as HTMLElement)?.getAttribute('group-id');
		const group = session?.user?.collections.find((g)=>g.groupId === id)
		setMemoData(group)
		setModalType('changeName')
		setModalShow(true)
		const input = ($el as HTMLElement)?.querySelector('input');
	}

	const handleDeleteGroup = (e : React.MouseEvent<HTMLButtonElement>) => {
		const $el = (e.target as HTMLElement)?.closest('[group-id]')
		const id = ($el as HTMLElement)?.getAttribute('group-id');
		const group = session?.user?.collections.find((g)=>g.groupId === id)
		setMemoData(group)
		setModalType('doubleCheck')
		setModalShow(true)
	}

	useEffect(()=>{
		window.addEventListener('scroll',(e)=>{
			window.scrollY >= 180 ? setFixedItem(true) : setFixedItem(false)
		})
	},[])

	// useEffect(()=>{

	// },[groupIndex])

	return (
		<div className='py-[60px] px-[20px] relative'>
			{
				isPending && (
					<LoadingFull />
				)
			}
			<Enlarge state={enlargeShow} setEnlargeShow={setEnlargeShow}/>
			{
				session? (
					<div className='bg-white rounded-lg w-full max-w-[1500px] p-[20px] relative max-[576px]:px-[10px] mx-auto'>
						<button className={`flex items-center gap-1 absolute rounded-50px border border-orange-300 bg-orange-300 py-[2px] px-[10px] top-[-15px] right-[10px] transition duration-300 ${editMode?'text-fuchsia-800 hover:text-fuchsia-800' : 'text-white hover:text-slate-600'}`} onClick={handleEdit}>
							<div>Edit</div>
							<FontAwesomeIcon icon={faPenToSquare}/>
						</button>
						<div className='h-[50px]'>
							<div className={`${fixedItem?'fixed-controlbar': ''}`}>
								<div className='flex relative text-default items-center py-[10px]'>
									<button onClick={()=> swiper?.slidePrev()} className='w-[30px] h-[30px] shrink-0 max-[840px]:w-[20px]'>
										<FontAwesomeIcon icon={faCaretLeft}/>
									</button>
									<Swiper spaceBetween={10} slidesPerView='auto' onSwiper={(swiper) => setSwiper(swiper)}>
										{
											session?.user?.collections?.map((g,index)=>(
												<SwiperSlide style={{width: 'auto'}} key={index}>
													<div className={`flex items-center rounded-50px border border-teal-400 transition duration-300 hover:bg-teal-500 hover:text-white cursor-pointer py-[2px] ${index===groupIndex? 'bg-teal-500 text-white' : ''} ${editMode?'px-[10px]':'px-[20px]'}`} group-id={g.groupId} onClick={()=>setGroupIndex(index)}>
														<span>{g.name}</span>
														{
															editMode && (
																<>
																	<button className='ml-[6px] w-[20px] h-[20px] rounded-full bg-white/70 flex-center border border-slate-400/50 hover:bg-white/100 hover:border-teal-500/50' onClick={handleChangeName}>
																		<FontAwesomeIcon icon={faPen} color="#da7d8d" size="2xs"/>
																	</button>
																	<button className='ml-[3px] w-[20px] h-[20px] rounded-full bg-white/70 flex-center hover:bg-white/100 border border-slate-400/50 hover:border-teal-500/50' onClick={handleDeleteGroup}>
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
									<button onClick={()=> swiper?.slideNext()} className='w-[30px] h-[30px] shrink-0 max-[840px]:w-[20px]'>
										<FontAwesomeIcon icon={faCaretRight}/>
									</button>
								</div>
							</div>
							<div className='w-full h-[1px] bg-slate-300'></div>
						</div>
						<div className='py-[20px] flex flex-wrap'>
							{
								session?.user?.collections ? (
									<>
									{
										!session?.user?.collections[groupIndex].photos.length ? (
											<div className='w-full h-[300px] flex-center'>Empty</div>
		
										): ''
									}
									{
										session?.user?.collections[groupIndex]?.photos.map((p,index)=>(
											<div className='w-1/5 p-1 max-[840px]:w-1/3 max-[500px]:w-full group hover:z-30' key={index}>
												<div className='pb-[100%] relative cursor-pointer overflow-hidden' box-wrap="">
													<img src={p.imgSrc} className='absolute-center w-full h-full object-cover transition duration-700 group-hover:scale-[1.15]' onError={()=>{imgLoadError(p.imgId)}} onClick={handleEnlarge} img-id={p.imgId} alt=""/>
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
									</>
								): ''
							}
							

						</div>
					</div>
				) : ''
			}
		</div>
	)
}
