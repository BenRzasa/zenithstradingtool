/* ZTT | Context file to ensure persistency of the CSV data
  - e.g., from the CSV page over to the value chart, or from the
  value chart over to the trade tool (since it needs the inventory data)
*/

import React, { createContext, useState, useEffect } from 'react';

export const CSVContext = createContext(); // Send the context out

export const CSVProvider = ({ children }) => {
  const [csvData, setCSVData] = useState({});              // Default: empty
  const [isJohnValues, setIsJohnValues] = useState(false); // Default: false
  const [currentMode, setCurrentMode] = useState(3);       // Default: NV Mode

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
    // Load saved Value mode state
    const savedValueMode = localStorage.getItem('currentMode');
    if (savedValueMode !== null) {
      setCurrentMode(JSON.parse(savedValueMode));
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

  // Save Value mode state whenever it changes
  useEffect(() => {
    localStorage.setItem('currentMode', JSON.stringify(currentMode));
  }, [currentMode]);

  return (
    // Return and wrap all necessary fields and functions to set them
    // (Must also import these in any page that needs them)
    <CSVContext.Provider
      value={{
        csvData,
        setCSVData,
        isJohnValues,
        setIsJohnValues,
        currentMode,
        setCurrentMode,
      }}
    >
      {children}
    </CSVContext.Provider>
  );
};