import User from "@/models/User";
import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function PATCH(req: Request){
  try{
    await connectDB();
    const {_id, photoData} = await req.json();
    const mongoId = new ObjectId(_id);
    const updateData = await User.updateOne({
        _id: mongoId,
      },
      {
        $pull: {
          'collections.$[elem].photos': {
            imgId:photoData.imgId,
          }
        }
      },
      {
        arrayFilters: [
          {'elem.groupId': photoData.groupId}
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