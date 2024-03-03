export default function delay(time: number){
  let timer : NodeJS.Timeout;
  return new Promise(res=>{
    timer = setTimeout(()=>{
      console.log('timeout')
      res('');
      clearTimeout(timer)
    },time)
  })
}