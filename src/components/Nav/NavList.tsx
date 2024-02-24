import Link from "next/link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import * as icons from "@fortawesome/free-solid-svg-icons";

type ListData = {
  name: string;
  link: string;
  icon: keyof typeof icons;
};

export default function NavList({listData} : {listData : ListData}){
  return (
      <Link href={listData.link} className="flex items-center text-slate-200 font-medium group transition-all">
        <span className="opacity-90 group-hover:opacity-100 max-[600px]:hidden">
          <FontAwesomeIcon icon={icons[listData.icon] as IconDefinition} size="lg" color="#fad0d2" />
        </span>
        <p className="ml-2 group-hover:text-white max-[600px]:text-base">
          {listData.name}
        </p>
      </Link>
  )
}