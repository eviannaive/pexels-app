import mongoose from "mongoose";

// let isConnected = false;
console.log(process.env.MONGODB_CONNECTION,'urllll')

export async function connectDB(){
  // if(isConnected){
  //   console.log('DB connected already!')
  //   return;
  // }
  try{
    console.log('連接DB...npm run dev');
    await mongoose.connect(String(process.env.MONGODB_CONNECTION)).then(()=>{
      console.log('connect DB successful')
      // isConnected = true
    })
  }catch(error){
    console.log(error)
  }
}