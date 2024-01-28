"use client"
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Login(){
  return (
    <div className="flex h-full min-h-custom justify-center items-center">
      <div className="my-[60px] mx-[20px] flex flex-col bg-white p-[40px] rounded-md">
        <div className="text-indigo-700">Don't have any account?</div>
        <form action="">
          <label>
            <div>email:</div>
            <input type="text" className="border-2"/>
          </label>
          <label>
            <div>password:</div>
            <input type="text" className="border-2"/>
          </label>
          <button className="block">Log in</button>
        </form>
        <div>
          or
        </div>
        <div className="flex flex-col">
          <button className="p-3 text-left" onClick={()=>{signIn('google')}}>Log In With Google</button>
          <button className="p-3 text-left">Log In With Facebook</button>
          <button className="p-3 text-left">Log In With Github</button>
        </div>
      </div>
    </div>
  )
}