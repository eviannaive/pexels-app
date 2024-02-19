import User from "@/models/User";
import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function PATCH(req: Request){
  try{
    await connectDB();
    const {_id, fileName} = await req.json();
    const mongoId = new ObjectId(_id);
    const userExist = await User.findOne({_id: mongoId});
    
    if(userExist){
      const newItem = {
        groupId: String(userExist.collections.length).padStart(5,'0'),
        name: fileName,
        photos: []
      };
      const updateData = await User.updateOne({_id: mongoId},{
        $push: {
          collections: newItem
        }
      }
      )
      const finalData = await User.findOne({_id: mongoId});
      return NextResponse.json({meg: 'update',collections: finalData.collections},{status: 200})
    }
  }catch(error){
    return NextResponse.json({message: "Error", error}, {status: 500})
  }
}