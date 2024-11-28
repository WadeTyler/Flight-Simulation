import { IconPlane } from '@tabler/icons-react';
import { Airplane } from '../types';
import { calculateX, calculateY } from '../lib/utils';

const AirplaneComponent = ({airplane}: {airplane: Airplane}) => {
  return (
    <div className='airplane absolute w-[40px] h-[40px] -translate-x-1/2 -translate-y-1/2 group z-40 flex items-center justify-center rounded-full' style={{ left: `${calculateX(airplane.longitude)}%`, top: `${calculateY(airplane.latitude)}%`}}>
      <IconPlane className='text-primary text-xl shadow-xl' />
      <div className="pulse bg-primary absolute w-[10px] h-[10px] rounded-full z-10 opacity-50 flex items-center justify-center">
        <div className="pulse bg-primary w-[5px] h-[5px] rounded-full z-10 opacity-50"></div>
      </div>
    </div>
  )
}

export default AirplaneComponent