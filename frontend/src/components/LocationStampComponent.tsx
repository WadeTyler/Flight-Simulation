import { calculateX, calculateY } from "../lib/utils";

const LocationStampComponent = ({locationStamp}: {locationStamp: {longitude: number; latitude: number;}}) => {
  return (
    <div className="absolute rounded-full bg-primary w-1 h-1 opacity-20 -translate-x-1/2 -translate-y-1/2" style={{ left: `${calculateX(locationStamp.longitude)}%`, top: `${calculateY(locationStamp.latitude)}%` }}>

    </div>
  )
}

export default LocationStampComponent