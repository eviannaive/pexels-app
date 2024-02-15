import mongoose from "mongoose";

let isConnected = false;

export async function connectDB(){
  if(isConnected){
    console.log('DB connected already!')
    return;
  }
  try{
    console.log('連接DB...npm run dev');
    await mongoose.connect('mongodb://127.0.0.1/pexelsApp').then(()=>{
      console.log('connect DB successful')
      isConnected = true
    })
  }catch(error){
    console.log(error)
  }
}