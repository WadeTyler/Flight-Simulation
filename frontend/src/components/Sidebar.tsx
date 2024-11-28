import { IconPlaneDeparture } from '@tabler/icons-react'
import { Airplane, Station } from '../types'
import { SetStateAction, useState } from 'react';
import CreateAirplane from './CreateAirplane';
import { Client } from '@stomp/stompjs';
const Sidebar = ({stations, airplanes, client}: {
  stations: Station[];
  setAirplanes: React.Dispatch<SetStateAction<Airplane[]>>;
  airplanes: Airplane[];
  client: Client | null;
}) => {


  const [creatingFlight, setCreatingFlight] = useState<boolean>(false);

  return (
    <div className='w-48 h-screen relative bg-zinc-800 left-0 top-0 z-40 flex flex-col p-2 py-4 gap-4' >
      <h2 className="text-xl w-full text-center font-bold text-primary pb-2 border-white border-b">Flight Simulation</h2>

      {/* Action Buttons */}
      <div className="flex flex-col w-full gap-2 text-primary">
        <button className='flex gap-2 hover:text-white duration-300 hover:translate-x-2'
        onClick={() => setCreatingFlight(true)}
        >
          <IconPlaneDeparture /> Create Flight
        </button>
      </div>


      {creatingFlight && <CreateAirplane setCreatingFlight={setCreatingFlight} stations={stations} airplanes={airplanes} client={client} /> }

    </div>
  )
}

export default Sidebar