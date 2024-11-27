import { Station as StationType } from '../types'

const StationComponent = ({station}: {station: StationType;}) => {
  return (
    <div key={station.name} className="station absolute bg-red-600 rounded-full w-4 h-4 group" style={{ left: `${station.x}%`, top: `${station.y}%` }} >
      <div className="group-hover:flex items-center justify-center hidden flex-col absolute text-white text-xs bg-zinc-700 rounded-xl p-2 shadow-lg z-40 gap-2">
        <p className='font-bold'>{station.name}</p>
        <p><span className='text-primary'>Longitude: </span>{station.longitude}</p>
        <p><span className='text-primary'>Latitude: </span>{station.latitude}</p>
        <p><span className='text-primary'>X: </span>{station.x}%</p>
        <p><span className='text-primary'>Y: </span>{station.y}%</p>
      </div>
    </div>
  )
}

export default StationComponent