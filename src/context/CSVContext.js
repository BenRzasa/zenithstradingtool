import React, { createContext, useState } from 'react';

// Create a context for CSV data
export const CSVContext = createContext();

// Create a provider component
export const CSVProvider = ({ children }) => {
    const [csvData, setCSVData] = useState(Array(30).fill(0)); // Default to 30 zeros (or adjust as needed)

    return (
        <CSVContext.Provider value={{ csvData, setCSVData }}>
            {children}
        </CSVContext.Provider>
    );
};