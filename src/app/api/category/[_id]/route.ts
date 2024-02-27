import User from "@/models/User";
import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { nanoid } from "nanoid";

// 新增 group
export async function POST(req: Request,{params}:{params: {
  _id: string
}}){
  try{
    await connectDB();
    const { _id } = params;
    const { fileName } = await req.json();
    const mongoId = new ObjectId(_id);
    const userExist = await User.findOne({_id: mongoId});
    
    if(userExist){
      const newItem = {
        groupId: nanoid(),
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