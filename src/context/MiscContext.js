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
import { zenithValsDict } from '../data/ZenithVals';
import { OreNames } from '../data/OreNames';

export const MiscContext = createContext();

export const MiscProvider = ({ children }) => {
  // Core CSV data state
  const [csvData, setCSVData] = useState(() => {
    const savedCSVData = localStorage.getItem('csvData');
    return savedCSVData ? JSON.parse(savedCSVData) : {};
  });

  // CSV History state
  const [csvHistory, setCSVHistory] = useState(() => {
    const savedHistory = localStorage.getItem('csvHistory');
    try {
      const parsed = savedHistory ? JSON.parse(savedHistory) : [];
      // Ensure all timestamps are proper Date objects
      return parsed.map(entry => ({
        ...entry,
        timestamp: new Date(entry.timestamp)
      }));
    } catch (e) {
      console.error('Failed to parse CSV history', e);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('csvHistory', JSON.stringify(csvHistory));
  }, [csvHistory]);

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
    return savedValueMode !== null ? JSON.parse(savedValueMode) : 'zenith';
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

  const updateCustomDict = () => {
    if (!customDict) return false;
    // Create a map of the current custom dictionary for reference
    const currentLayers = new Map(Object.entries(customDict));
    let hasUpdates = false;
    // Build the new dictionary following John's exact structure
    const updatedDict = {};
    // Process John's dictionary in order
    for (const [layerName, johnOres] of Object.entries(johnValsDict)) {
      // Check if we need to update this layer
      if (!currentLayers.has(layerName)) {
        // New layer - add completely
        updatedDict[layerName] = JSON.parse(JSON.stringify(johnOres));
        hasUpdates = true;
        continue;
      }
      // Compare existing layer with John's version
      const currentOres = currentLayers.get(layerName);
      const currentOreMap = new Map(currentOres.map(ore => [ore.name, ore]));
      // Check if ores match exactly (same names in same order)
      const johnOreNames = johnOres.map(ore => ore.name);
      const currentOreNames = currentOres.map(ore => ore.name);
      if (JSON.stringify(johnOreNames) !== JSON.stringify(currentOreNames)) {
        // Ores don't match - rebuild layer exactly like John's
        const rebuiltOres = johnOres.map(johnOre => {
          // Preserve custom properties if this ore existed before
          const existingOre = currentOreMap.get(johnOre.name);
          return existingOre ? {...existingOre} : {...johnOre};
        });
        updatedDict[layerName] = rebuiltOres;
        hasUpdates = true;
      } else {
        // Ores match exactly - copy as-is
        updatedDict[layerName] = JSON.parse(JSON.stringify(currentOres));
      }
    }
    // Check for layers that were removed from John's dict
    const currentLayerNames = [...currentLayers.keys()];
    const johnLayerNames = Object.keys(johnValsDict);
    if (currentLayerNames.some(name => !johnLayerNames.includes(name))) {
      hasUpdates = true;
      // We don't need to do anything else since updatedDict only contains John's layers
    }
    // Check if the layer order changed
    if (JSON.stringify(Object.keys(updatedDict)) !== JSON.stringify(Object.keys(customDict))) {
      hasUpdates = true;
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
           valueMode === 'zenith' ? zenithValsDict :
           customDict || zenithValsDict; // Fallback
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
      localStorage.setItem('csvLastUpdated', lastUpdated instanceof Date ? lastUpdated.toISOString() : new Date(lastUpdated).toISOString());
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
  const updateCSVData = (newData) => {
    const now = new Date();
    // Calculate total AV for this CSV
    const totalAV = calculateTotalAV(newData);
    // Add to history
    setCSVHistory(prev => {
      const newHistory = [
        {
          data: newData,
          timestamp: now.toISOString(),
          totalAV: totalAV,
          valueMode: valueMode,
          customMultiplier: customMultiplier
        },
        ...prev.slice(0, 999) // Keep last 1000 entries
      ];
      return newHistory;
    });
    setPreviousAmounts(csvData);
    setCSVData(newData);
    setLastUpdated(now);
  };

  // Function to load an old CSV
  const loadOldCSV = (index) => {
    if (index < 0 || index >= csvHistory.length) return;
    const historyEntry = csvHistory[index];
    if (!historyEntry) return;
    try {
      setCSVData(historyEntry.data);
      // Set the chart to the value mode used when saved
      setValueMode(historyEntry.valueMode || 'zenith');
      if (historyEntry.valueMode === 'custom' && historyEntry.customMultiplier) {
        setCustomMultiplier(historyEntry.customMultiplier);
      }
      // Ensure we have a valid date when loading from history
      const loadedDate = historyEntry.timestamp 
        ? new Date(historyEntry.timestamp)
        : new Date();
      setLastUpdated(loadedDate);
    } catch (e) {
      console.error('Failed to load old CSV:', e);
    }
  };

  // Initialize custom dictionary from a source
  const initializeCustomDict = (source) => {
    const newCustomDict = source === 'zenith'
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
    if (!data) return 0;
    
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

  // Context value
  const contextValue = {
    csvData,
    updateCSVData,
    previousAmounts,
    lastUpdated,
    csvHistory,
    setCSVHistory,
    loadOldCSV,
    valueMode,
    setValueMode,
    currentMode,
    setCurrentMode,
    customMultiplier,
    setCustomMultiplier,
    currentDict,
    customDict,
    setCustomDict,
    updateCustomDict,
    initializeCustomDict,
    exportCustomDict,
    importCustomDict,
    rareFindsData,
    setRareFindsData
  };

  return (
    <MiscContext.Provider value={contextValue}>
      {children}
    </MiscContext.Provider>
  );
};