import User from "@/models/User";
import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";

export async function POST(req: Request){
  // req.body 會回傳一個 ReadableStream
  // 需要解析
  try {
    await connectDB();
    const data = await req.json();
    // 查看信箱是否重複
    const userExist = await User.findOne({email: data.email, provider: 'credentials'});
    if (userExist)
      return NextResponse.json({message: "This email has been registered."},{status: 403})
    else
      return NextResponse.json({status:200})
  }catch(err){
    console.log(err)
    return NextResponse.json({message: "please try again"},{status: 500})
  }
}