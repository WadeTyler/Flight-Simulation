export type Station = {
  x: number;
  y: number;
  latitude: number;
  longitude: number;
  name: string;
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
}

export type Flight = {
  airplane: Airplane;
  route: Station[];
  totalFlightDuration: number;
  landed: boolean;
  lastTimestamp: string;
  startTime: string;
  landedTime: string;
  locationStamps: {
    longitude: number;
    latitude: number;
  }[];
}