/* ZTT | Context file to ensure persistency of the CSV data
  - e.g., from the CSV page over to the value chart, or from the
  value chart over to the trade tool (since it needs the inventory data)
*/

/* ZTT | Enhanced Context file for CSV data persistence */
import React, { createContext, useState, useEffect } from 'react';

export const CSVContext = createContext();

export const CSVProvider = ({ children }) => {
  // Core CSV data state
  const [csvData, setCSVData] = useState(() => {
    const savedCSVData = localStorage.getItem('csvData');
    return savedCSVData ? JSON.parse(savedCSVData) : {};
  });

  // Previous amounts for comparison
  const [previousAmounts, setPreviousAmounts] = useState(() => {
    const savedPreviousData = localStorage.getItem('csvPreviousData');
    return savedPreviousData ? JSON.parse(savedPreviousData) : {};
  });

  // Last updated timestamp
  const [lastUpdated, setLastUpdated] = useState(() => {
    const savedTime = localStorage.getItem('csvLastUpdated');
    return savedTime ? new Date(savedTime) : null;
  });

  // Value calculation settings
  const [isJohnValues, setIsJohnValues] = useState(() => {
    const savedJohnMode = localStorage.getItem('isJohnValues');
    return savedJohnMode !== null ? JSON.parse(savedJohnMode) : false;
  });

  const [currentMode, setCurrentMode] = useState(() => {
    const savedValueMode = localStorage.getItem('currentMode');
    return savedValueMode !== null ? JSON.parse(savedValueMode) : 3;
  });

  // Persist all data changes
  useEffect(() => {
    localStorage.setItem('csvData', JSON.stringify(csvData));
  }, [csvData]);

  useEffect(() => {
    if (Object.keys(previousAmounts).length > 0) {
      localStorage.setItem('csvPreviousData', JSON.stringify(previousAmounts));
    }
  }, [previousAmounts]);

  useEffect(() => {
    if (lastUpdated) {
      localStorage.setItem('csvLastUpdated', lastUpdated.toISOString());
    }
  }, [lastUpdated]);

  useEffect(() => {
    localStorage.setItem('isJohnValues', JSON.stringify(isJohnValues));
  }, [isJohnValues]);

  useEffect(() => {
    localStorage.setItem('currentMode', JSON.stringify(currentMode));
  }, [currentMode]);

  // Helper function to update data (moved from CSVLoader)
  const updateCSVData = (newData) => {
    setPreviousAmounts(csvData);
    setCSVData(newData);
    setLastUpdated(new Date());
  };

  return (
    <CSVContext.Provider
      value={{
        csvData,
        setCSVData,
        previousAmounts,
        setPreviousAmounts,
        lastUpdated,
        setLastUpdated,
        isJohnValues,
        setIsJohnValues,
        currentMode,
        setCurrentMode,
        updateCSVData // New helper function
      }}
    >
      {children}
    </CSVContext.Provider>
  );
};