import Link from "next/link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as icon from "@fortawesome/free-solid-svg-icons";



export default function NavList({listData}){
  return (
      <Link href={listData.link} className="flex items-center text-slate-200 hover:text-white transition duration-300">
        <FontAwesomeIcon icon={icon[listData.icon]} size="lg" color="#ebbfd9"></FontAwesomeIcon>
        <p className="ml-2">
          {listData.name}
        </p>
      </Link>
  )
}