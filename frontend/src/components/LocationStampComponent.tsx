import { calculateX, calculateY } from "../lib/utils";

const LocationStampComponent = ({locationStamp, color}: {locationStamp: {longitude: number; latitude: number;}; color: string;}) => {

  return (
    <div className="absolute rounded-full w-1 h-1 opacity-20 -translate-x-1/2 -translate-y-1/2" style={{ left: `${calculateX(locationStamp.longitude)}%`, top: `${calculateY(locationStamp.latitude)}%`, backgroundColor: color }}>

    </div>
  )
}

export default LocationStampComponent