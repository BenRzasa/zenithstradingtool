import React, { createContext, useState, useEffect, useRef } from 'react';
import { initialOreValsDict } from '../data/OreValues';
import { OreNames } from '../data/OreNames';

export const MiscContext = createContext();

export const MiscProvider = ({ children }) => {

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [hotkeysEnabled, setHotkeysEnabled] = useState(() => {
    const savedHotkeys = localStorage.getItem('hotkeysEnabled');
    return savedHotkeys !== null ? JSON.parse(savedHotkeys) : true;
  });
  const initialDictRef = useRef(initialOreValsDict);

  // Core CSV data state
  const [csvData, setCSVData] = useState(() => {
    const savedCSVData = localStorage.getItem('csvData');
    return savedCSVData ? JSON.parse(savedCSVData) : {};
  });

  // CSV History filtering out old entries without oreValsDict
  const [csvHistory, setCSVHistory] = useState(() => {
    const savedHistory = localStorage.getItem('csvHistory');
    try {
      const parsed = savedHistory ? JSON.parse(savedHistory) : [];
      return parsed.filter(entry => entry.oreValsDict);
    } catch (e) {
      console.error('Failed to parse CSV history', e);
      return [];
    }
  });

  // Persist 2nd csv
  const [secondaryCSVData, setSecondaryCSVData] = useState(() => {
    const savedSecondaryCSV = localStorage.getItem('secondaryCSVData');
    return savedSecondaryCSV ? JSON.parse(savedSecondaryCSV) : null;
  });

  // Whether to use second CSV currently
  const [useSecondaryCSV, setUseSecondaryCSV] = useState(() => {
    const savedUseSecondary = localStorage.getItem('useSecondaryCSV');
    return savedUseSecondary !== null ? JSON.parse(savedUseSecondary) : false;
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
  const [capCompletion, setCapCompletion] = useState(() => {
    const savedCapComp = localStorage.getItem('capCompletion');
    return savedCapComp !== null ? JSON.parse(savedCapComp) : true;
  });

  // Current value mode
  const [valueMode, setValueMode] = useState(() => {
    const savedValueMode = localStorage.getItem('valueMode');
    return savedValueMode !== null ? JSON.parse(savedValueMode) : 'zenith';
  });

  // Current value dict
  const [currentMode, setCurrentMode] = useState(() => {
    const savedCalcMode = localStorage.getItem('currentMode');
    return savedCalcMode !== null ? JSON.parse(savedCalcMode) : 3;
  });

  // Whether to use obtain rate vals for rares
  const [useObtainRateVals, setUseObtainRateVals] = useState(() => {
    const savedObtain = localStorage.getItem('useObtainRateVals');
    return savedObtain !== null ? JSON.parse(savedObtain) : false;
  })

  // Custom AV multiplier
  const [customMultiplier, setCustomMultiplier] = useState(() => {
    const savedCustomMult = localStorage.getItem('customMultiplier');
    return savedCustomMult !== null ? JSON.parse(savedCustomMult) : 100;
  });

  // Rare finds data state
  const [rareFindsData, setRareFindsData] = useState(() => {
    const savedRareFinds = localStorage.getItem('rareFindsData');
    return savedRareFinds ? JSON.parse(savedRareFinds) : {};
  });

  // Function to merge ore values while preserving custom values
  const mergeOreValues = (baseDict, customDict) => {
    const merged = JSON.parse(JSON.stringify(baseDict));

    for (const layerName in merged) {
      if (customDict[layerName]) {
        merged[layerName] = merged[layerName].map(ore => {
          const customOre = customDict[layerName].find(o => o.name === ore.name);
          return customOre ? { ...ore, customVal: customOre.customVal } : ore;
        });
      }
    }

    return merged;
  };

  // Ore values dictionary state with automatic updates from initialOreValsDict
  // Merges saved custom vals with current initial dict
  const [oreValsDict, setOreValsDict] = useState(() => {
    const savedDict = localStorage.getItem('oreValsDict');
    if (savedDict) {
      const savedData = JSON.parse(savedDict);
      return mergeOreValues(initialOreValsDict, savedData);
    }
    return initialOreValsDict;
  });

  // Effect to update oreValsDict when initialOreValsDict changes
  useEffect(() => {
    if (initialDictRef.current !== initialOreValsDict) {
      setOreValsDict(prev => mergeOreValues(initialOreValsDict, prev));
      initialDictRef.current = initialOreValsDict;
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
  useEffect(() => localStorage.setItem('hotkeysEnabled', JSON.stringify(hotkeysEnabled)), [hotkeysEnabled]);
  useEffect(() => localStorage.setItem('secondaryCSVData', JSON.stringify(secondaryCSVData)), [secondaryCSVData]);
  useEffect(() => localStorage.setItem('useSecondaryCSV', JSON.stringify(useSecondaryCSV)), [useSecondaryCSV]);
  useEffect(() => localStorage.setItem('csvHistory', JSON.stringify(csvHistory)), [csvHistory]);
  useEffect(() => localStorage.setItem('capCompletion', JSON.stringify(capCompletion)), [capCompletion]);
  useEffect(() => localStorage.setItem('valueMode', JSON.stringify(valueMode)), [valueMode]);
  useEffect(() => localStorage.setItem('currentMode', JSON.stringify(currentMode)), [currentMode]);
  useEffect(() => localStorage.setItem('useObtainRateVals', JSON.stringify(useObtainRateVals)), [useObtainRateVals]);
  useEffect(() => localStorage.setItem('customMultiplier', JSON.stringify(customMultiplier)), [customMultiplier]);
  useEffect(() => localStorage.setItem('rareFindsData', JSON.stringify(rareFindsData)), [rareFindsData]);
  useEffect(() => localStorage.setItem('oreValsDict', JSON.stringify(oreValsDict)), [oreValsDict]);

  // Update the CSV data and create a new history entry set to the current structure
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
        customMultiplier: customMultiplier,
        oreValsDict: oreValsDict,
      },
      ...prev.slice(0, 99)
    ]);
    setLastUpdated(now);
  };

  // Load an old CSV and its structure with old/missing ores
  const loadOldCSV = (index) => {
    if (index < 0 || index >= csvHistory.length) return;
    const historyEntry = csvHistory[index];

    if (!historyEntry || !historyEntry.oreValsDict) {
      console.error('Attempted to load invalid history entry');
      return;
    }

    setOreValsDict(historyEntry.oreValsDict);
    setCSVData(historyEntry.data);
    setValueMode(historyEntry.valueMode || 'zenith');

    if (historyEntry.valueMode === 'custom' && historyEntry.customMultiplier) {
      setCustomMultiplier(historyEntry.customMultiplier);
    }

    setLastUpdated(new Date(historyEntry.timestamp));
  };

  // Reset custom values to the selected value source
  const resetCustomValues = (source) => {
    const newOreVals = JSON.parse(JSON.stringify(initialOreValsDict));

    for (const layerName in newOreVals) {
      newOreVals[layerName] = newOreVals[layerName].map(ore => ({
        ...ore,
        customVal: source === 'john' ? ore.johnVal :
                  source === 'nan' ? ore.nanVal :
                  source === 'zenith' ? ore.zenithVal :
                  source === 'custom' ? ore.customVal :
                  ore.customVal
      }));
    }

    setOreValsDict(newOreVals);
    setValueMode('custom');
    return newOreVals;
  };

  // Get the value for a given ore based on the value mode / obtain rate selected
  const getValueForMode = (oreData) => {
    if (oreData.hasOwnProperty('obtainVal') && useObtainRateVals) return oreData.obtainVal;
    switch (valueMode) {
      case 'zenith': return oreData.zenithVal;
      case 'john': return oreData.johnVal;
      case 'nan': return oreData.nanVal;
      case 'custom': return oreData.customVal;
      default: return oreData.zenithVal;
    }
  };

  // Calculate AV totals for CSV data (MAY WANT TO MOVE TO NEW CSVCONTEXT)
  const calculateTotalAV = (data, useHistoricalOreVals = null) => {
    if (!data) return 0;

    let total = 0;
    const oreValuesToUse = useHistoricalOreVals || oreValsDict;

    OreNames.forEach(ore => {
      const amount = data[ore] || 0;
      let baseValue = 1;

      Object.values(oreValuesToUse).some(layer => {
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

  // Export all settings and functions here!
  const contextValue = {
    settingsOpen, setSettingsOpen,
    hotkeysEnabled, setHotkeysEnabled,
    updateCSVData, previousAmounts, lastUpdated,
    secondaryCSVData, setSecondaryCSVData,
    useSecondaryCSV, setUseSecondaryCSV,
    getCurrentCSV: () => useSecondaryCSV ? secondaryCSVData : csvData,
    csvHistory, setCSVHistory, loadOldCSV,
    capCompletion, setCapCompletion,
    valueMode, setValueMode, getValueForMode,
    currentMode, setCurrentMode,
    customMultiplier, setCustomMultiplier,
    useObtainRateVals, setUseObtainRateVals,
    oreValsDict, setOreValsDict,
    resetCustomValues,
    rareFindsData, setRareFindsData
  };

  return (
    <MiscContext.Provider value={contextValue}>
      {children}
    </MiscContext.Provider>
  );
};