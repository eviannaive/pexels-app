import User from "@/models/User";
import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// 取得資料
export async function GET(req: Request, { params } : {params: any}){
  try{
    await connectDB();
    const { _id } = params;
    const mongoId = new ObjectId(_id);
    const findUser = await User.findOne({
        _id: mongoId,
      },
    );

    delete findUser.password

    return NextResponse.json({user: findUser},{status: 200})
  }
  catch(error){
    return NextResponse.json({message: "Error", error}, {status: 500})
  }
}


// 更新資料
export async function PATCH(req: Request, { params } : {params: any}){
  try{
    await connectDB();
    const { _id} = params;
    const data = await req.json();
    console.log(data,'dddddddd')
    const mongoId = new ObjectId(_id);
    const findUser = await User.findOne({
        _id: mongoId,
      },
    );
    findUser.imgData = data.imgData
    await findUser.save()
    const updateData = await User.updateOne({
        _id: mongoId,
      },
      {
        $set: {
          ...data
        }
      },
      { upsert: true }
    )
    return NextResponse.json({meg: 'delete successful!'},{status: 200})
  }
  catch(error){
    return NextResponse.json({message: "Error", error}, {status: 500})
  }
}