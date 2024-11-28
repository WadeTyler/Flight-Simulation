import { IconPlane } from '@tabler/icons-react';
import { Airplane } from '../types';
import { calculateX, calculateY } from '../lib/utils';

const AirplaneComponent = ({airplane}: {airplane: Airplane}) => {
  return (
    <div className=' shadow-xl shadow-black absolute w-[15px] h-[15px] -translate-x-1/2 -translate-y-1/2 group z-40' style={{ left: `${calculateX(airplane.longitude)}%`, top: `${calculateY(airplane.latitude)}%`}}>
      <IconPlane className='text-primary' />

    </div>
  )
}

export default AirplaneComponent