import axios, { AxiosResponse } from 'axios';

const pexelsKey = process.env.NEXT_PUBLIC_PEXELS_KET!;

export default async function imgValidateError(id : string,callback: (res : AxiosResponse)=>void){
  console.warn('img load error,refetch ...')
  await axios.get(`https://api.pexels.com/v1/photos/${id}`,{
    headers: {
      Authorization: pexelsKey
    }
  }).then((res)=>{
    callback(res)
  })
}