import Link from "next/link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as icon from "@fortawesome/free-solid-svg-icons";



export default function NavList({listData}){
  return (
      <Link href={listData.link} className="flex items-center text-slate-200 font-medium group transition-all duration-300">
        <span className="opacity-90 group-hover:opacity-100">
          <FontAwesomeIcon icon={icon[listData.icon]} size="lg" color="#fad0e9" />
        </span>
        <p className="ml-2 group-hover:text-white">
          {listData.name}
        </p>
      </Link>
  )
}