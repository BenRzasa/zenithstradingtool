import React, { createContext, useState, useEffect } from 'react';

export const CSVContext = createContext();

export const CSVProvider = ({ children }) => {
  const [csvData, setCSVData] = useState({});

  // Load data from localStorage on initial render
  useEffect(() => {
    const savedData = localStorage.getItem('csvData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setCSVData(parsedData);
      } catch (e) {
        console.error("Failed to parse saved CSV data", e);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (Object.keys(csvData).length > 0) {
      localStorage.setItem('csvData', JSON.stringify(csvData));
    }
  }, [csvData]);

  return (
    <CSVContext.Provider value={{ csvData, setCSVData }}>
      {children}
    </CSVContext.Provider>
  );
};