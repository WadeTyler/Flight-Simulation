import { IconPlane } from '@tabler/icons-react';
import { Airplane } from '../types';
import { calculateX, calculateY } from '../lib/utils';

const AirplaneComponent = ({airplane, color}: {airplane: Airplane; color: string;}) => {

  return (
    <div className={`airplane absolute w-[40px] h-[40px] -translate-x-1/2 -translate-y-1/2 group z-40 flex items-center justify-center rounded-full`} style={{ left: `${calculateX(airplane.longitude)}%`, top: `${calculateY(airplane.latitude)}%`}}>
      <IconPlane className={`text-xl shadow-xl`} style={{ color: color, rotate: `-${airplane.rotation}deg`}} />
      <div className="pulse absolute w-[10px] h-[10px] rounded-full z-10 opacity-50 flex items-center justify-center" style={{ backgroundColor: color }}>
        <div className="pulse w-[5px] h-[5px] rounded-full z-10 opacity-50" style={{ backgroundColor: color }}></div>
      </div>
    </div>
  )
}

export default AirplaneComponent