import { NavList } from "."
import { getServerSession } from "next-auth"
import { options } from '@/app/api/auth/[...nextauth]/options'
import Link from "next/link"
import { ButtonLogin } from "../Buttons"
import AuthProvider from "@/context/AuthProvider"
import AccountDropdown from "../AccountDropdown"

const logItem = {
    name: 'LOG IN',
    link: '/login',
    icon: 'faRightToBracket'
  };

const Nav = async({list}) => {
  const session = await getServerSession(options);
  console.log(session,'navnnnnnnnnnnnnnnnnnn')
  return (
  <nav className='fixed top-0 left-0 w-full flex justify-end text-lg gap-x-5 p-5 bg-gradient-to-r from-sky-300 to-teal-700 z-10'>
    {list.map((li,index)=><NavList key={index} listData={li}/>)}
    {!session && (<NavList listData={logItem}/>)}
    {session && (
      <div className="w-[50px] h-[50px] rounded-full overflow-hidden cursor-pointer hover: border-2 border-rose-200 transition-all hover:border-amber-300">
        <img src={session?.user.image} alt="" className="w-full h-full object-cover"/>
      </div>)
    }
    {
      session && (
      <div className={`bg-white rounded-lg absolute top-[90%] right-[20px] p-[20px]`}>
        <AuthProvider>
          <AccountDropdown />
        </AuthProvider>
      </div>
      )
    }
  </nav>
  )
}

export default Nav
