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
      <div className="group-hover:flex justify-center hidden flex-col absolute text-white text-xs bg-zinc-700 rounded-xl p-2 shadow-lg z-50 gap-2">
        <p><span className='text-primary'>Name: </span>{airplane.name}</p>
        <p><span className='text-primary'>Longitude: </span>{airplane.longitude}</p>
        <p><span className='text-primary'>Latitude: </span>{airplane.latitude}</p>
        <p><span className='text-primary'>Speed: </span>{airplane.speed}</p>
      </div>
    </div>
  )
}

export default AirplaneComponent