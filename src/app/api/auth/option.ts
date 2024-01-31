import User from '@/models/User'
import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import passport from 'passport'
import { localStrategy } from '@/lib/passport'
import { connectDB } from '@/lib/connectDB'

// export async function POST(req: Request){
//   try{
//     await connectDB();
//     const data = await req.json();
//     const findUser = await User.findOne({email: data.email});
//     console.log(findUser,data)
//     if(findUser){
//       const result = await bcrypt.compare(data.password, findUser.password);
//       if(result){
//         console.log('密碼正確');
//         const tokenObject = {
//           _id: findUser._id,
//           email: findUser.email
//         };
//         const token = jwt.sign(tokenObject, process.env.NEXT_PUBLIC_SECRET);
//         return NextResponse.json({
//           message: '成功登入',
//           user: findUser
//         },{status: 200,headers: {
//           'Set-Cookie': `token=${token}`}
//         })
//       }else{
//         console.log('密碼錯誤')
//         return NextResponse.json({
//           message: '密碼錯誤'
//         },{status: 401})
//       }
//     }
//   }catch(e){
//     return NextResponse.json(e)
//   }
// }