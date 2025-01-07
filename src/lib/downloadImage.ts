export default async function downloadImg(id : string,src :string){
  const imgBlob = await fetch(src).then((res)=>res.arrayBuffer()).then((buffer)=>new Blob([buffer],{type: "image/jpeg"}))
  const link = document.createElement('a');
  link.href= URL.createObjectURL(imgBlob);
  link.download = 'pexels-photo' + id;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};