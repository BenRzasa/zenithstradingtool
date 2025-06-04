/* ZTT | Context file to ensure persistency of the CSV data
  - e.g., from the CSV page over to the value chart, or from the
  value chart over to the trade tool (since it needs the inventory data)
  - Also the rare finds
  - And random other things
  - Also the custom values
*/

/* ZTT | Enhanced Context file with Custom Values support */
import React, { createContext, useState, useEffect, useRef } from 'react';
import { initialOreValsDict } from '../data/OreValues';
import { OreNames } from '../data/OreNames';

export const MiscContext = createContext();

export const MiscProvider = ({ children }) => {
  // Keep track of the initial dictionary version
  const initialDictRef = useRef(initialOreValsDict);
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
  });

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
  const resetCustomValues = (source) => {
    const newOreVals = JSON.parse(JSON.stringify(oreValsDict)); // Deep copy
    for (const layerName in newOreVals) {
      newOreVals[layerName] = newOreVals[layerName].map(ore => {
        let newValue;
        switch (source) {
          case 'john': newValue = ore.johnVal; break;
          case 'nan': newValue = ore.nanVal; break;
          default: newValue = ore.zenithVal; // 'zenith' is default
        }
        return {
          ...ore,
          customVal: newValue
        };
      });
    }
    setOreValsDict(newOreVals);
    setValueMode('custom');
    return newOreVals;
  };

  const getValueForMode = (oreData) => {
    switch (valueMode) { // Using the state valueMode directly
      case 'john': return oreData.johnVal;
      case 'nan': return oreData.nanVal;
      case 'custom': return oreData.customVal;
      default: return oreData.zenithVal; // 'zenith' is default
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
      Object.values(oreValsDict).some(layer => {
        const oreData = layer.find(item => item.name === ore);
        if (oreData) {
          // Use the value based on the current value mode
          baseValue = getValueForMode(oreData);
          return true;
        }
        return false;
      });
      total += amount / baseValue;
    });
    return total;
  };

  // Ore values dictionary state
  const [oreValsDict, setOreValsDict] = useState(() => {
    const savedOreVals = localStorage.getItem('oreValsDict');
    // Only use saved values if the structure matches current initial dict
    if (savedOreVals) {
      try {
        const parsed = JSON.parse(savedOreVals);
        if (dictStructureMatches(initialOreValsDict, parsed)) {
          return parsed;
        }
      } catch (e) {
        console.error('Failed to parse saved ore values', e);
      }
    }
    return initialOreValsDict;
  });

  // Track previous values for change detection
  const prevOreValsRef = useRef(oreValsDict);

  // Effect to detect changes in initialOreValsDict
  useEffect(() => {
    if (!dictStructureMatches(initialDictRef.current, initialOreValsDict)) {
      console.log('Detected changes in initialOreValsDict, updating structure...');
      setOreValsDict(initialOreValsDict);
      initialDictRef.current = initialOreValsDict;
    }
  }, []);

  // Effect to track value changes and save to localStorage
  useEffect(() => {
    // Compare current values with previous values
    const changes = findValueChanges(prevOreValsRef.current, oreValsDict);
    if (changes.length > 0) {
      console.log('Ore value changes detected:', changes);
      // Here you could send these changes to an analytics service or do something else with them
    }
    // Save current values to localStorage
    localStorage.setItem('oreValsDict', JSON.stringify(oreValsDict));
    // Update the previous values reference
    prevOreValsRef.current = oreValsDict;
  }, [oreValsDict]);

  // Helper function to compare dictionary structures
  function dictStructureMatches(dict1, dict2) {
    const layers1 = Object.keys(dict1);
    const layers2 = Object.keys(dict2);
    // Check if layer names match
    if (layers1.length !== layers2.length || 
        !layers1.every(layer => layers2.includes(layer))) {
      return false;
    }
    // Check if ores in each layer match
    for (const layer of layers1) {
      const ores1 = dict1[layer].map(ore => ore.name);
      const ores2 = dict2[layer].map(ore => ore.name);
      if (ores1.length !== ores2.length || 
          !ores1.every(ore => ores2.includes(ore))) {
        return false;
      }
    }
    return true;
  }

  // New function to find value changes between two ore dictionaries
  function findValueChanges(prevDict, currentDict) {
    const changes = [];
    // Iterate through all layers
    for (const layer in currentDict) {
      if (prevDict[layer]) {
        // Iterate through all ores in the layer
        for (const currentOre of currentDict[layer]) {
          const prevOre = prevDict[layer].find(o => o.name === currentOre.name);
          if (prevOre) {
            // Check each value type for changes
            if (prevOre.zenithVal !== currentOre.zenithVal) {
              changes.push({
                layer,
                ore: currentOre.name,
                valueType: 'zenithVal',
                from: prevOre.zenithVal,
                to: currentOre.zenithVal
              });
            }
            if (prevOre.johnVal !== currentOre.johnVal) {
              changes.push({
                layer,
                ore: currentOre.name,
                valueType: 'johnVal',
                from: prevOre.johnVal,
                to: currentOre.johnVal
              });
            }
            if (prevOre.nanVal !== currentOre.nanVal) {
              changes.push({
                layer,
                ore: currentOre.name,
                valueType: 'nanVal',
                from: prevOre.nanVal,
                to: currentOre.nanVal
              });
            }
            if (prevOre.customVal !== currentOre.customVal) {
              changes.push({
                layer,
                ore: currentOre.name,
                valueType: 'customVal',
                from: prevOre.customVal,
                to: currentOre.customVal
              });
            }
          }
        }
      }
    }
    return changes;
  }

  useEffect(() => {
    if (oreValsDict) {
      localStorage.setItem('oreValsDict', JSON.stringify(oreValsDict));
    }
  }, [oreValsDict]);

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
    getValueForMode,
    currentMode,
    setCurrentMode,
    customMultiplier,
    setCustomMultiplier,
    oreValsDict,
    setOreValsDict,
    resetCustomValues,
    rareFindsData,
    setRareFindsData
  };

  return (
    <MiscContext.Provider value={contextValue}>
      {children}
    </MiscContext.Provider>
  );
};