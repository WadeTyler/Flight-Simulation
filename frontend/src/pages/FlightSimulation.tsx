import { SetStateAction, useEffect, useState } from "react"
import { Flight, MousePosition, Station } from "../types";
import CreateStation from "../components/CreateStation";
import Sidebar from "../components/Sidebar";
import StationComponent from "../components/StationComponent";
import { calculateLatitude, calculateLongitude, calculateX, calculateY } from "../lib/utils";
import { Client } from "@stomp/stompjs";
import AirplaneComponent from "../components/AirplaneComponent";
import toast from "react-hot-toast";
import Background from "../components/Background";
import { World } from "../components/Globe";

const FlightSimulation = () => {

  const [isFlatMode, setIsFlatMode] = useState<boolean>(true);

  const [creatingStation, setCreatingStation] = useState<boolean>(false);

  const [stations, setStations] = useState<Station[]>([]);
  const [flights, setFlights] = useState<Flight[]>([]);


  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
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
      brokerURL: "ws://flight-backend:8080/ws",
      // debug: (str) => {
      //   console.log(str);
      // },
      onConnect: () => {
        console.log("Connected to WebSocket via STOMP");

        stompClient.subscribe("/topic/stations", (message) => {
          // handle initial stations
          const response = JSON.parse(message.body);

          response.forEach((station: Station) => {
            station.x = calculateX(station.longitude);
            station.y = calculateY(station.latitude);
          });

          console.log(response);
          setStations(response);
        });

        // Handle new stations
        stompClient.subscribe("/topic/newstation", (message) => {
          const response = JSON.parse(message.body);
          console.log(response);

          response.x = calculateX(response.longitude);
          response.y = calculateY(response.latitude);

          setStations(prev => [...prev, response]);
          toast.success(`Station ${response.name} has been added.`);
        });

        stompClient.subscribe("/topic/flights", (message) => {
          const response = JSON.parse(message.body);
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
      
      if (stompClient.connected) {
        stompClient.deactivate();
      }
    };

  }, []);


  return (
    <div className="bg-zinc-900 w-full h-screen flex items-center justify-center relative">
      
      <Background />

      <Sidebar stations={stations} client={client} flights={flights} setIsFlatMode={setIsFlatMode} isFlatMode={isFlatMode} />
      
      {isFlatMode && 
        <FlatMap flights={flights} stations={stations} setCreatingStation={setCreatingStation} handleMouseMove={handleMouseMove} mousePosition={mousePosition} />
      } 

      {!isFlatMode &&
        <Globe3D />
      }

  
      {creatingStation && <CreateStation mousePosition={mousePosition} stations={stations} setStations={setStations} setCreatingStation={setCreatingStation} client={client} />}

    </div>
  )
}

export default FlightSimulation




const Globe3D = () => {


  return (
    <div className="w-full h-full flex items-center justify-center">
      
      {/* Globe */}
      <div className="w-[60rem] h-[60rem] flex items-center justify-center z-20">
        <World globeConfig={globeConfig} data={sampleArcs} />
      </div>




    </div>
  )
}


const FlatMap = ({flights, stations, setCreatingStation, handleMouseMove, mousePosition}: {
  flights: Flight[];
  stations: Station[];
  setCreatingStation: React.Dispatch<SetStateAction<boolean>>;
  handleMouseMove: React.MouseEventHandler<HTMLDivElement>;
  mousePosition: MousePosition;
}) => {

  return (
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
  )
}

const globeConfig = {
  pointSize: 4,
  globeColor: "#062056",
  showAtmosphere: true,
  atmosphereColor: "#22c55e",
  atmosphereAltitude: 0.1,
  emissive: "#062056",
  emissiveIntensity: 0.1,
  shininess: 0.9,
  polygonColor: "rgba(255,255,255,0.7)",
  ambientLight: "#38bdf8",
  directionalLeftLight: "#ffffff",
  directionalTopLight: "#ffffff",
  pointLight: "#ffffff",
  arcTime: 3000,
  arcLength: 0.9,
  rings: 1,
  maxRings: 3,
  initialPosition: { lat: 22.3193, lng: 114.1694 },
  autoRotate: true,
  autoRotateSpeed: 0.5,
};
const colors = ["#22c55e"];
const sampleArcs = [
  {
    order: 1,
    startLat: -19.885592,
    startLng: -43.951191,
    endLat: -22.9068,
    endLng: -43.1729,
    arcAlt: 0.1,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 1,
    startLat: 28.6139,
    startLng: 77.209,
    endLat: 3.139,
    endLng: 101.6869,
    arcAlt: 0.2,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 1,
    startLat: -19.885592,
    startLng: -43.951191,
    endLat: -1.303396,
    endLng: 36.852443,
    arcAlt: 0.5,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 2,
    startLat: 1.3521,
    startLng: 103.8198,
    endLat: 35.6762,
    endLng: 139.6503,
    arcAlt: 0.2,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 2,
    startLat: 51.5072,
    startLng: -0.1276,
    endLat: 3.139,
    endLng: 101.6869,
    arcAlt: 0.3,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 2,
    startLat: -15.785493,
    startLng: -47.909029,
    endLat: 36.162809,
    endLng: -115.119411,
    arcAlt: 0.3,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 3,
    startLat: -33.8688,
    startLng: 151.2093,
    endLat: 22.3193,
    endLng: 114.1694,
    arcAlt: 0.3,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 3,
    startLat: 21.3099,
    startLng: -157.8581,
    endLat: 40.7128,
    endLng: -74.006,
    arcAlt: 0.3,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 3,
    startLat: -6.2088,
    startLng: 106.8456,
    endLat: 51.5072,
    endLng: -0.1276,
    arcAlt: 0.3,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 4,
    startLat: 11.986597,
    startLng: 8.571831,
    endLat: -15.595412,
    endLng: -56.05918,
    arcAlt: 0.5,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 4,
    startLat: -34.6037,
    startLng: -58.3816,
    endLat: 22.3193,
    endLng: 114.1694,
    arcAlt: 0.7,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 4,
    startLat: 51.5072,
    startLng: -0.1276,
    endLat: 48.8566,
    endLng: -2.3522,
    arcAlt: 0.1,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 5,
    startLat: 14.5995,
    startLng: 120.9842,
    endLat: 51.5072,
    endLng: -0.1276,
    arcAlt: 0.3,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 5,
    startLat: 1.3521,
    startLng: 103.8198,
    endLat: -33.8688,
    endLng: 151.2093,
    arcAlt: 0.2,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 5,
    startLat: 34.0522,
    startLng: -118.2437,
    endLat: 48.8566,
    endLng: -2.3522,
    arcAlt: 0.2,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 6,
    startLat: -15.432563,
    startLng: 28.315853,
    endLat: 1.094136,
    endLng: -63.34546,
    arcAlt: 0.7,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 6,
    startLat: 37.5665,
    startLng: 126.978,
    endLat: 35.6762,
    endLng: 139.6503,
    arcAlt: 0.1,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 6,
    startLat: 22.3193,
    startLng: 114.1694,
    endLat: 51.5072,
    endLng: -0.1276,
    arcAlt: 0.3,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 7,
    startLat: -19.885592,
    startLng: -43.951191,
    endLat: -15.595412,
    endLng: -56.05918,
    arcAlt: 0.1,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 7,
    startLat: 48.8566,
    startLng: -2.3522,
    endLat: 52.52,
    endLng: 13.405,
    arcAlt: 0.1,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 7,
    startLat: 52.52,
    startLng: 13.405,
    endLat: 34.0522,
    endLng: -118.2437,
    arcAlt: 0.2,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 8,
    startLat: -8.833221,
    startLng: 13.264837,
    endLat: -33.936138,
    endLng: 18.436529,
    arcAlt: 0.2,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 8,
    startLat: 49.2827,
    startLng: -123.1207,
    endLat: 52.3676,
    endLng: 4.9041,
    arcAlt: 0.2,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 8,
    startLat: 1.3521,
    startLng: 103.8198,
    endLat: 40.7128,
    endLng: -74.006,
    arcAlt: 0.5,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 9,
    startLat: 51.5072,
    startLng: -0.1276,
    endLat: 34.0522,
    endLng: -118.2437,
    arcAlt: 0.2,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 9,
    startLat: 22.3193,
    startLng: 114.1694,
    endLat: -22.9068,
    endLng: -43.1729,
    arcAlt: 0.7,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 9,
    startLat: 1.3521,
    startLng: 103.8198,
    endLat: -34.6037,
    endLng: -58.3816,
    arcAlt: 0.5,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 10,
    startLat: -22.9068,
    startLng: -43.1729,
    endLat: 28.6139,
    endLng: 77.209,
    arcAlt: 0.7,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 10,
    startLat: 34.0522,
    startLng: -118.2437,
    endLat: 31.2304,
    endLng: 121.4737,
    arcAlt: 0.3,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 10,
    startLat: -6.2088,
    startLng: 106.8456,
    endLat: 52.3676,
    endLng: 4.9041,
    arcAlt: 0.3,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 11,
    startLat: 41.9028,
    startLng: 12.4964,
    endLat: 34.0522,
    endLng: -118.2437,
    arcAlt: 0.2,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 11,
    startLat: -6.2088,
    startLng: 106.8456,
    endLat: 31.2304,
    endLng: 121.4737,
    arcAlt: 0.2,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 11,
    startLat: 22.3193,
    startLng: 114.1694,
    endLat: 1.3521,
    endLng: 103.8198,
    arcAlt: 0.2,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 12,
    startLat: 34.0522,
    startLng: -118.2437,
    endLat: 37.7749,
    endLng: -122.4194,
    arcAlt: 0.1,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 12,
    startLat: 35.6762,
    startLng: 139.6503,
    endLat: 22.3193,
    endLng: 114.1694,
    arcAlt: 0.2,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 12,
    startLat: 22.3193,
    startLng: 114.1694,
    endLat: 34.0522,
    endLng: -118.2437,
    arcAlt: 0.3,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 13,
    startLat: 52.52,
    startLng: 13.405,
    endLat: 22.3193,
    endLng: 114.1694,
    arcAlt: 0.3,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 13,
    startLat: 11.986597,
    startLng: 8.571831,
    endLat: 35.6762,
    endLng: 139.6503,
    arcAlt: 0.3,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 13,
    startLat: -22.9068,
    startLng: -43.1729,
    endLat: -34.6037,
    endLng: -58.3816,
    arcAlt: 0.1,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 14,
    startLat: -33.936138,
    startLng: 18.436529,
    endLat: 21.395643,
    endLng: 39.883798,
    arcAlt: 0.3,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
];
