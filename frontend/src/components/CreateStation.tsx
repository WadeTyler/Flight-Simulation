import React, { SetStateAction } from "react";
import { MousePosition, Station } from "../types"
import { CloseButton } from "./CloseButton";
import { calculateLatitude, calculateLongitude, calculateX, calculateY } from "../lib/utils";
import { Client } from "@stomp/stompjs";

const CreateStation = ({mousePosition, setCreatingStation, client} :
   { mousePosition: MousePosition; stations: Station[]; setStations: React.Dispatch<SetStateAction<Station[]>>; setCreatingStation: React.Dispatch<SetStateAction<boolean>>; client: Client | null;
   }) => {

  const [stationName, setStationName] = React.useState<string>('');

  const handleCreateStation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    client?.publish({
      destination: "/app/createstation",
      body: JSON.stringify({ name: stationName, latitude: calculateLatitude(mousePosition.y), longitude: calculateLongitude(mousePosition.x) }),
    });

    // setStations([...stations, { x: mousePosition.x, y: mousePosition.y, name: stationName, latitude: calculateLatitude(mousePosition.y), longitude: calculateLongitude(mousePosition.x) }]);
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
          <div className="flex gap-2">
            <p><span className="text-primary">Longitude: </span>{calculateLongitude(mousePosition.x)}</p>
            <p><span className="text-primary">Latitude: </span>{calculateLatitude(mousePosition.y)}</p>
            <p><span className="text-primary">X: </span>{calculateX(calculateLongitude(mousePosition.x))} - {mousePosition.x}</p>
            <p><span className="text-primary">Y: </span>{calculateY(calculateLatitude(mousePosition.y))} - {mousePosition.y}</p>
          </div>
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