import { SetStateAction, useEffect, useState } from "react"
import { CloseButton } from "./CloseButton"
import { Airplane, Flight, Station } from "../types";
import toast from "react-hot-toast";
import { Client } from "@stomp/stompjs";


const CreateAirplane = ({setCreatingFlight, stations, client, flights}: {setCreatingFlight: React.Dispatch<SetStateAction<boolean>>; stations: Station[]; client: Client | null; flights: Flight[];}) => {

  const [route, setRoute] = useState<Station[]>([]);
  const [airplane, setAirplane] = useState<Airplane>({
    name: "",
    speed: 0,
    longitude: 0,
    latitude: 0
  });


  const handleCreateFlight = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check route length (min 2)
    if (route.length < 2) {
      return toast.error("A minimum of two stations is required.");
    }

    // Check if airplane name is taken
    for (const flight of flights) {
      if (!flight.landed && flight.airplane.name.toLowerCase() === airplane.name.toLowerCase()) {
        return toast.error("An airplane with that name is currently in flight.");
      }
    }

    // Check airplane speed
    if (airplane.speed == 0) {
      return toast.error("Airplane speed cannot be 0");
    }

    // Send to websocket
    client?.publish({
      destination: "/app/createflight",
      body: JSON.stringify({ airplane: airplane, route: route })
    });

    // Close
    setCreatingFlight(false);
  }

  useEffect(() => {
    console.log(route);
  }, [route]);

  return (
    <div className="bg-[rgba(0,0,0,.8)] w-full min-h-screen fixed flex items-center justify-center z-50">
      <div className="w-[40rem] max-h-96 bg-zinc-800 rounded-xl flex flex-col relative p-4 gap-4">
        <CloseButton setState={setCreatingFlight} />
        <h3 className="text-lg text-white mt-4">Create Flight</h3>
        <form action="" onSubmit={handleCreateFlight}>
          <div className="flex w-full gap-8">
            {/* Left Side */}
            <div className="flex flex-col gap-4 w-full">
                <div className="flex flex-col gap-1 w-full text-primary">
                <p>Airplane Name</p>
                <input type="text" className="input-bar" required placeholder="Airplane Name" onChange={(e) => setAirplane(prev => ({ ...prev, name: e.target.value }))} />
                </div>
              <div className="flex flex-col gap-1 w-full text-primary">
                <p>Airplane Speed</p>
                <input type="number" className="input-bar" required placeholder="Airplane Speed" onChange={(e) => setAirplane(prev => ({ ...prev, speed: Number(e.target.value) }))} />
              </div>
              <button className="bg-primary text-white p-2 rounded-lg">
                Start Flight
              </button>
            </div>

            {/* Right Side */}
            <div className="flex flex-col gap-2 w-full overflow-y-scroll max-h-72">
              {stations.map((station, index) => {

                const selected = route.includes(station);

                const toggleInRoute = () => {
                  if (selected) {
                    setRoute(prevRoute => prevRoute.filter(s => s !== station));
                  }
                  else {
                    setRoute(prevRoute => [...prevRoute, station]);
                  }
                }

                return (
                  <div className="flex gap-2 input-bar cursor-pointer hover:scale-95 duration-300 hover:border-white" key={index} onClick={toggleInRoute}>
                    <div className="flex flex-col text-sm text-white w-full" >
                      <p><span className="text-primary">Station: </span>{station.name}</p>
                      <p><span className="text-primary">Longitude: </span>{station.longitude}</p>
                      <p><span className="text-primary">Latitude: </span>{station.latitude}</p>
                    </div>
                    <div className="flex items-center justify-center">
                      {selected && 
                        <p className="text-white text-3xl">{route.indexOf(station)}</p>
                      }
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateAirplane