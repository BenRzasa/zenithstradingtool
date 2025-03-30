import React, { createContext, useState, useEffect } from 'react';

export const CSVContext = createContext();

export const CSVProvider = ({ children }) => {
  const [csvData, setCSVData] = useState({});
  const [isJohnValues, setIsJohnValues] = useState(false); // Default: false

  // Load all persisted data on initial render
  useEffect(() => {
    // Load CSV data
    const savedCSVData = localStorage.getItem('csvData');
    if (savedCSVData) {
      try {
        setCSVData(JSON.parse(savedCSVData));
      } catch (e) {
        console.error("Failed to parse saved CSV data", e);
      }
    }

    // Load John mode state
    const savedJohnMode = localStorage.getItem('isJohnValues');
    if (savedJohnMode !== null) {
      setIsJohnValues(JSON.parse(savedJohnMode));
    }
  }, []);

  // Save CSV data whenever it changes
  useEffect(() => {
    if (Object.keys(csvData).length > 0) {
      localStorage.setItem('csvData', JSON.stringify(csvData));
    }
  }, [csvData]);

  // Save John mode state whenever it changes
  useEffect(() => {
    localStorage.setItem('isJohnValues', JSON.stringify(isJohnValues));
  }, [isJohnValues]);

  return (
    <CSVContext.Provider
      value={{
        csvData,
        setCSVData,
        isJohnValues,
        setIsJohnValues,
      }}
    >
      {children}
    </CSVContext.Provider>
  );
};