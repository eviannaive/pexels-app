import Image from 'next/image'
import axios from "axios";
import Marquee from "react-fast-marquee"
import { ButtonExplore } from '@/components/Buttons'
import { TextTitle } from '@/components/Text'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from "@fortawesome/free-solid-svg-icons";

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
              <div className='w-64 h-64 relative overflow-hidden group cursor-pointer' key={index}>
                <img src={photo.src.large} className='w-full h-full object-cover transition duration-500 group-hover:scale-[1.15]'/>
                <div className='flex absolute bottom-0 right-2 p-[10px] opacity-0 transition duration-300 group-hover:opacity-100'>
                  <FontAwesomeIcon icon={faHeart} size="lg" color="#e61e7b"/>
                </div>
              </div>
            ))}
          </Marquee>
        ))
      }
      <div className='flex flex-col grow justify-center items-center my-[50px]'>
        <TextTitle text="Collect your favorite pictures." delay={1} />
        <ButtonExplore text="FIND MORE" delay={1.5} target="/photos" />
      </div>
    </div>
  )
}
