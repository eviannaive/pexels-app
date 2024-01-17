import { NavList } from "."

const Nav = ({data}) => {
  return (
  <nav className='fixed top-0 left-0 w-full flex justify-end text-lg gap-x-5 p-5 bg-gradient-to-r from-sky-300 to-teal-700 z-10'>
    {data.map((li,index)=><NavList key={index} listData={li}/>)}
  </nav>
  )
}

export default Nav
