"use client"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useMemo, useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Image from 'next/image';

const pexelsKey = process.env.NEXT_PUBLIC_PEXELS_KET;
	
export default function Photos() {
	const demoList = ['cat flower','lake boat','desert night meteor','european style architecture','violin','bridge','rainbow'];
	let [searchBtnShow, setSearchBtnShow] = useState(false);
	let [inputValue, setInputValue] = useState('');
	let [data, setData] = useState([]);
	let [loading, setLoading] = useState(true)
	const initFetch = useRef('')
	const searchMemo = useMemo(()=>{return {input:inputValue,length:data.length}},[data])
	const inputHandler = (e) => {
		const value = e.target.value;
		if(value) setSearchBtnShow(true)
		else setSearchBtnShow(false)
		setInputValue(e.target.value)
	}
	const fetchData = async (value:any) => {
		setLoading(true)
		const searchURL =`https://api.pexels.com/v1/search?query=${value}&per_page=12&page=1`
		const data = await axios.get(searchURL,{
			headers:{
				Authorization: pexelsKey
			}
		})
		setData(data.data.photos)
		setLoading(false)
	}
	const searchHandler = () => {
		if(searchMemo.input === inputValue) return;
		fetchData(inputValue)
	}
	useEffect(()=>{
		if (!initFetch.current) {
			initFetch.current = demoList[Math.floor(Math.random()*demoList.length)]
			fetchData(initFetch.current);
		}
	},[]) 

	return (
		<div className='pt-[50px] pb-[120px]'>
			{ 
				<div className={`flex justify-center items-center overflow-hidden transition-all duration-500 ${searchMemo.input ? 'h-0 opacity-0' : 'h-[80px] opacity-1'}`}>
					<p className={`text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-teal-600`}>Please input any keyword of your search.</p>
				</div>
			}
			<div className='text-center mt-[30px] mb-[50px]'>
				<label className={`bg-white rounded-50px inline-flex items-center py-[6px] px-[8px] text-lg border-0 w-[80%] max-w-[400px] ${loading? 'pointer-events-none' : ''}`}>
					<input type="text" placeholder={`${initFetch.current} ...`} className='bg-white/0 focus:outline-none text-slate-700 font-medium grow px-4' onChange={inputHandler}/>
					<div className='w-[40px] h-[40px] flex justify-center items-center relative'>
						<div className={`w-full h-full bg-rose-100 rounded-full absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] scale-0 transition-transform duration-500 cursor-pointer ${searchBtnShow?'scale-100':''}`} onClick={searchHandler}></div>
						<FontAwesomeIcon icon={faMagnifyingGlass} color="#28ad80" className='relative z-10 pointer-events-none'/>
					</div>
				</label>
			</div>
			{
				loading ? (<div className='text-2xl text-center'>loading
				<div className='loader'></div></div>) : ''
			}
			{
				!loading ?
					(<div className='flex items-center flex-col'>
						{	
							searchMemo.length ? (
								<div className='flex flex-wrap border-l-2 border-t-2 border-dashed border-slate-400 w-[80%]'>
							{
								(Array(Math.ceil(data.length / 4) * 4).fill(null).map((b,index)=>
								<div className='w-[25%] border-r-2 border-b-2 border-dashed border-slate-400 p-[5px]'>
									<div className='pb-[100%] relative'>
										{ data[index] && (
											<img src={data[index].src.large} alt="" className='absolute-center w-full h-full object-cover'/>
										)}
									</div>
								</div>))
							}
						</div>
							) : (
								<div className='text-lg text-zinc-700 text-center'>
									<p>
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
