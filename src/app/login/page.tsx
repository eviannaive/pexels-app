"use client"
import { TextTitle } from '@/components/Text';
import { ButtonLogin } from '@/components/Buttons';
import { useSession, signIn, signOut } from 'next-auth/react';
import Image from 'next/image';

export default function Login(){
  return (
    <div className="flex h-full min-h-custom justify-center items-center py-[60px] px-[20px]">
      <div className="flex flex-col  max-w-80 w-full">
        <div className='text-center'>
          <TextTitle text="Welcome to <br>Pexels Collection" delay={1}></TextTitle>
        </div>
        <div className='bg-white rounded-lg py-[35px] px-[20px]'>
          <div className="text-neutral-600 text-sm">Don't have any account?
          </div>
          <div className='text-teal-600 font-bold text-right transition-all  hover:text-orange-400 ml-auto text-sm cursor-pointer'>sign up for free</div>
          <form action="" className="mt-4 text-neutral-600">
            <input type="text" className="border-2 w-full mt-1 rounded-md focus:outline-none p-1" placeholder="Email"/>
            <input type="text" className="border-2 w-full rounded-md focus:outline-none p-1 mt-2" placeholder="Password"/>
            <ButtonLogin event={()=>{}} addClass="bg-violet-600 mt-3 border-none text-white">Log In</ButtonLogin>
          </form>
          <div className='flex items-center mt-3'>
            <div className='w-full h-0.5 bg-slate-500/40'></div>
            <span className='mx-2 text-slate-500'>OR</span>
            <div className='w-full h-0.5 bg-slate-500/40'></div>
          </div>
          <div className="flex flex-col gap-3 mt-3">
            <ButtonLogin event={()=>{signIn('google')}}>
              <Image src="https://authjs.dev/img/providers/google.svg" width="22" height="22" alt="google"/>
              <p>Log In With Google</p>
            </ButtonLogin>
            <ButtonLogin event={()=>{signIn('google')}}>
              <Image src="https://authjs.dev/img/providers/facebook.svg" width="24" height="24" alt="facebook"/>
              <p>Log In With Facebook</p>
            </ButtonLogin>
            <ButtonLogin event={()=>{signIn('google')}} addClass='bg-stone-900'>
              <Image src="https://authjs.dev/img/providers/github.svg" width="22" height="22" alt="github"/>
              <p className='text-white'>Log In With Github</p>
            </ButtonLogin>
          </div>
        </div>
      </div>
    </div>
  )
}