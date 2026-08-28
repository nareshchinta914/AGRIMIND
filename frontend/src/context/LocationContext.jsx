import React, { createContext, useState, useEffect } from 'react';
import { INDIAN_STATES, DISTRICT_MAP } from '../utils/constants';

export const LocationContext = createContext(null);

export const LocationProvider = ({ children }) => {
  const [selectedState, setSelectedState] = useState(() => {
    return localStorage.getItem('agrimind_state') || 'Tamil Nadu';
  });

  const [selectedDistrict, setSelectedDistrict] = useState(() => {
    return localStorage.getItem('agrimind_district') || 'Thanjavur';
  });

  const [geoCoordinates, setGeoCoordinates] = useState(null);
  const [isAutoDetected, setIsAutoDetected] = useState(false);

  // Automatically request and accept browser GPS location seamlessly
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setGeoCoordinates({ lat: latitude, lon: longitude });
          setIsAutoDetected(true);
        },
        (error) => {
          // Gracefully fallback to saved / default regional location
          setIsAutoDetected(false);
        },
        { timeout: 8000, maximumAge: 60000 }
      );
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('agrimind_state', selectedState);
  }, [selectedState]);

  useEffect(() => {
    localStorage.setItem('agrimind_district', selectedDistrict);
  }, [selectedDistrict]);

  const availableDistricts = DISTRICT_MAP[selectedState] || ['Thanjavur', 'Madurai', 'Coimbatore', 'Chennai'];

  const setLocation = (state, district) => {
    setSelectedState(state);
    if (district) {
      setSelectedDistrict(district);
    } else {
      const firstDist = DISTRICT_MAP[state]?.[0] || 'District Headquarter';
      setSelectedDistrict(firstDist);
    }
  };

  return (
    <LocationContext.Provider
      value={{
        selectedState,
        selectedDistrict,
        setSelectedState,
        setSelectedDistrict,
        setLocation,
        geoCoordinates,
        isAutoDetected,
        states: INDIAN_STATES,
        availableDistricts,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};
