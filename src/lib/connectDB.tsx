import mongoose from "mongoose";

let isConnected = false;

export async function connectDB(){
  if(isConnected){
    console.log('DB connected already!')
    return;
  }
  try{
    await mongoose.connect('mongodb://127.0.0.1/exampleDB').then(()=>{
      console.log('connect DB successful')
      isConnected = true
    })
  }catch(error){
    console.log(error)
  }
}