"use client"
import { TextTitle } from '@/components/Text';
import { ButtonLogin } from '@/components/Buttons';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import { useState, useTransition, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function Login(){
  const emailRef = useRef('');
  const passwordRef = useRef('')
  // const [ email, setEmail ] = useState("");
  // const [ password, setPassword ] = useState("");
  const [ error, setError ] = useState("");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const defaultUrl = "http://localhost:3000/dashboard";

  const signInBySocial = (provider : string)=>{
    signIn(provider,{callbackUrl: defaultUrl})
  }

  const handleSubmit = async (e) =>{
    e.preventDefault();
    setError('');
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    if(!email || !password) return setError('Please enter email and password')
    startTransition(async()=>{
      try{
        const res = await signIn("credentials", {
          email, password, redirect: false, callbackUrl: defaultUrl
        })
        if(res?.error){
          setError('Invalid Email or Password');
        }else{
          router.replace('/dashboard')
          router.refresh()
        }
      }catch(error){
        console.log('error')
      }
    })
  }
  return (
    <div className="flex h-full min-h-custom justify-center items-center py-[60px] px-[20px]">
      <div className="flex flex-col  max-w-80 w-full">
        <div className='text-center'>
          <TextTitle text="Welcome to <br>Pexels Collection" delay={0.5}></TextTitle>
        </div>
        <div className='bg-white rounded-lg py-[35px] px-[20px]'>
          <div className="text-neutral-600 text-sm">Don't have any account?
          </div>
          <div className='text-teal-600 font-bold text-right transition-all  hover:text-orange-400 ml-auto text-sm cursor-pointer'>sign up for free</div>
          <form onSubmit={handleSubmit} className="mt-4 text-neutral-600">
            <input name="email" type="text" className="border-2 w-full mt-1 rounded-md focus:outline-none p-1" placeholder="Email"  disabled={isPending} ref={emailRef}/>
            <input name="password" type="password" className="border-2 w-full rounded-md focus:outline-none p-1 mt-2" placeholder="Password" disabled={isPending} ref={passwordRef}/>
            {
              error && (
                <p className='text-red-500 mt-3 text-sm'>{error}</p>
              )
            }
            <ButtonLogin addClass="bg-violet-600 mt-3 border-none text-white" disabled={isPending}>Log In</ButtonLogin>
          </form>
          <div className='flex items-center mt-3'>
            <div className='w-full h-0.5 bg-slate-500/40'></div>
            <span className='mx-2 text-slate-500'>OR</span>
            <div className='w-full h-0.5 bg-slate-500/40'></div>
          </div>
          <div className="flex flex-col gap-3 mt-3">
            <ButtonLogin event={()=>{signInBySocial('google')}} disabled={isPending}>
              <Image src="https://authjs.dev/img/providers/google.svg" width="22" height="22" alt="google"/>
              <p>Login with Google</p>
            </ButtonLogin>
            <ButtonLogin event={()=>{signInBySocial('facebook')}} disabled={isPending}>
              <Image src="https://authjs.dev/img/providers/facebook.svg" width="24" height="24" alt="facebook"/>
              <p>Login with Facebook</p>
            </ButtonLogin>
            <ButtonLogin event={()=>{signInBySocial('github')}} disabled={isPending} addClass='bg-stone-900 text-white'>
              <Image src="https://authjs.dev/img/providers/github.svg" width="22" height="22" alt="github"/>
              <p>Login with Github</p>
            </ButtonLogin>
          </div>
        </div>
      </div>
    </div>
  )
}