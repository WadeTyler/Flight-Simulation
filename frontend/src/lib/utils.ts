

export const calculateLongitude = (xPercent: number) => {
  const longitude = xPercent * 360 / 100 - 180; // Convert percentage to longitude
  return longitude;
};


export const calculateX = (longitude: number) => {
  const xPercent = ((longitude + 180) / 360) * 100; // Convert longitude to percentage
  return xPercent;
};



export const calculateLatitude = (yPercent: number) => {
  const latitude = 90 - (yPercent * 180) / 100; // Correct conversion from percentage
  return latitude;
};


export const calculateY = (latitude: number) => {
  console.log("============");
  console.log("number: ", latitude);;
  const yPercent = ((latitude + 90) / 180) * 100; // Correct conversion from latitude to percentage
  console.log("yPercent: ", yPercent);
  console.log("============");
  return yPercent;
};

