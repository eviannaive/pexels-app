import Image from 'next/image'
import axios from "axios";
import Marquee from "react-fast-marquee"
import { ButtonExplore } from '@/components/Buttons'
import dynamic from 'next/dynamic'

const pexelsKey = process.env.NEXT_PUBLIC_PEXELS_KET;

const randomPage = () => {
  return Math.floor(Math.random()*50)
}

const initPhoto = async () => {
  let result = await axios.get("https://api.pexels.com/v1/curated?page="+randomPage()+"&per_page=30",{
    headers:{
      Authorization: pexelsKey
    }
  })
  return result.data.photos
}

export default async function Home() {
  const dataWrap = await Promise.all(Array(2).fill(null).map(d=>initPhoto()))
  return (
    <div className="flex flex-col w-full min-h-custom">
      {
        dataWrap.map((data,index)=>(
          <Marquee direction={index%2? 'left': 'right'} key={index}>
            {data.map((photo,index)=>(
              <div className='w-64 h-64 relative overflow-hidden' key={index}>
                <img src={photo.src.large} className='w-full h-full object-cover transition duration-500 hover:scale-[1.15]'/>
              </div>
            ))}
          </Marquee>
        ))
      }
      <div className='flex flex-col grow justify-center items-center my-[50px]'>
        <h3 className='mb-[25px] text-3xl text-violet-600 font-bold tracking-wider'>Collect your favorite pictures.</h3>
        <ButtonExplore text="EXPLORE" delay={1} />
      </div>
    </div>
  )
}
