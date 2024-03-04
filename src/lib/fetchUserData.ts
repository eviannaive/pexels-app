import axios, { AxiosResponse } from "axios";

export default async function fetchUserData(id : string, cb?:(res: AxiosResponse)=>void){
  let result;
  await axios.get(`/api/profile/${id}`).then((res)=>{
    cb?.(res)
    result = res.data.user
  })
  return result
}