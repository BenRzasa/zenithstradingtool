/* ZTT | Context file to ensure persistency of the CSV data
  - e.g., from the CSV page over to the value chart, or from the
  value chart over to the trade tool (since it needs the inventory data)
  - Also the rare finds
  - And random other things
  - Also the custom values
*/

import React, { createContext, useState, useEffect, useRef } from 'react';
import { initialOreValsDict } from '../data/OreValues';
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
      return savedHistory ? JSON.parse(savedHistory) : [];
    } catch (e) {
      console.error('Failed to parse CSV history', e);
      return [];
    }
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

  useEffect(() => {
    try {
      localStorage.setItem('csvData', JSON.stringify(csvData));
    } catch (e) {
      console.error('Failed to save csvData to localStorage', e);
    }
  }, [csvData]);

  useEffect(() => {
    try {
      if (Object.keys(previousAmounts).length > 0) {
        localStorage.setItem('csvPreviousData', JSON.stringify(previousAmounts));
      }
    } catch (e) {
      console.error('Failed to save previousAmounts to localStorage', e);
    }
  }, [previousAmounts]);

  useEffect(() => {
    try {
      if (lastUpdated) {
        localStorage.setItem('csvLastUpdated', lastUpdated.toISOString());
      }
    } catch (e) {
      console.error('Failed to save lastUpdated to localStorage', e);
    }
  }, [lastUpdated]);

  useEffect(() => {
    try {
      localStorage.setItem('csvHistory', JSON.stringify(csvHistory));
    } catch (e) {
      console.error('Failed to save csvHistory to localStorage', e);
    }
  }, [csvHistory]);

  const [capCompletion, setCapCompletion] = useState(() => {
    const savedCapComp = localStorage.getItem('capCompletion');
    return savedCapComp !== null ? JSON.parse(savedCapComp) : true;
  });

  // Value calculation settings
  const [valueMode, setValueMode] = useState(() => {
    const savedValueMode = localStorage.getItem('valueMode');
    return savedValueMode !== null ? JSON.parse(savedValueMode) : 'zenith';
  });

  const [currentMode, setCurrentMode] = useState(() => {
    const savedCalcMode = localStorage.getItem('currentMode');
    return savedCalcMode !== null ? JSON.parse(savedCalcMode) : 3;
  });

  const [customMultiplier, setCustomMultiplier] = useState(() => {
    const savedCustomMult = localStorage.getItem('customMultiplier');
    return savedCustomMult !== null ? JSON.parse(savedCustomMult) : 100;
  });

  // Rare finds data state
  const [rareFindsData, setRareFindsData] = useState(() => {
    const savedRareFinds = localStorage.getItem('rareFindsData');
    return savedRareFinds ? JSON.parse(savedRareFinds) : {};
  });

  // Initialize oreValsDict with saved custom values
  const [oreValsDict, setOreValsDict] = useState(() => {
    try {
      const savedDict = localStorage.getItem('oreValsDict');
      return savedDict ? JSON.parse(savedDict) : initialOreValsDict;
    } catch (e) {
      console.error('Failed to parse saved oreValsDict', e);
      return initialOreValsDict;
    }
  });

  // Add this effect to handle initialOreValsDict updates while preserving custom values
  useEffect(() => {
    if (currentInitialDictRef.current !== initialOreValsDict) {
      setOreValsDict(prev => {
        // Merge custom values with new initial dict
        const mergedDict = JSON.parse(JSON.stringify(initialOreValsDict));
        
        // Preserve existing custom values
        Object.keys(prev).forEach(layerName => {
          if (mergedDict[layerName]) {
            mergedDict[layerName] = mergedDict[layerName].map(newOre => {
              const existingOre = prev[layerName]?.find(o => o.name === newOre.name);
              return existingOre ? { ...newOre, customVal: existingOre.customVal } : newOre;
            });
          }
        });
        
        return mergedDict;
      });
      currentInitialDictRef.current = initialOreValsDict;
    }
  }, []);

  // Track the current version of initialOreValsDict
  const currentInitialDictRef = useRef(initialOreValsDict);

  // Effect to immediately update when initialOreValsDict changes
  useEffect(() => {
    if (currentInitialDictRef.current !== initialOreValsDict) {
      setOreValsDict(initialOreValsDict);
      currentInitialDictRef.current = initialOreValsDict;
    }
  }, []);

  // Persist all data changes
  useEffect(() => localStorage.setItem('csvData', JSON.stringify(csvData)), [csvData]);
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
  useEffect(() => localStorage.setItem('capCompletion', JSON.stringify(capCompletion)), [capCompletion]);
  useEffect(() => localStorage.setItem('valueMode', JSON.stringify(valueMode)), [valueMode]);
  useEffect(() => localStorage.setItem('currentMode', JSON.stringify(currentMode)), [currentMode]);
  useEffect(() => localStorage.setItem('customMultiplier', JSON.stringify(customMultiplier)), [customMultiplier]);
  useEffect(() => localStorage.setItem('rareFindsData', JSON.stringify(rareFindsData)), [rareFindsData]);
  useEffect(() => localStorage.setItem('oreValsDict', JSON.stringify(oreValsDict)), [oreValsDict]);

  const updateCSVData = (newData) => {
    const now = new Date();
    const totalAV = calculateTotalAV(newData);
    setPreviousAmounts(csvData);
    setCSVData(newData);
    setCSVHistory(prev => [
      {
        data: newData,
        timestamp: now.toISOString(),
        totalAV: totalAV,
        valueMode: valueMode,
        customMultiplier: customMultiplier
      },
      ...prev.slice(0, 999)
    ]);
    setLastUpdated(now);
  };

  // Function to load an old CSV
  const loadOldCSV = (index) => {
    if (index < 0 || index >= csvHistory.length) return;
    const historyEntry = csvHistory[index];
    if (!historyEntry) return;
    setCSVData(historyEntry.data);
    setValueMode(historyEntry.valueMode || 'zenith');
    if (historyEntry.valueMode === 'custom' && historyEntry.customMultiplier) {
      setCustomMultiplier(historyEntry.customMultiplier);
    }
    setLastUpdated(new Date(historyEntry.timestamp)); // Convert ISO string to Date
  };

  // Initialize custom dictionary from a source
  const resetCustomValues = (source) => {
    const newOreVals = JSON.parse(JSON.stringify(initialOreValsDict));

    // Apply the selected source's values
    for (const layerName in newOreVals) {
      newOreVals[layerName] = newOreVals[layerName].map(ore => ({
        ...ore,
        customVal: source === 'john' ? ore.johnVal : 
                  source === 'nan' ? ore.nanVal : 
                  ore.zenithVal
      }));
    }
    // Force immediate update and save
    setOreValsDict(newOreVals);
    localStorage.setItem('oreValsDict', JSON.stringify(newOreVals));
    setValueMode('custom');
    return newOreVals;
  };

  const getValueForMode = (oreData) => {
    switch (valueMode) {
      case 'john': return oreData.johnVal;
      case 'nan': return oreData.nanVal;
      case 'custom': return oreData.customVal;
      default: return oreData.zenithVal;
    }
  };

  // Helper function to calculate total AV
  const calculateTotalAV = (data) => {
    if (!data) return 0;

    let total = 0;
    OreNames.forEach(ore => {
      const amount = data[ore] || 0;
      let baseValue = 1;
      
      Object.values(oreValsDict).some(layer => {
        const oreData = layer.find(item => item.name === ore);
        if (oreData) {
          baseValue = getValueForMode(oreData);
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
    capCompletion,
    setCapCompletion,
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