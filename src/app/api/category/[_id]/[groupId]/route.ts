import User from "@/models/User";
import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// 加入最愛
export async function POST(req: Request, { params } : {params: {
  _id: string,
  groupId: string
}}){
  try{
    await connectDB();
    const {_id, groupId} = params;
    const { imgId, imgSrc } = await req.json();
    const mongoId = new ObjectId(_id);
    console.log(imgId,imgSrc)
    if(!imgId || !imgSrc){
      return NextResponse.json({message: "fail"}, {status: 500})
    }
    const photoExist = await User.findOne(
      { _id: mongoId,
        'collections':{
          $elemMatch: {
            'groupId': groupId,
            'photos': {
              $elemMatch: {
                'imgId': imgId
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
            'imgId': imgId,
            'imgSrc': imgSrc
          }
        }
      },
      {
        arrayFilters: [
          {'elem.groupId': groupId}
        ]
      }
    )
    return NextResponse.json({meg: photoExist ? 'photo exist' : 'update',exist: !!photoExist},{status: 200})
  }
  catch(error){
    return NextResponse.json({message: "Error", error}, {status: 500})
  }
}

// 刪除group
export async function DELETE(req: Request, { params } : {params: any}){
  try{
    await connectDB();
    const {_id, groupId} = params;
    const mongoId = new ObjectId(_id);
    const updateData = await User.updateOne({
        _id: mongoId,
      },
      {
        $pull: {
          'collections': {
            'groupId': groupId
          }
        }
      },
    )
    return NextResponse.json({meg: 'delete successful!'},{status: 200})
  }
  catch(error){
    return NextResponse.json({message: "Error", error}, {status: 500})
  }
}

// group rename
export async function PATCH(req: Request, { params } : {params: any}){
  try{
    await connectDB();
    const {_id, groupId} = params;
    const { newName } = await req.json();
    const mongoId = new ObjectId(_id);
    const updateData = await User.updateOne({
        _id: mongoId,
      },
      {
        $set: {
          'collections.$[elem].name': newName
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