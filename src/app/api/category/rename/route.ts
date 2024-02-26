import User from "@/models/User";
import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function PATCH(req: Request){
  try{
    await connectDB();
    const {_id, groupData} = await req.json();
    const mongoId = new ObjectId(_id);
    console.log(groupData.name)
    const updateData = await User.updateOne({
        _id: mongoId,
      },
      {
        $set: {
          'collections.$[elem].name': groupData.name
        }
      },
      {
        arrayFilters: [
          {'elem.groupId': groupData.groupId}
        ]
      }
    )
    console.log(updateData)
    return NextResponse.json({meg: 'delete successful!'},{status: 200})
  }
  catch(error){
    return NextResponse.json({message: "Error", error}, {status: 500})
  }
}