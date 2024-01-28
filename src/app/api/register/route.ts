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
    const userExist = await User.findOne({email: data.email});
    if (userExist)
      return NextResponse.json({message: "This email address has already been registered."},{status: 400})
    const saveData = await User.create(data);
    return NextResponse.json({message: "Registration successful!",saveData},{status:201})
  }catch(e){
    return NextResponse.json(e)
  }
}