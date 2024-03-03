export default function delay(time: number){
  let timer : NodeJS.Timeout;
  return new Promise(res=>{
    timer = setTimeout(()=>{
      res('');
      clearTimeout(timer)
    },time)
  })
}