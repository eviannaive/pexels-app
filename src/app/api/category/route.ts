import User from "@/models/User";
import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";

export async function PATCH(req: Request){
  try{
    await connectDB();
    const {_id, fileName} = await req.json();
    console.log(_id,'fdsfdsfdsfsdfsdfsd')
    const userExist = await User.findOne({_id});
    const newItem = {
      name: fileName,
      photos: []
    };
    
    if(userExist){
      const updateData = await User.updateOne({_id},{
        $push: {
          collections: newItem
        }
      }
      )
      const finalData = await User.findOne({_id});
      return NextResponse.json({meg: 'update',collections: finalData.collections},{status: 200})
    }
  }catch(error){
    return NextResponse.json({message: "Error", error}, {status: 500})
  }
}