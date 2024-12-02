import { IconMap, IconPlaneDeparture, IconWorld } from '@tabler/icons-react'
import { Flight, Station } from '../types'
import { SetStateAction, useState } from 'react';
import CreateAirplane from './CreateAirplane';
import { Client } from '@stomp/stompjs';
const Sidebar = ({stations, client, flights, isFlatMode, setIsFlatMode}: {
  stations: Station[];
  client: Client | null;
  flights: Flight[];
  isFlatMode: boolean;
  setIsFlatMode: React.Dispatch<SetStateAction<boolean>>;
}) => {

  const [creatingFlight, setCreatingFlight] = useState<boolean>(false);

  return (
    <div className='w-64 min-h-screen h-screen max-h-screen relative bg-zinc-800 left-0 top-0 z-40 flex flex-col p-2 py-4 gap-4' >
      <h2 className="text-xl w-full text-center font-bold text-primary pb-2 border-white border-b">Flight Simulation</h2>

      {/* Action Buttons */}
      <div className="flex flex-col w-full gap-2 text-primary">

        {isFlatMode && 
          <button className="flex gap-2 hover:text-white duration-300 hover:translate-x-2"
            onClick={() => setIsFlatMode(false)}
          >
            <IconWorld /> 3D Mode
          </button>
        }

        {!isFlatMode &&
          <button className="flex gap-2 hover:text-white duration-300 hover:translate-x-2"
            onClick={() => setIsFlatMode(true)}
          >
            <IconMap /> 2D Mode
          </button>
        }

        <button className='flex gap-2 hover:text-white duration-300 hover:translate-x-2'
        onClick={() => setCreatingFlight(true)}
        >
          <IconPlaneDeparture /> Create Flight
        </button>
      </div>

      <div className="flex flex-col gap-4 h-full overflow-hidden">
        <h2 className='text-xl w-full text-center font-bold text-primary pb-2 border-white border-b'>Flight History</h2>
        <p className="text-center text-white"><span className='text-primary'>In Air: </span>{flights.filter((flight) => !flight.landed).length}</p>

        <div className="flex flex-col w-full gap-4 overflow-y-scroll">
          {/* Map Flights */}
          {flights.map((flight, index) => (
            <div className="flex flex-col w-full text-white text-xs input-bar" key={index} >
              <p><span className="text-primary">{flight.airplane.name}</span> - <span className="text-primary">{flight.airplane.speed}</span>/MpH</p>
              <p className="flex flex-col">
                <span className="text-primary">Route: </span>
                  {flight.route.map((station, stationIndex) => (
                      <span key={stationIndex} className="">{stationIndex}: {station.name}</span>
                  ))}
              </p>
              <p><span className="text-primary">Start Time: </span>{new Date(flight.startTime).toLocaleTimeString()}</p>
              {flight.landed && flight.landedTime && <p><span className="text-primary">Landed Time: </span>{new Date(flight.landedTime).toLocaleTimeString()}</p>}
              {!flight.landed && <p className="text-primary flashing-primary-text">In Air</p>}
              {flight.landed && <p className=""><span className="text-primary">Flight Duration: </span> {Math.floor(flight.totalFlightDuration * 10) / 10}hrs</p>}
            </div>
          ))}
        </div>
      </div>


      {creatingFlight && <CreateAirplane setCreatingFlight={setCreatingFlight} stations={stations} client={client} flights={flights} /> }

    </div>
  )
}

export default Sidebar