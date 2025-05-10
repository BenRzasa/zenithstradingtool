/* ZTT | Context file to ensure persistency of the CSV data
  - e.g., from the CSV page over to the value chart, or from the
  value chart over to the trade tool (since it needs the inventory data)
  - Also the rare finds
  - And random other things
  - Also the custom values
*/

/* ZTT | Enhanced Context file with Custom Values support */
import React, { createContext, useState, useEffect, useMemo } from 'react';
import { johnValsDict } from '../data/JohnVals';
import { nanValsDict } from '../data/NANVals';

export const MiscContext = createContext();

export const MiscProvider = ({ children }) => {
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
  const [valueMode, setValueMode] = useState(() => {
    const savedValueMode = localStorage.getItem('valueMode');
    return savedValueMode !== null ? JSON.parse(savedValueMode) : 'john'; // 'john', 'nan', or 'custom'
  });

  const [currentMode, setCurrentMode] = useState(() => {
    const savedCalcMode = localStorage.getItem('currentMode');
    return savedCalcMode !== null ? JSON.parse(savedCalcMode) : 3; // 1-7 for AV/UV/NV/etc
  });

  // Custom values dictionary
  const [customDict, setCustomDict] = useState(() => {
    const savedCustomDict = localStorage.getItem('customDict');
    try {
      return savedCustomDict ? JSON.parse(savedCustomDict) :
        JSON.parse(JSON.stringify(johnValsDict)); // Default to John's values copy
    } catch (e) {
      console.error('Failed to parse customDict', e);
      return JSON.parse(JSON.stringify(johnValsDict)); // Fallback
    }
  });

  const currentDict = useMemo(() => {
    return valueMode === 'john' ? johnValsDict :
           valueMode === 'nan' ? nanValsDict :
           customDict || johnValsDict; // Fallback
  }, [valueMode, customDict]);

  // Rare finds data state
  const [rareFindsData, setRareFindsData] = useState(() => {
    const savedRareFinds = localStorage.getItem('rareFindsData');
    return savedRareFinds ? JSON.parse(savedRareFinds) : {};
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
    localStorage.setItem('valueMode', JSON.stringify(valueMode));
  }, [valueMode]);

  useEffect(() => {
    localStorage.setItem('currentMode', JSON.stringify(currentMode));
  }, [currentMode]);

  useEffect(() => {
    if (customDict) {
      localStorage.setItem('customDict', JSON.stringify(customDict));
    }
  }, [customDict]);

  useEffect(() => {
    localStorage.setItem('rareFindsData', JSON.stringify(rareFindsData));
  }, [rareFindsData]);

  // Helper function to update data
  const updateCSVData = (newData) => {
    setPreviousAmounts(csvData);
    setCSVData(newData);
    setLastUpdated(new Date());
  };

  // Initialize custom dictionary from a source
  const initializeCustomDict = (source) => {
    const newCustomDict = source === 'john'
      ? JSON.parse(JSON.stringify(johnValsDict))
      : JSON.parse(JSON.stringify(nanValsDict));
    setCustomDict(newCustomDict);
    setValueMode('custom');
    return newCustomDict;
  };

  // Export custom dictionary
  const exportCustomDict = () => {
    if (!customDict) return null;
    return JSON.stringify(customDict, null, 2);
  };

  // Import custom dictionary
  const importCustomDict = (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      setCustomDict(parsed);
      setValueMode('custom');
      return true;
    } catch (e) {
      console.error('Failed to import custom values:', e);
      return false;
    }
  };

  return (
    <MiscContext.Provider
      value={{
        // Core data
        csvData,
        setCSVData,
        rareFindsData,
        setRareFindsData,
        previousAmounts,
        setPreviousAmounts,
        lastUpdated,
        setLastUpdated,
        // Value modes
        valueMode,
        setValueMode,
        currentMode,
        setCurrentMode,
        // Custom values
        customDict,
        setCustomDict,
        initializeCustomDict,
        exportCustomDict,
        importCustomDict,
        currentDict,
        // Helper functions
        updateCSVData
      }}
    >
      {children}
    </MiscContext.Provider>
  );
};
