// export default function delay(time: number){
//   let timer : NodeJS.Timeout;
//   return new Promise(res=>{
//     timer = setTimeout(()=>{
//       res('');
//       clearTimeout(timer)
//     },time)
//   })
// }

export default function delay(ms: number){
  return new Promise((res)=>setTimeout(res,ms))
}
