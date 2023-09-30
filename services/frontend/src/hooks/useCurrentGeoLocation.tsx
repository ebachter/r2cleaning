import {useState, useEffect} from 'react';
const options = {
  enableHighAccuracy: true,
  timeout: 1000 * 60 * 1, // 1 min (1000 ms * 60 sec * 1 minute = 60 000ms)
  maximumAge: 1000 * 3600 * 24, // 24 hour
};

const useCurrentLocation = () => {
  // store location in state
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  }>();
  // store error message in state
  const [error, setError] = useState<string>();

  // Success handler for geolocation's `getCurrentPosition` method
  const handleSuccess = (pos: {
    coords: {latitude: number; longitude: number};
  }) => {
    const {latitude, longitude} = pos.coords;

    setLocation({
      latitude,
      longitude,
    });
  };

  useEffect(() => {
    const {geolocation} = navigator;

    // If the geolocation is not defined in the used browser we handle it as an error
    if (!geolocation) {
      setError('Geolocation is not supported.');
      return;
    }

    // Call Geolocation API
    geolocation.getCurrentPosition(
      handleSuccess,
      // Error handler for geolocation's `getCurrentPosition` method
      (error) => {
        setError(error.message);
      },
      options,
    );
  }, []);

  return {location, error};
};

export default useCurrentLocation;
