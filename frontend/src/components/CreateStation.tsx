import React, { SetStateAction, useState } from "react";
import { MousePosition, Station } from "../types"
import { CloseButton } from "./CloseButton";
import { calculateLatitude, calculateLongitude, calculateX, calculateY } from "../lib/utils";

const CreateStation = ({mousePosition, stations, setStations, setCreatingStation} :
   { mousePosition: MousePosition; stations: Station[]; setStations: React.Dispatch<SetStateAction<Station[]>>; setCreatingStation: React.Dispatch<SetStateAction<boolean>>;
   }) => {

  const [stationName, setStationName] = React.useState<string>('');
  // const [longitude, setLongitude] = useState<number>(calculateLongitude(mousePosition.x));
  // const [latitude, setLatitude] = useState<number>(calculateLatitude(mousePosition.y));

  const handleCreateStation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStations([...stations, { x: mousePosition.x, y: mousePosition.y, name: stationName, latitude: calculateLatitude(mousePosition.y), longitude: calculateLongitude(mousePosition.x) }]);
    setCreatingStation(false);
  }

  return (
    <div className="w-full min-h-screen fixed bg-[rgba(0,0,0,.8)] flex items-center justify-center z-50">
      <div className="w-[40rem] bg-zinc-800 rounded-xl flex flex-col relative p-4 gap-4">
        <CloseButton setState={setCreatingStation} />
        <h3 className="text-lg text-white mt-4">
          Create Station
        </h3>
        <form action="" onSubmit={handleCreateStation}>
          <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1 w-full">
            <p className="text-primary">Station Name</p>
            <input type="text" placeholder="Station Name" className="input-bar" required onChange={(e) => setStationName(e.target.value)}/>
          </div>
           
            {/* <div className="flex gap-2">
              <div className="flex flex-col gap-1 w-full">
                <p className="text-primary">Longitude</p>
                <input type="text" placeholder="Longitude" className="input-bar" required defaultValue={longitude} onChange={(e) => setLongitude(parseFloat(e.target.value))}/>
              </div>
              <div className="flex flex-col gap-1 w-full">
                <p className="text-primary">Latitude</p>
                <input type="text" placeholder="Latitude" className="input-bar" required defaultValue={latitude} onChange={(e) => setLatitude(parseFloat(e.target.value))}/>
              </div>
            </div> */}
            <button className="bg-primary text-white p-2 rounded-lg">
              Create Station
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateStation