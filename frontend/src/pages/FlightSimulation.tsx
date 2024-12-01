import { useEffect, useState } from "react"
import { Flight, MousePosition, Station } from "../types";
import CreateStation from "../components/CreateStation";
import Sidebar from "../components/Sidebar";
import StationComponent from "../components/StationComponent";
import { calculateLatitude, calculateLongitude, calculateX, calculateY } from "../lib/utils";
import { Client } from "@stomp/stompjs";
import AirplaneComponent from "../components/AirplaneComponent";
import LocationStampComponent from "../components/LocationStampComponent";
import toast from "react-hot-toast";
import Background from "../components/Background";

const FlightSimulation = () => {

  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });

  const [creatingStation, setCreatingStation] = useState<boolean>(false);
  const [stations, setStations] = useState<Station[]>([]);

  const [flights, setFlights] = useState<Flight[]>([]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const worldMap = document.getElementById('world-map-container');
    if (worldMap) {

      const rect = worldMap.getBoundingClientRect();

      const relativeX = e.clientX - rect.left;
      const relativeY = e.clientY - rect.top;
      const relativeXPercentage = (relativeX / rect.width) * 100;
      const relativeYPercentage = (relativeY / rect.height) * 100;

      setMousePosition({ x: relativeXPercentage, y: relativeYPercentage });
    }
  };

  const [client, setClient] = useState<Client | null>(null);

  useEffect(() => {
    const stompClient = new Client({
      brokerURL: "ws://localhost:8080/ws",
      // debug: (str) => {
      //   console.log(str);
      // },
      onConnect: () => {
        console.log("Connected to WebSocket via STOMP");

        stompClient.subscribe("/topic/stations", (message) => {
          // handle incoming stations
          const response = JSON.parse(message.body);

          response.forEach((station: Station) => {
            station.x = calculateX(station.longitude);
            station.y = calculateY(station.latitude);
          });

          console.log(response);
          setStations(response);
        });

        stompClient.subscribe("/topic/newstation", (message) => {
          const response = JSON.parse(message.body);
          console.log(response);

          response.x = calculateX(response.longitude);
          response.y = calculateY(response.latitude);

          setStations(prev => [...prev, response]);
          toast.success(`Station ${response.name} has been added.`);
        })

        stompClient.subscribe("/topic/flights", (message) => {
          const response = JSON.parse(message.body);

          // Debug
          console.log(response);

          setFlights(response);
        })

        // Load stations
        stompClient.publish({ destination: "/app/retrievestations" });

        // Load airplanes
        stompClient.publish({ destination: "/app/retrieveairplanes" });

        stompClient.subscribe("/queue/error", (message) => {
          toast.error(JSON.parse(message.body));
        })

      },
      onWebSocketError: (error) => {
        console.log("Error: ", error);
      },
      onDisconnect: () => {
        console.log("Disconnected");
      }
    });

    stompClient.activate();
    setClient(stompClient);


    return () => {
      if (client) {
        client.deactivate();
      }
    };

  }, []);


  return (
    <div className="bg-zinc-900 w-full h-screen flex items-center justify-center relative">
      
      <Background />

      <Sidebar stations={stations} client={client} flights={flights} />

      <div className="z-20 flex items-center justify-center w-full h-full relative">

        <img src="/world-map7.png" alt="World Map Image" className="relative w-full h-full" id="world-map-container" onMouseMove={handleMouseMove} onClick={() => setCreatingStation(true)} />
        {/* Map Stations */}
        {stations.map((station, index) => (
          <StationComponent station={station} key={index} />
        ))}

        {/* Map Airplanes and Location Stamps */}
        {flights.map((flight, index) => {

          const colors = [
            '#FF5733', // Red
            '#33FF57', // Green
            '#3357FF', // Blue
            '#FF33A1', // Pink
            '#FF8C33', // Orange
            '#33FFF5', // Cyan
            '#8D33FF', // Purple
            '#FFD733', // Yellow
            '#33FF8C', // Lime
            '#FF3333',  // Bright Red
            '#FF33FF'  // Magenta
          ];

          // Get a color 1 - 10
          const color = colors[(index % 10)];

          if (!flight.landed) return (
            <div className="" key={index}>
              {flight.locationStamps.map((locationStamp, locationStampIndex) => (
                <LocationStampComponent locationStamp={locationStamp} color={color} key={locationStampIndex} />
              ))}
              <AirplaneComponent airplane={flight.airplane} color={color} />
            </div>
          )
        })}

        {/* Lon/Lat */}
        <div className="absolute bottom-2 right-2 flex gap-4">
          <p className="text-white text-xs"><span className="text-primary">Longitude: </span>{calculateLongitude(mousePosition.x)}</p>
          <p className="text-white text-xs"><span className="text-primary">Latitude: </span>{calculateLatitude(mousePosition.y)}</p>
        </div>

        <div className="absolute bottom-2 left-2 flex gap-4">
          <p className="text-white text-xs"><span className="text-primary">X: </span>{mousePosition.x}</p>
          <p className="text-white text-xs"><span className="text-primary">Y: </span>{mousePosition.y}</p>
        </div>
      </div>

      
      {creatingStation && <CreateStation mousePosition={mousePosition} stations={stations} setStations={setStations} setCreatingStation={setCreatingStation} client={client} />}

      

    </div>
  )
}

export default FlightSimulation