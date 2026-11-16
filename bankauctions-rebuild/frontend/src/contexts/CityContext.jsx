import React, { createContext, useContext, useState, useEffect } from 'react';
import { CITIES } from '@shared/constants/categories.js';

const CityContext = createContext(null);

export function CityProvider({ children }) {
  const [selectedCity, setSelectedCity] = useState(() => {
    return localStorage.getItem('ba_city') || 'chennai';
  });

  const setCity = (cityKey) => {
    if (CITIES[cityKey]) {
      setSelectedCity(cityKey);
      localStorage.setItem('ba_city', cityKey);
    }
  };

  return (
    <CityContext.Provider value={{ selectedCity, setCity, cityDetails: CITIES[selectedCity], allCities: CITIES }}>
      {children}
    </CityContext.Provider>
  );
}

export function useCity() {
  const context = useContext(CityContext);
  if (!context) {
    throw new Error('useCity must be used within a CityProvider');
  }
  return context;
}
