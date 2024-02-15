"use client"
import { TextTitle } from '@/components/Text';
import { ButtonLogin } from '@/components/Buttons';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import { useState, useTransition, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion, MotionConfig } from "framer-motion"

export default function Login(){
  const [formSwitch, setFormSwitch] = useState(true);
  const [registerStep, setRegisterStep] = useState(false);
  const emailRef = useRef('');
  const passwordRef = useRef('');
  const signUpEmail = useRef('');
  const usernameRef = useRef('');
  const firstPw = useRef('');
  const confirmPw = useRef('');
  const [ error, setError ] = useState("");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const defaultUrl = "http://localhost:3000/dashboard";

  const handleFormSwitch = () => {
    setFormSwitch(!formSwitch)
  }

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
  const handleRegister = async(e) => {
    e.preventDefault();
    setError('');
    axios.post('/api/register',{email: signUpEmail.current.value})
    .then((res)=>{
      setRegisterStep(true)
    })
    .catch((err)=>{
      console.log(err,'message')
      setError(err?.response.data.message)
    })
  }
  const finalRegister = async(e) =>{
    e.preventDefault();
    setError('');
    if(firstPw.current.value !== confirmPw.current.value){
      return setError('Passwords do not match!')
    }
    axios.post('/api/register/final',{
      name: usernameRef.current.value,
      email: signUpEmail.current.value,
      password: usernameRef.current.value,
    })
    .then((res)=>{
      console.log('送出成功')
      // 用router不能刷新
      window.location.reload();
    })
    .catch((err)=>{
      console.log(err,'message')
    })
  }
  return (
    <div className="flex h-full min-h-custom justify-center items-center py-[60px] px-[20px]">
      <MotionConfig transition={{ duration: 0.5, delay: 0.3 }}>
        <motion.div className="flex flex-col  max-w-80 w-full" initial={{ scale: 0 }} animate={{ scale: 1 }}>
          <div className='text-center'>
            <TextTitle text="Welcome to <br>Pexels Collection" delay={0.5}></TextTitle>
          </div>
          <div className="bg-white rounded-lg py-[35px] px-[20px]">
            <div className={`text-neutral-600 text-sm ${!formSwitch && 'inline-block'}`}>
            {formSwitch?"Don't have any account?":"Already have an account"}
            </div>
            <div className={`text-teal-600 font-bold text-right transition-all  hover:text-orange-400 text-sm cursor-pointer ${!formSwitch ?'inline-block ml-3':'ml-auto'}`} onClick={handleFormSwitch}>{ formSwitch ? 'Sign up for free' : 'Log in'}</div>
            { formSwitch && (
              <form onSubmit={handleSubmit} className="mt-4 text-neutral-600">
                <input name="email" type="email" className="border-2 w-full mt-1 rounded-md focus:outline-none p-1" placeholder="Email"  disabled={isPending} ref={emailRef}/>
                <input name="password" type="password" className="border-2 w-full rounded-md focus:outline-none p-1 mt-2" placeholder="Password" disabled={isPending} ref={passwordRef}/>
                {
                  error && (
                    <p className='text-red-500 mt-3 text-sm'>{error}</p>
                  )
                }
                <ButtonLogin addClass="bg-violet-600 mt-3 border-none text-white" disabled={isPending}>Log In</ButtonLogin>
              </form>
            )}
            {
              !formSwitch && (
                <form onSubmit={handleRegister} className="mt-4 text-neutral-600">
                  <label className='flex border-2 w-full mt-1 rounded-md items-center'>
                    <input name="email" type="email" className={` focus:outline-none p-1 flex-grow ${registerStep && 'opacity-70'}`} placeholder="Email" disabled={registerStep} ref={signUpEmail}/>
                    {
                      registerStep && (
                        <div className={`bg-green-600 text-white w-[20px] h-[20px] rounded-full mx-2 text-xs flex justify-center items-center`}>✔</div>
                      )
                    }
                  </label>
                {
                  error && !registerStep && (
                    <p className='text-red-500 mt-3 text-sm'>{error}</p>
                  )
                }
                {
                  !registerStep && (
                    <ButtonLogin addClass="bg-orange-400 mt-3 border-none text-white" disabled={isPending}>Sign Up</ButtonLogin>
                  )
                }
              </form>
              )
            }
            { registerStep &&
              (
                <form onSubmit={handleRegister} className="mt-4 text-neutral-600">
                <input name="username" type="text" className="border-2 w-full mt-1 rounded-md focus:outline-none p-1" placeholder="Username"  disabled={isPending} ref={usernameRef}/>
                <input name="password" type="password" className="border-2 w-full mt-1 rounded-md focus:outline-none p-1" placeholder="Password"  disabled={isPending} ref={firstPw}/>
                <input name="confirm" type="password" className="border-2 w-full mt-1 rounded-md focus:outline-none p-1" placeholder="Confirm Password"  disabled={isPending} ref={confirmPw}/>
                {
                  error && (
                    <p className='text-red-500 mt-3 text-sm'>{error}</p>
                  )
                }
                <ButtonLogin addClass="bg-orange-400 mt-3 border-none text-white" disabled={isPending} event={finalRegister}>Sign Up</ButtonLogin>
              </form>
              )
            }
            <div className='flex items-center mt-3'>
              <div className='w-full h-0.5 bg-slate-500/40'></div>
              <span className='mx-2 text-slate-500'>OR</span>
              <div className='w-full h-0.5 bg-slate-500/40'></div>
            </div>
            <div className="flex flex-col gap-3 mt-3">
              <ButtonLogin event={()=>{signInBySocial('google')}} disabled={isPending}>
                <Image src="https://authjs.dev/img/providers/google.svg" width="22" height="22" alt="google"/>
                <p>{`${formSwitch?'Log in':'Sign up'} with Google`}</p>
              </ButtonLogin>
              <ButtonLogin event={()=>{signInBySocial('facebook')}} disabled={isPending}>
                <Image src="https://authjs.dev/img/providers/facebook.svg" width="24" height="24" alt="facebook"/>
                <p>{`${formSwitch?'Log in':'Sign up'} with Facebook`}</p>
              </ButtonLogin>
              <ButtonLogin event={()=>{signInBySocial('github')}} disabled={isPending} addClass='bg-stone-900 text-white'>
                <Image src="https://authjs.dev/img/providers/github.svg" width="22" height="22" alt="github"/>
                <p>{`${formSwitch?'Log in':'Sign up'} with Github`}</p>
              </ButtonLogin>
            </div>
          </div>
        </motion.div>
      </MotionConfig>
    </div>
  )
}