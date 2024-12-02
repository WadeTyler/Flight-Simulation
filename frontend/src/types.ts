export type Station = {
  x: number;
  y: number;
  latitude: number;
  longitude: number;
  name: string;
  timestamp: string;
}

export type MousePosition = {
  x: number;
  y: number;
}

export type Airplane = {
  name: string;
  longitude: number;
  latitude: number;
  speed: number;
  rotation: number;
}

export type Flight = {
  flightId: string;
  airplane: Airplane;
  route: Station[];
  totalFlightDuration: number;
  landed: boolean;
  lastTimestamp: string;
  startTime: string;
  landedTime: string;
}
