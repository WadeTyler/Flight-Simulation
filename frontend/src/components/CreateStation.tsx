import React, { SetStateAction, useState } from "react";
import { MousePosition, Station } from "../types"
import { CloseButton } from "./CloseButton";
import { calculateLatitude, calculateLongitude, calculateX, calculateY } from "../lib/utils";
import { Client } from "@stomp/stompjs";
import toast from "react-hot-toast";

const CreateStation = ({mousePosition, stations, setCreatingStation, client} :
   { mousePosition: MousePosition; stations: Station[]; setStations: React.Dispatch<SetStateAction<Station[]>>; setCreatingStation: React.Dispatch<SetStateAction<boolean>>; client: Client | null;
   }) => {

  const [stationName, setStationName] = React.useState<string>('');
  
  const [longitude, setLongitude] = useState<number>(calculateLongitude(mousePosition.x));
  const [latitude, setLatitude] = useState<number>(calculateLatitude(mousePosition.y));

  
  // Submit form for creation
  const handleCreateStation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check longitude in range
    if (longitude > 180 || longitude < -180) {
      return toast.error("Longitude must be between -180 and 180");
    }

    // Check latitude in range
    if (latitude > 90 || latitude < -90) {
      return toast.error("Latitude must be between -90 and 90");
    }

    // Check if station name is taken
    for (const station of stations) {
      if (station.name === stationName) return toast.error("A station with that name already exists");
    }

    client?.publish({
      destination: "/app/createstation",
      body: JSON.stringify({ name: stationName, latitude: latitude, longitude: longitude }),
    });

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
            <div className="flex flex-col gap-1 w-full">
              <p className="text-primary">Longitude</p>
              <input type="number" className="input-bar" placeholder="Longitude" value={longitude} onChange={(e) => setLongitude(Number(e.target.value)) }/>
            </div>
            <div className="flex flex-col gap-1 w-full">
              <p className="text-primary">Latitude</p>
              <input type="number" className="input-bar" placeholder="Latitude" value={latitude} onChange={(e) => setLatitude(Number(e.target.value)) }/>
            </div>
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