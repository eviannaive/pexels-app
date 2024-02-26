import User from "@/models/User";
import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function PATCH(req: Request){
  try{
    await connectDB();
    const {_id, photoData} = await req.json();
    const mongoId = new ObjectId(_id);
    if(!photoData.imgId || !photoData.imgSrc){
      console.log(photoData.imgId,photoData.imgSrc)
      return NextResponse.json({message: "fail"}, {status: 500})
    }
    const photoExist = await User.findOne(
      { _id: mongoId,
        'collections':{
          $elemMatch: {
            'groupId':photoData.groupId,
            'photos': {
              $elemMatch: {
                'imgId':photoData.imgId
              }
            }
          }
        }
      }
    )
    const updateData = await User.updateOne({_id: mongoId},
      {
        $addToSet: {
          'collections.$[elem].photos': {
            imgId:photoData.imgId,
            imgSrc:photoData.imgSrc
          }
        }
      },
      {
        arrayFilters: [
          {'elem.groupId': photoData.groupId}
        ]
      }
    )
    return NextResponse.json({meg: photoExist ? 'photo exist' : 'update',exist: !!photoExist},{status: 200})
  }
  catch(error){
    return NextResponse.json({message: "Error", error}, {status: 500})
  }
}