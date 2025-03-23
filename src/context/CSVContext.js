import React, { createContext, useState } from 'react';
import { OreNames } from "../components/OreNames";

export const CSVContext = createContext();

export const CSVProvider = ({ children }) => {
  const [csvData, setCSVData] = useState(Array(OreNames.length).fill(0)); // Initialize as an array

  return (
    <CSVContext.Provider value={{ csvData, setCSVData }}>
      {children}
    </CSVContext.Provider>
  );
};