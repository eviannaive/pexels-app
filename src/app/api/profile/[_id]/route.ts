import User from "@/models/User";
import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// 更新資料
export async function PATCH(req: Request, { params } : {params: any}){
  try{
    await connectDB();
    const { _id} = params;
    const data = await req.json();
    console.log(_id,'dddddddd')
    const mongoId = new ObjectId(_id);
    const findUser = await User.findOne({
        _id: mongoId,
      },
    );
    console.log(findUser)
    const updateData = await User.updateOne({
        _id: mongoId,
      },
      {
        $set: {
          ...data
        }
      },
    )
    console.log(updateData)
    return NextResponse.json({meg: 'delete successful!'},{status: 200})
  }
  catch(error){
    return NextResponse.json({message: "Error", error}, {status: 500})
  }
}