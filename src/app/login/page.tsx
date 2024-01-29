"use client"
import { TextTitle } from '@/components/Text';
import { ButtonLogin } from '@/components/Buttons';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Login(){
  return (
    <div className="flex h-full min-h-custom justify-center items-center py-[60px] px-[20px]">
      <div className="flex flex-col  max-w-80 w-full">
        <div className='text-center'>
          <TextTitle text="Welcome to <br>Pexels Collection" delay={1}></TextTitle>
        </div>
        <div className='bg-white rounded-lg py-[40px] px-[20px]'>
          <div className="text-neutral-600 text-sm">Don't have any account?
          </div>
          <div className='text-teal-600 font-bold text-right transition-all  hover:text-orange-400 ml-auto text-sm cursor-pointer'>sign up for free</div>
          <form action="" className="mt-4">
            <label>
              <div>email:</div>
              <input type="text" className="border-2"/>
            </label>
            <label>
              <div>password:</div>
              <input type="text" className="border-2"/>
            </label>
            <ButtonLogin event={()=>{}} addClass="bg-amber-300 mt-3">Log In</ButtonLogin>
          </form>
          <div>
            or
          </div>
          <div className="flex flex-col gap-3 mt-3">
            <ButtonLogin event={()=>{signIn('google')}}>Log In With Google</ButtonLogin>
            <ButtonLogin event={()=>{signIn('google')}}>Log In With Facebook</ButtonLogin>
            <ButtonLogin event={()=>{signIn('google')}}>Log In With Github</ButtonLogin>
          </div>
        </div>
      </div>
    </div>
  )
}