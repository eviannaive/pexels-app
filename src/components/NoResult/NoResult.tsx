import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBinoculars } from "@fortawesome/free-solid-svg-icons";

const NoResult = ({text}: {text: string}) => {
  return (
    <div>
      <FontAwesomeIcon icon={faBinoculars} size="4x"/>
        <p className='mt-[20px]'>
          <span>We couldn’t find anything for </span>
          <span className='underline underline-offset-8 decoration-amber-600 text-2xl font-medium'>{text}</span>
          <span>.</span>
        </p>
        <p className='mt-2'>Try to refine your search.</p>
    </div>
  )
}

export default NoResult
