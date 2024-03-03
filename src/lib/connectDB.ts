import mongoose from "mongoose";

const mongodbUrl = process.env.MONGODB_CONNECTION!!

export async function connectDB(){
  try{
    console.log('connecting DB...');
    console.log(mongodbUrl)
    await mongoose.connect(mongodbUrl).then(()=>{
      console.log('connect DB successful')
    })
  }catch(error){
    console.log(error)
  }
}