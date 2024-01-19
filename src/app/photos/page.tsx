"use client"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBinoculars, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useMemo, useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { Loading } from '@/components/Loading';
import Pagination from '@/components/Pagination';

const pexelsKey = process.env.NEXT_PUBLIC_PEXELS_KET;
	
export default function Photos() {
	const perPage = 12;

	// default keyword
	const demoList = ['cat flower','lake boat','desert night meteor','european style architecture','violin','bridge','rainbow'];

	// useState
	let [searchBtnShow, setSearchBtnShow] = useState(false);
	let [inputValue, setInputValue] = useState('');
	let [resultInfo, setResultInfo] = useState({});
	let [photosArr, setPhotosArr] = useState([]);
	let [loading, setLoading] = useState(true)

	// confirm fetch once
	const initFetch = useRef('')
	const firstSearch = useRef(true)

	// memo static data
	const searchMemo = useMemo(()=>{
		return {
			input: inputValue || initFetch.current,
			length: photosArr.length,
			pages: Math.ceil(resultInfo.total_results / perPage)
		}
	},[photosArr])

	// dynamic search button
	const inputHandler = (e) => {
		const value = e.target.value;
		if(value) setSearchBtnShow(true)
		else setSearchBtnShow(false)
		setInputValue(e.target.value)
		console.log(inputValue)
	}

	// fetch
	const fetchData = async ({value, url, page = 1} : {value?: string, url?: string, page?:number}) => {
		setLoading(true)
		const searchURL = url || `https://api.pexels.com/v1/search?query=${value}&per_page=${perPage}&page=${page}`
		console.log(searchURL)
		const result = await axios.get(searchURL,{
			headers:{
				Authorization: pexelsKey
			}
		})
		setResultInfo(result.data)
		setPhotosArr(result.data.photos)
		setLoading(false)
		console.log(result.data)
	}

	// search
	const searchHandler = () => {
		if(searchMemo.input === inputValue) return;
		fetchData({value: inputValue})
		firstSearch.current = false
	}

	useEffect(()=>{
		if (!initFetch.current) {
			const randomKeyword = demoList[Math.floor(Math.random()*demoList.length)]
			initFetch.current = randomKeyword;
			// setInputValue(randomKeyword)
			fetchData({value: randomKeyword});
		}
	},[]) 

	// pagination event
	const paginationHandler = {
    prev(){
			fetchData({url:resultInfo.prev_page})
		},
    next(){
			fetchData({url:resultInfo.next_page})
		},
		toPage(page : number){
			const pageNum = page > searchMemo.pages ? searchMemo.pages : page 
			fetchData({value:searchMemo.input, page: pageNum});
		}
  };

	return (
		<div className='pt-[50px] pb-[120px] px-[80px] max-w-[1500px] mx-auto'>
			{ 
				<div className={`flex justify-center items-center overflow-hidden transition-all duration-500 ${!firstSearch.current ? 'h-0 opacity-0' : 'h-[80px] opacity-1'}`}>
					<p className={`text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-teal-600`}>Please input any keyword of your search.</p>
				</div>
			}
			<div className='text-center mt-[30px] mb-[50px]'>
				<label className={`bg-white rounded-50px inline-flex items-center py-[6px] px-[8px] text-lg border-0 w-full max-w-[400px] ${loading? 'pointer-events-none' : ''}`}>
					<input type="text" placeholder={`${initFetch.current} ...`} className='bg-white/0 focus:outline-none text-slate-700 font-medium grow px-4' onChange={inputHandler} />
					<div className='w-[40px] h-[40px] flex justify-center items-center relative'>
						<div className={`w-full h-full bg-rose-100 rounded-full absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] scale-0 transition-transform duration-500 cursor-pointer ${searchBtnShow?'scale-100':''}`} onClick={searchHandler}></div>
						<FontAwesomeIcon icon={faMagnifyingGlass} color="#28ad80" className='relative z-10 pointer-events-none'/>
					</div>
				</label>
			</div>
			{
				loading ? (
					<div className='text-2xl text-center'>
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
											(Array(Math.ceil(photosArr.length / 4) * 4).fill(null).map((b,index)=>
											<div className='w-[25%] border-r-2 border-b-2 border-dashed border-slate-400 p-[5px]'>
												<div className='pb-[100%] relative'>
													{ photosArr[index] && (
														<img src={photosArr[index]?.src.large} alt="" className='absolute-center w-full h-full object-cover'/>
													)}
												</div>
											</div>))
										}
									</div>
									{
										searchMemo.pages ?
											<div className='flex px-3 justify-end'>
												<Pagination data={resultInfo} totalPages = {searchMemo.pages} event={paginationHandler}></Pagination>
											</div> : ''
									}
						</div>
							) : (
								<div className='text-lg text-zinc-700 text-center py-[60px]'>
									<FontAwesomeIcon icon={faBinoculars} size="4x"/>
									<p className='mt-[20px]'>
										<span>We couldn’t find anything for </span>
										<span className='underline underline-offset-8 decoration-amber-600 text-2xl font-medium'>{searchMemo.input}</span>
										<span>.</span>
									</p>
									<p className='mt-2'>Try to refine your search.</p>
								</div>
							)
						}
					</div>) : ''
			}
		</div>
	)
}
