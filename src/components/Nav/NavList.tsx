import Link from "next/link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as icon from "@fortawesome/free-solid-svg-icons";



export default function NavList({listData}){
  return (
      <Link href={listData.link} className="flex items-center text-slate-300 hover:text-white transition duration-300">
        <FontAwesomeIcon icon={icon[listData.icon]} size="lg" color="#fcd0d0"></FontAwesomeIcon>
        <p className="ml-3">
          {listData.name}
        </p>
      </Link>
  )
}