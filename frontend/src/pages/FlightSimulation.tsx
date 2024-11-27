import { useState } from "react"
import { Airplane, MousePosition, Station } from "../types";
import CreateStation from "../components/CreateStation";
import Sidebar from "../components/Sidebar";
import StationComponent from "../components/StationComponent";
import { calculateLatitude, calculateLongitude } from "../lib/utils";

const FlightSimulation = () => {

  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });

  const [creatingStation, setCreatingStation] = useState<boolean>(false);
  const [stations, setStations] = useState<Station[]>([]);
  const [airplanes, setAirplanes] = useState<Airplane[]>([]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const worldMap = document.getElementById('world-map-container');
    if (worldMap) {
      setMousePosition({ x: e.clientX, y: e.clientY });
    }
  };

  return (
    <div className="bg-zinc-900 w-full h-screen flex items-center justify-center">
      <div className='el w-full h-screen absolute' />
      <Sidebar />
        <div id="world-map-container" className="world-map-container z-20 flex items-center justify-center w-full h-full" onMouseMove={handleMouseMove} onClick={() => setCreatingStation(true)} >

          <img src="/world-map.png" alt="World Map Image" className=""/>
          {/* Map Stations */}
          {stations.map((station) => (
            <StationComponent station={station} key={station.name} />
          ))}
        </div>
      

      {creatingStation && <CreateStation mousePosition={mousePosition} stations={stations} setStations={setStations} setCreatingStation={setCreatingStation} />}


      {/* Lon/Lat */}
      <div className="fixed bottom-2 right-2 flex gap-4">
        <p className="text-white text-xs"><span className="text-primary">Longitude: </span>{calculateLongitude(mousePosition.x)}</p>
        <p className="text-white text-xs"><span className="text-primary">Latitude: </span>{calculateLatitude(mousePosition.y)}</p>
      </div>
    </div>
  )
}

export default FlightSimulation