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
import { OreNames } from '../data/OreNames';

export const MiscContext = createContext();

export const MiscProvider = ({ children }) => {
  // Core CSV data state
  const [csvData, setCSVData] = useState(() => {
    const savedCSVData = localStorage.getItem('csvData');
    return savedCSVData ? JSON.parse(savedCSVData) : {};
  });

  // CSV History state
  const [csvHistory, setCsvHistory] = useState(() => {
    const savedHistory = localStorage.getItem('csvHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
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

  const [customMultiplier, setCustomMultiplier] = useState(() => {
    const savedCustomMult = localStorage.getItem('customMultiplier');
    return savedCustomMult !== null ? JSON.parse(savedCustomMult) : 100; // Default
  })

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

  // Update custom dict with NEW ORES
  const updateCustomDict = () => {
    if (!customDict) return false;
    let hasUpdates = false;
    const updatedDict = JSON.parse(JSON.stringify(customDict));
    // Check each layer in John's dictionary
    for (const [layerName, johnOres] of Object.entries(johnValsDict)) {
      if (!updatedDict[layerName]) {
        // If layer doesn't exist in custom dict, add it completely
        updatedDict[layerName] = JSON.parse(JSON.stringify(johnOres));
        hasUpdates = true;
        continue;
      }
      // Create set of existing ore names for quick lookup
      const existingOreNames = new Set(updatedDict[layerName].map(ore => ore.name));
      // Find all new ores that need to be inserted
      const newOres = johnOres.filter(johnOre => !existingOreNames.has(johnOre.name));
      if (newOres.length === 0) continue;
      hasUpdates = true;
      // Rebuild the layer array with new ores in correct positions
      const johnOrePositions = new Map(johnOres.map((ore, index) => [ore.name, index]));
      const mergedOres = [...updatedDict[layerName]];
      // Insert new ores at their original John's dictionary positions
      for (const newOre of newOres) {
        const targetPosition = johnOrePositions.get(newOre.name);
        let insertPosition = 0;
        // Find where to insert by counting how many John's ores come before this one
        // that also exist in our custom dictionary
        for (let i = 0; i < targetPosition; i++) {
          const johnOreName = johnOres[i].name;
          if (existingOreNames.has(johnOreName)) {
            insertPosition++;
          }
        }
        mergedOres.splice(insertPosition, 0, {...newOre});
      }
      updatedDict[layerName] = mergedOres;
    }
    if (hasUpdates) {
      setCustomDict(updatedDict);
      return true;
    }
    return false;
  };

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
    localStorage.setItem('customMultiplier', JSON.stringify(customMultiplier));
  }, [customMultiplier]);

  useEffect(() => {
    if (customDict) {
      localStorage.setItem('customDict', JSON.stringify(customDict));
    }
  }, [customDict]);

  useEffect(() => {
    localStorage.setItem('rareFindsData', JSON.stringify(rareFindsData));
  }, [rareFindsData]);

  // Helper function to update data
  // Update the updateCSVData function to also update history
  const updateCSVData = (newData) => {
    const now = new Date();
    // Calculate total AV for this CSV
    const totalAV = calculateTotalAV(newData);
    // Add to history
    setCsvHistory(prev => {
      const newHistory = [
        {
          data: newData,
          timestamp: now,
          totalAV: totalAV
        },
        ...prev.slice(0, 99) // Keep only last 100 entries
      ];
      return newHistory;
    });
    setPreviousAmounts(csvData);
    setCSVData(newData);
    setLastUpdated(now);
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

  // Helper function to calculate total AV
  const calculateTotalAV = (data) => {
    let total = 0;
    OreNames.forEach(ore => {
      const amount = data[ore] || 0;
      // Find the ore's base value
      let baseValue = 1;
      Object.values(currentDict).some(layer => {
        const oreData = layer.find(item => item.name === ore);
        if (oreData) {
          baseValue = oreData.baseValue;
          return true;
        }
        return false;
      });
      total += amount / baseValue;
    });
    return total;
  };

  // Function to load an old CSV
  const loadOldCSV = (index) => {
    if (index < 0 || index >= csvHistory.length) return;
    const oldCSVs = csvHistory[index];
    setCSVData(oldCSVs.data);
    setLastUpdated(oldCSVs.timestamp);
  };


  return (
    <MiscContext.Provider
      value={{
        // Core data
        csvData,
        setCSVData,
        loadOldCSV,
        calculateTotalAV,
        csvHistory,
        setCsvHistory,
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
        customMultiplier,
        setCustomMultiplier,
        customDict,
        setCustomDict,
        initializeCustomDict,
        exportCustomDict,
        importCustomDict,
        currentDict,
        updateCustomDict,
        // Helper functions
        updateCSVData
      }}
    >
      {children}
    </MiscContext.Provider>
  );
};
