import Image from "next/image"

const ImgBox = ({url} : {url?: string}) => {
  return <div className='pb-[100%] relative'>
    {
      url && <Image src={url} layout="fill" objectFit="cover" className='absolute-center w-full h-full object-cover' alt=""/>
    }
  </div>
}

export default ImgBox
