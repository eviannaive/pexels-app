import User from "@/models/User";
import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";
import bcrypt from 'bcrypt'

export async function POST(req: Request){
  try{
    await connectDB();
    const data = await req.json();
    const password = await bcrypt.hash(data.password, 10)
    const createUser = await User.create({
      name: data.name,
      email: data.email,
      password: password,
      provider: 'credentials'
    });
    delete createUser.password
    return NextResponse.json(createUser,{status: 201})
  }catch(error){
    console.log(error)
    return NextResponse.json(error,{status: 500})
  }
}