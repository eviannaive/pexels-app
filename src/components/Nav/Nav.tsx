import { NavList } from "."
import { getServerSession } from "next-auth"
import { options } from '@/app/api/auth/[...nextauth]/options'
import Link from "next/link"

const Nav = async({list}) => {
  const session = await getServerSession(options);
  console.log(session)
  return (
  <nav className='fixed top-0 left-0 w-full flex justify-end text-lg gap-x-5 p-5 bg-gradient-to-r from-sky-300 to-teal-700 z-10'>
    {list.map((li,index)=><NavList key={index} listData={li}/>)}
    {
      session? <Link href="/api/auth/signout?callbackUrl=/">Logout</Link> : <Link href="/api/auth/signin">Login</Link>
    }
  </nav>
  )
}

export default Nav
