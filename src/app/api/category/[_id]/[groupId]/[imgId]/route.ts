import User from "@/models/User";
import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// 移除最愛
export async function DELETE(req: Request, { params } : {params: {
  _id: string,
  groupId: string,
  imgId: string
}}){
  try{
    await connectDB();
    const {_id, groupId, imgId} = params;
    const mongoId = new ObjectId(_id);
    const updateData = await User.updateOne({
        _id: mongoId,
      },
      {
        $pull: {
          'collections.$[elem].photos': {
            imgId: imgId,
          }
        }
      },
      {
        arrayFilters: [
          {'elem.groupId': groupId}
        ]
      }
    )
    return NextResponse.json({meg: 'delete successful!'},{status: 200})
  }
  catch(error){
    return NextResponse.json({message: "Error", error}, {status: 500})
  }
}