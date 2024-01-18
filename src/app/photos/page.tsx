"use client"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useMemo, useRef, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';

const pexelsKey = process.env.NEXT_PUBLIC_PEXELS_KET;
	
export default function Photos() {
	let [searchBtnShow, setSearchBtnShow] = useState(false);
	let [inputValue, setInputValue] = useState('');
	let [data, setData] = useState([]);
	const searchValue = useMemo(()=>{return {input:inputValue,length:data.length}},[data])
	const inputHandler = (e) => {
		const value = e.target.value;
		if(value) setSearchBtnShow(true)
		else setSearchBtnShow(false)
		setInputValue(e.target.value)
		console.log(searchValue,e.target.value,searchValue && e.target.value)
	}
	const fetchData = async () => {
		const searchURL =`https://api.pexels.com/v1/search?query=${inputValue}&per_page=12&page=1`
		const data = await axios.get(searchURL,{
			headers:{
				Authorization: pexelsKey
			}
		})
		setData(data.data.photos)
	}
	const searchHandler = () => {
		fetchData()
		console.log(searchValue,'@@@@')
	}

	return (
		<div>
			<div className='text-center my-[50px]'>
				<label className='bg-white rounded-50px inline-flex items-center py-[6px] px-[8px] text-lg border-0 w-[80%] max-w-[400px]'>
					<input type="text" placeholder="snow cats forest ..." className='bg-white/0 focus:outline-none text-slate-700 font-medium grow px-4' onChange={inputHandler}/>
					<div className='w-[40px] h-[40px] flex justify-center items-center relative'>
						<div className={`w-full h-full bg-rose-100 rounded-full absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] scale-0 transition-transform duration-500 cursor-pointer ${searchBtnShow?'scale-100':''}`} onClick={searchHandler}></div>
						<FontAwesomeIcon icon={faMagnifyingGlass} color="#28ad80" className='relative z-10 pointer-events-none'/>
					</div>
				</label>
			</div>
			<div className='flex items-center flex-col'>
				{	searchValue.input ?
					(searchValue.length && inputValue !== '') ? (
						<div className='flex flex-wrap border-l border-t border-dashed border-slate-100 w-[80%]'>
					{
						(Array(12).fill(null).map((b,index)=>
						<div className='w-[25%] border-r border-b border-dashed border-slate-100 p-[5px]'>
							<div className='pb-[100%] relative'>
								{ data[index] && (
									<img src={data[index].src.large} alt="" className='absolute-center w-full h-full object-cover'/>
								)}
							</div>
						</div>))
					}
				</div>
					) : (
						<div>
							{`We couldn’t find anything for "${searchValue.input}".
Try to refine your search`}.
						</div>
					) : ''
				}
				


			</div>
		</div>
	)
}
