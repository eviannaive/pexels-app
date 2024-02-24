"use client"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart,faDownload  } from "@fortawesome/free-solid-svg-icons";
import { faHeart as reqularHeart} from "@fortawesome/free-regular-svg-icons";
import { useMemo, useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Pagination from '@/components/Pagination';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

// context
import { useModalContext } from "@/context/ModalContext";
import { useSearchContext } from '@/context/searchContext';

// components
import { Loading } from '@/components/Loading';
import { NoResult } from '@/components/NoResult';
import SearchBar from '@/components/SearchBar';
import ImgBox from '@/components/ImgBox';
import { Enlarge } from '@/components/Enlarge';



const pexelsKey = process.env.NEXT_PUBLIC_PEXELS_KET;

export default function Photos() {
	const { data: session } = useSession();

	let {
			setSearchBtnShow,
			inputValue,
			resultInfo, setResultInfo,
			photosArr, setPhotosArr,
			loading, setLoading,
			initFetch,
			firstSearch,
			inputRef
		} : any = useSearchContext()
		
		const { modalShow, setModalShow, modalType, setModalType, imgId, setImgId, imgSrc, setImgSrc,downloadImg} : any = useModalContext()
		
		const perPage = 12;
		
		const [enlargeShow, setEnlargeShow] = useState(false);
		
		const modalOpen = (e: MouseEvent) => {
			setModalShow(true);
			session ? setModalType('like') : setModalType('login');
			setImgId(String(e.target?.closest('[box-wrap]').firstChild.getAttribute('img-id')))
			setImgSrc(String(e.target?.closest('[box-wrap]').firstChild.getAttribute('src')))
		}
		
		const handleEnlarge = (e) => {
			setImgId(String(e.target?.getAttribute('img-id')))
			setImgSrc(String(e.target?.getAttribute('src')))
			setEnlargeShow(true)
		}

	// default keyword
	const demoList = ['cat flower','lake boat','desert night meteor','european style architecture','violin','bridge','rainbow'];

	const searchParams = useSearchParams();
	const pathname = usePathname()
	const router = useRouter();
	class SearchPropControl {
		params = new URLSearchParams(searchParams)
		constructor(){
			console.log('new SearchPropControl')
		}
		setProp({value, page} : {value?: string, page?: number}){
			value && this.params.set('query',value);
			page && page > 1 ? this.params.set('page',String(page)) : this.params.delete('page');
			this.setUrl()
		}
		getSearchProp(){
			const query = this.params.get('query')
			const page = this.params.get('page')
			return {query, page}
		}
		propPageReset(){
			this.params.delete('page')
			this.setUrl()
		}
		setUrl(){
			router.replace(`${pathname}?${this.params.toString()}`)
		}
	}

	// memo static data
	const searchMemo = useMemo(()=>{
		return {
			input: inputValue || initFetch.current,
			length: photosArr.length,
			allPages: Math.ceil(resultInfo.total_results / perPage),
		}
	},[photosArr])

	const urlMemo = useMemo(()=>{
		return new SearchPropControl()
	},[])


	// fetch
	const fetchData = async ({value, url, page = 1} : {value?: string, url?: string, page?:number}) => {
		setLoading(true)
		const searchURL = url || `https://api.pexels.com/v1/search?query=${value}&per_page=${perPage}&page=${page}`
		const result = await axios.get(searchURL,{
			headers:{
				Authorization: pexelsKey
			}
		})
		console.log(result.data.photos)
		setResultInfo(result.data)
		setPhotosArr(result.data.photos)
		setLoading(false)
		console.log(result.data)
	}

	// search
	const searchHandler = () => {
		if(searchMemo.input === inputValue) return;
		fetchData({value: inputValue})
		urlMemo.setProp({value:inputValue})
		urlMemo.propPageReset()
		firstSearch.current = false
	}

	useEffect(()=>{
		if (!initFetch.current) {
			const {query, page} = urlMemo.getSearchProp();
			if(query) {
				firstSearch.current = false;
				inputRef.current.value = query;
				setSearchBtnShow(true)
			}

			const randomKeyword = demoList[Math.floor(Math.random()*demoList.length)]
			initFetch.current = randomKeyword;
			fetchData({value: query??randomKeyword, page: Number(page)});
		}
	},[]) 

	// pagination event
	class PaginationControl {
		constructor(){
			console.log('new PaginationControl')
		}
		setPageProp(pageNum: number){
			urlMemo.setProp({page: pageNum})
		}
		async prev(){
			if(!resultInfo.prev_page) return
			await fetchData({url:resultInfo.prev_page})
			console.log(resultInfo.page - 1)
			this.setPageProp(resultInfo.page - 1)
		}
		async next(){
			if(!resultInfo.next_page) return
			await fetchData({url:resultInfo.next_page})
			this.setPageProp(resultInfo.page + 1)
		}
		async toPage(page : number){
			const pageNum = page > searchMemo.allPages ? searchMemo.allPages : page 
			await fetchData({value: searchMemo.input, page: pageNum});
			this.setPageProp(pageNum)
		}
	}

	const paginationHandler = useMemo(()=>{
		return new PaginationControl
	},[resultInfo])

	return (
		<div className='pt-[50px] pb-[120px] px-[80px] max-w-[1500px] mx-auto'>
			<Enlarge state={enlargeShow} setEnlargeShow={setEnlargeShow} eventLike={modalOpen}/>
			{ 
				<div className={`flex justify-center items-center overflow-hidden transition-all duration-500 ${!firstSearch.current ? 'h-0 opacity-0' : 'h-[80px] opacity-1'}`}>
					<p className={`text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-teal-600`}>Please input any keyword of your search.</p>
				</div>
			}
			<div className='text-center mt-[30px] mb-[50px]'>
				<SearchBar event={searchHandler}/>
			</div>
			{
				loading ? (
					<div className='text-2xl text-center my-[80px]'>
						<Loading />	
					</div>
				) : ''
			}
			{
				!loading ?
					(<div className='flex items-center flex-col'>
						{	
							searchMemo.length ? (
								<div className='w-full'>
									<div className='flex flex-wrap border-l-2 border-t-2 border-dashed border-slate-400 w-full'>
										{
											(Array(Math.ceil(photosArr.length / 4) * 4).fill(null).map((photo,index)=>
											<div className='w-[25%] border-r-2 border-b-2 border-dashed border-slate-400 p-[5px] '>
												{
													photosArr[index] && (
														<div className='pb-[100%] relative group cursor-pointer overflow-hidden' box-wrap="">
															<img src={photosArr[index]?.src.large} alt="" className='absolute-center w-full h-full object-cover transition duration-700 group-hover:scale-[1.15]' onClick={handleEnlarge} img-id={photosArr[index]?.id}/>
															<div className='flex absolute bottom-3 right-2 p-[10px] opacity-0 transition duration-500 group-hover:opacity-100 flex-col gap-3'>
																<div className='opacity-75 hover:opacity-100 transition-all' onClick={modalOpen}>
																	<FontAwesomeIcon icon={faHeart} size="lg" color="#f9f9f9"/>
																</div>
																<div className='opacity-75 hover:opacity-100 transition-all' onClick={downloadImg}>
																	<FontAwesomeIcon icon={faDownload} size="lg" color="#f9f9f9"/>
																</div>
															</div>
														
														</div>
													)
												}
											</div>))
										}
									</div>
									{
										!firstSearch.current && searchMemo.allPages ?
											<div className='flex px-3 justify-end'>
												<Pagination totalPages = {searchMemo.allPages} event={paginationHandler}/>
											</div> : ''
									}
						</div>
							) : (
								<div className='text-lg text-zinc-700 text-center py-[60px]'>
									<NoResult text={searchMemo.input}/>
								</div>
							)
						}
					</div>) : ''
			}
		</div>
	)
}
