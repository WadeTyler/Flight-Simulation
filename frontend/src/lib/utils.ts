

export const calculateLongitude = (x: number) => {

  const worldMap = document.getElementById('world-map-container');
  if (!worldMap) {
    return 0;
  }

  const mapWidth = worldMap.clientWidth;

  let longitude = (x /mapWidth) * 360 - 180;
  longitude -= 48;
  return longitude;
}

export const calculateX = (longitude: number) => {

  const worldMap = document.getElementById('world-map-container');
  if (!worldMap) {
    return 0;
  }

  const mapWidth = worldMap.clientWidth;

  const x = (longitude + 180) * mapWidth / 360;
  return x;
}

export const calculateLatitude = (y: number) => {

  const worldMap = document.getElementById('world-map-container');
  if (!worldMap) {
    return 0;
  }

  const mapHeight = worldMap.clientHeight;

  let latitude = 90 - (y / mapHeight) * 180;
  latitude += 25;
  return latitude;
}

export const calculateY = (latitude: number) => {

  const worldMap = document.getElementById('world-map-container');
  if (!worldMap) {
    return 0;
  }

  const mapHeight = worldMap.clientHeight;


  const y = (90 - latitude) * mapHeight / 180;
  return y;
}