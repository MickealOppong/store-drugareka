



type TCoordinates = {
  latitude: number;
  longitude: number;
};



export function detectUserCoordinates(): Promise<TCoordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(
              new Error(
                "Location permission was denied. Please allow location access in your browser settings."
              )
            );
            break;

          case error.POSITION_UNAVAILABLE:
            reject(
              new Error("Your location could not be determined.")
            );
            break;

          case error.TIMEOUT:
            reject(
              new Error("Location request timed out.")
            );
            break;

          default:
            reject(
              new Error("Unable to determine your location.")
            );
        }
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 5 * 60 * 1000,
      }
    );
  });
}