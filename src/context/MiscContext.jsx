import React, { createContext, useState, useEffect, useRef, useMemo } from "react";
import { useOreValues } from "../hooks/useOreValues";
import { getOreNames } from "../data/OreNames";

export const MiscContext = createContext();

// ==================== UTILITY FUNCTIONS (DEFINE FIRST) ====================

// Initialize custom values (default to zenithVal)
const initializeCustomValues = (oreData) => {
    return oreData.map(layer => ({
        ...layer,
        layerOres: layer.layerOres.map(ore => ({
            ...ore,
            defaultVal: ore.defaultVal || ore.zenithVal || ore.obtainVal || ore.randomsVal || 0
        }))
    }));
};

// Find matching layer by name (flexible matching)
const findMatchingLayer = (layerName, dataArray) => {
    const baseName = layerName.split('\n')[0].trim();
    return dataArray.find(savedLayer => {
        const savedBaseName = savedLayer.layerName.split('\n')[0].trim();
        return baseName === savedBaseName || 
            layerName.includes(savedBaseName) || 
            savedLayer.layerName.includes(baseName);
    });
};

// Merge hook data with saved custom values
const mergeOreValues = (hookData, savedData) => {
    if (!Array.isArray(savedData) || savedData.length === 0) {
        return initializeCustomValues(hookData);
    }

    return hookData.map((hookLayer, layerIndex) => {
        // Find matching saved layer by layer name
        const savedLayer = findMatchingLayer(hookLayer.layerName, savedData);

        if (savedLayer && savedLayer.layerOres) {
            const mergedOres = hookLayer.layerOres.map(hookOre => {
                const savedOre = savedLayer.layerOres.find(o => o.name === hookOre.name);
                if (savedOre && savedOre.defaultVal !== undefined) {
                    // Preserve custom value from saved data
                    return { ...hookOre, defaultVal: savedOre.defaultVal };
                }
                // Initialize custom value if not present
                return {
                    ...hookOre,
                    defaultVal: hookOre.defaultVal || hookOre.zenithVal || hookOre.obtainVal || hookOre.randomsVal || 0
                };
            });

            return {
                ...hookLayer,
                layerOres: mergedOres
            };
        }

        // No matching saved layer, initialize all custom values
        return {
            ...hookLayer,
            layerOres: hookLayer.layerOres.map(ore => ({
                ...ore,
                defaultVal: ore.defaultVal || ore.zenithVal || ore.obtainVal || ore.randomsVal || 0
            }))
        };
    });
};

// Convert old object format to new array format
const convertOldFormatToNew = (oldDict) => {
    if (Array.isArray(oldDict)) return oldDict;

    const newFormat = [];

    Object.entries(oldDict).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            // Old format: { "True Rares": [{...}, {...}] }
            newFormat.push({
                layerName: key,
                layerOres: value,
                background: "linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)" // Default
            });
        } else if (value && typeof value === 'object') {
            // Somewhat new format
            newFormat.push({
                layerName: value.layerName || key,
                layerOres: value.layerOres || [],
                background: value.background || "linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)"
            });
        }
    });

    return newFormat;
};

export const MiscProvider = ({ children }) => {
    // ==================== STATE INITIALIZATION ====================
    // Get ore values from hook - now it returns an array directly
    const oreValuesFromHook = useOreValues();

    const [oreValsDict, setOreValsDict] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Effect to initialize oreValsDict when hook data is ready
    useEffect(() => {
        if (oreValuesFromHook && oreValuesFromHook.length > 0) {
            const savedDict = localStorage.getItem("oreValsDict");

            if (!savedDict) {
                // No saved data, use hook data and initialize custom values
                setOreValsDict(initializeCustomValues(oreValuesFromHook));
            } else {
                try {
                    const savedData = JSON.parse(savedDict);

                    if (Array.isArray(savedData)) {
                        // Already in new format, merge with hook data
                        setOreValsDict(mergeOreValues(oreValuesFromHook, savedData));
                    } else {
                        // Convert old format to new and merge
                        const convertedData = convertOldFormatToNew(savedData);
                        setOreValsDict(mergeOreValues(oreValuesFromHook, convertedData));
                    }
                } catch (e) {
                    console.error("Error parsing saved ore values:", e);
                    setOreValsDict(initializeCustomValues(oreValuesFromHook));
                }
            }
            setIsLoading(false);
        }
    }, [oreValuesFromHook]);

    // Compute oreNames from oreValsDict
    const oreNames = useMemo(() => {
        return getOreNames(oreValsDict);
    }, [oreValsDict]);

    // UI States
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [hotkeysEnabled, setHotkeysEnabled] = useState(() => {
        const savedHotkeys = localStorage.getItem("hotkeysEnabled");
        return savedHotkeys !== null ? JSON.parse(savedHotkeys) : true;
    });

    // CSV Data States
    const [csvData, setCSVData] = useState(() => {
        const savedCSVData = localStorage.getItem("csvData");
        return savedCSVData ? JSON.parse(savedCSVData) : {};
    });

    const [secondaryCSVData, setSecondaryCSVData] = useState(() => {
        const savedSecondaryCSV = localStorage.getItem("secondaryCSVData");
        return savedSecondaryCSV ? JSON.parse(savedSecondaryCSV) : null;
    });

    const [useSecondaryCSV, setUseSecondaryCSV] = useState(() => {
        const savedUseSecondary = localStorage.getItem("useSecondaryCSV");
        return savedUseSecondary !== null ? JSON.parse(savedUseSecondary) : false;
    });

    const [csvHistory, setCSVHistory] = useState(() => {
        const savedHistory = localStorage.getItem("csvHistory");
        try {
            const parsed = savedHistory ? JSON.parse(savedHistory) : [];
            return parsed.filter((entry) => entry.oreValsDict);
        } catch (e) {
            console.error("Failed to parse CSV history", e);
            return [];
        }
    });

    const [previousAmounts, setPreviousAmounts] = useState(() => {
        const savedPreviousData = localStorage.getItem("csvPreviousData");
        return savedPreviousData ? JSON.parse(savedPreviousData) : {};
    });

    const [lastUpdated, setLastUpdated] = useState(() => {
        const savedTime = localStorage.getItem("csvLastUpdated");
        return savedTime ? new Date(savedTime) : null;
    });

    // Value Calculation States
    const [capCompletion, setCapCompletion] = useState(() => {
        const savedCapComp = localStorage.getItem("capCompletion");
        return savedCapComp !== null ? JSON.parse(savedCapComp) : true;
    });

    const [valueMode, setValueMode] = useState(() => {
        const savedValueMode = localStorage.getItem("valueMode");
        return savedValueMode !== null ? JSON.parse(savedValueMode) : "zenith";
    });

    const [currentMode, setCurrentMode] = useState(() => {
        const savedCalcMode = localStorage.getItem("currentMode");
        return savedCalcMode !== null ? JSON.parse(savedCalcMode) : 3;
    });

    const [useObtainRateVals, setUseObtainRateVals] = useState(() => {
        const savedObtain = localStorage.getItem("useObtainRateVals");
        return savedObtain !== null ? JSON.parse(savedObtain) : false;
    });

    const [customMultiplier, setCustomMultiplier] = useState(() => {
        const savedCustomMult = localStorage.getItem("customMultiplier");
        return savedCustomMult !== null ? JSON.parse(savedCustomMult) : 100;
    });

    // Rare Finds States
    const [rareFindsData, setRareFindsData] = useState(() => {
        const savedRareFinds = localStorage.getItem("rareFindsData");
        return savedRareFinds ? JSON.parse(savedRareFinds) : {};
    });

    const [useSeparateRareMode, setUseSeparateRareMode] = useState(() => {
        const savedRareMode = localStorage.getItem("useSeparateRareMode");
        return savedRareMode ? JSON.parse(savedRareMode) : false;
    });

    const [rareValueMode, setRareValueMode] = useState(() => {
        const savedRareValueMode = localStorage.getItem("rareValueMode");
        return savedRareValueMode ? JSON.parse(savedRareValueMode) : 1;
    });

    const [rareCustomMultiplier, setRareCustomMultiplier] = useState(() => {
        const savedRareMultiplier = localStorage.getItem("rareCustomMultiplier");
        return savedRareMultiplier ? JSON.parse(savedRareMultiplier) : 100;
    });

    // Use a ref to track initial values
    const initialDictRef = useRef(oreValuesFromHook);

    // ==================== COMPONENT FUNCTIONS ====================

    // Reset custom values to a specific source
    const resetCustomValues = (source) => {
        const resetData = oreValsDict.map(layer => {
            const resetOres = layer.layerOres.map(ore => {
                let newCustomVal;
                switch(source) {
                    case "zenith":
                        newCustomVal = ore.zenithVal || 0;
                        break;
                    case "random":
                        newCustomVal = ore.randomsVal || 0;
                        break;
                    case "obtain":
                        newCustomVal = ore.obtainVal || ore.zenithVal || 0;
                        break;
                    case "custom":
                    default:
                        newCustomVal = ore.defaultVal || ore.zenithVal || 0;
                }

                return { ...ore, defaultVal: newCustomVal };
            });

            return { ...layer, layerOres: resetOres };
        });

        setOreValsDict(resetData);
        setValueMode("custom");
        return resetData;
    };

    // Get ore value based on current mode
    const getValueForMode = (oreData) => {
        if (!oreData || !oreData.name || oreData.name.includes("Essence")) return 0;

        if (oreData.hasOwnProperty("obtainVal") && useObtainRateVals) {
            return oreData.obtainVal || 0;
        }

        switch (valueMode) {
            case "zenith":
                return oreData.zenithVal || 0;
            case "john":
                return oreData.johnVal || 0;
            case "random":
                return oreData.randomsVal || 0;
            case "custom":
                return oreData.defaultVal || 0;
            default:
                return oreData.defaultVal || 0;
        }
    };

    // Calculate total AV from CSV data
    const calculateTotalAV = (data, useHistoricalOreVals = null) => {
        if (!data) return 0;

        let total = 0;
        const oreValuesToUse = useHistoricalOreVals || oreValsDict;

        oreNames.forEach((oreName) => {
            if (oreName.includes("Essence")) return;

            const amount = data[oreName] || 0;
            let baseValue = 1;

            // Search through all layers for the ore
            oreValuesToUse.some((layer) => {
                const oreData = layer.layerOres.find((item) => item.name === oreName);
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

    // ==================== CSV OPERATIONS ====================

    const updateCSVData = (newData) => {
        const now = new Date();
        const totalAV = calculateTotalAV(newData);

        setPreviousAmounts(csvData);
        setCSVData(newData);

        setCSVHistory((prev) => [
            {
                data: newData,
                timestamp: now.toISOString(),
                totalAV: totalAV,
                valueMode: valueMode,
                customMultiplier: customMultiplier,
                oreValsDict: oreValsDict,
            },
            ...prev.slice(0, 99),
        ]);

        setLastUpdated(now);
    };

    const loadOldCSV = (index) => {
        if (index < 0 || index >= csvHistory.length) return;

        const historyEntry = csvHistory[index];
        if (!historyEntry || !historyEntry.oreValsDict) {
            console.error("Attempted to load invalid history entry");
            return;
        }

        let historicalOreVals = historyEntry.oreValsDict;

        // Convert if necessary
        if (!Array.isArray(historicalOreVals)) {
            historicalOreVals = convertOldFormatToNew(historicalOreVals);
        }

        // Merge with current hook data
        const mergedOreVals = mergeOreValues(oreValuesFromHook, historicalOreVals);

        setOreValsDict(mergedOreVals);
        setCSVData(historyEntry.data);
        setValueMode(historyEntry.valueMode || "zenith");

        if (historyEntry.valueMode === "custom" && historyEntry.customMultiplier) {
            setCustomMultiplier(historyEntry.customMultiplier);
        }

        setLastUpdated(new Date(historyEntry.timestamp));
    };

    const clearCSVHistory = () => {
        if (window.confirm("Are you sure you want to clear all CSV history? This action cannot be undone.")) {
            setCSVHistory([]);
            localStorage.removeItem("csvHistory");
        }
    };

    const clearCSVData = () => {
        localStorage.removeItem("csvData");
        localStorage.removeItem("csvPreviousData");
        localStorage.removeItem("csvLastUpdated");
        localStorage.removeItem("csvHistory");
        localStorage.removeItem("secondaryCSVData");
        localStorage.removeItem("useSecondaryCSV");

        setCSVData({});
        setPreviousAmounts({});
        setLastUpdated(null);
        setCSVHistory([]);
        setSecondaryCSVData(null);
        setUseSecondaryCSV(false);

        console.log("All CSV data cleared");
    };

    // Helper function for CSS classes
    const getOreClassName = (oreName) => {
        return `color-template-${oreName.toLowerCase().replace(/ /g, "-")}`;
    };

    // Get current CSV (primary or secondary)
    const getCurrentCSV = () => {
        return useSecondaryCSV ? secondaryCSVData : csvData;
    };

    // ==================== EFFECTS ====================

    // Update ore values when hook data changes
    useEffect(() => {
        if (initialDictRef.current !== oreValuesFromHook) {
            const merged = mergeOreValues(oreValuesFromHook, oreValsDict);
            setOreValsDict(merged);
            initialDictRef.current = oreValuesFromHook;
        }
    }, [oreValuesFromHook]);

    // Persist states to localStorage
    useEffect(() => {
        localStorage.setItem("csvData", JSON.stringify(csvData));
    }, [csvData]);

    useEffect(() => {
        if (Object.keys(previousAmounts).length > 0) {
            localStorage.setItem("csvPreviousData", JSON.stringify(previousAmounts));
        }
    }, [previousAmounts]);

    useEffect(() => {
        if (lastUpdated) {
            localStorage.setItem("csvLastUpdated", lastUpdated.toISOString());
        }
    }, [lastUpdated]);

    useEffect(() => {
        localStorage.setItem("hotkeysEnabled", JSON.stringify(hotkeysEnabled));
    }, [hotkeysEnabled]);

    useEffect(() => {
        localStorage.setItem("secondaryCSVData", JSON.stringify(secondaryCSVData));
    }, [secondaryCSVData]);

    useEffect(() => {
        localStorage.setItem("useSecondaryCSV", JSON.stringify(useSecondaryCSV));
    }, [useSecondaryCSV]);

    useEffect(() => {
        localStorage.setItem("csvHistory", JSON.stringify(csvHistory));
    }, [csvHistory]);

    useEffect(() => {
        localStorage.setItem("capCompletion", JSON.stringify(capCompletion));
    }, [capCompletion]);

    useEffect(() => {
        localStorage.setItem("valueMode", JSON.stringify(valueMode));
    }, [valueMode]);

    useEffect(() => {
        localStorage.setItem("currentMode", JSON.stringify(currentMode));
    }, [currentMode]);

    useEffect(() => {
        localStorage.setItem("useObtainRateVals", JSON.stringify(useObtainRateVals));
    }, [useObtainRateVals]);

    useEffect(() => {
        localStorage.setItem("customMultiplier", JSON.stringify(customMultiplier));
    }, [customMultiplier]);

    useEffect(() => {
        localStorage.setItem("rareFindsData", JSON.stringify(rareFindsData));
    }, [rareFindsData]);

    useEffect(() => {
        localStorage.setItem("oreValsDict", JSON.stringify(oreValsDict));
    }, [oreValsDict]);

    useEffect(() => {
        localStorage.setItem("useSeparateRareMode", JSON.stringify(useSeparateRareMode));
    }, [useSeparateRareMode]);

    useEffect(() => {
        localStorage.setItem("rareValueMode", JSON.stringify(rareValueMode));
    }, [rareValueMode]);

    useEffect(() => {
        localStorage.setItem("rareCustomMultiplier", JSON.stringify(rareCustomMultiplier));
    }, [rareCustomMultiplier]);

    // ==================== CONTEXT VALUE ====================

    const contextValue = useMemo(() => ({
        // UI States
        settingsOpen,
        setSettingsOpen,
        hotkeysEnabled,
        setHotkeysEnabled,

        // CSV Operations
        csvData,
        secondaryCSVData,
        setSecondaryCSVData,
        useSecondaryCSV,
        setUseSecondaryCSV,
        getCurrentCSV,
        updateCSVData,
        previousAmounts,
        lastUpdated,

        // CSV History
        csvHistory,
        setCSVHistory,
        loadOldCSV,
        clearCSVHistory,
        clearCSVData,

        // Value Calculation
        capCompletion,
        setCapCompletion,
        valueMode,
        setValueMode,
        currentMode,
        setCurrentMode,
        customMultiplier,
        setCustomMultiplier,
        useObtainRateVals,
        setUseObtainRateVals,
        getValueForMode,
        calculateTotalAV,

        // Rare Finds
        rareFindsData,
        setRareFindsData,
        useSeparateRareMode,
        setUseSeparateRareMode,
        rareValueMode,
        setRareValueMode,
        rareCustomMultiplier,
        setRareCustomMultiplier,

        // Ore Values
        oreValsDict,
        setOreValsDict,
        oreNames,
        resetCustomValues,

        // Utilities
        getOreClassName,
    }), [
            settingsOpen, hotkeysEnabled, csvData, secondaryCSVData, useSecondaryCSV,
            previousAmounts, lastUpdated, csvHistory, capCompletion, valueMode,
            currentMode, customMultiplier, useObtainRateVals, rareFindsData,
            useSeparateRareMode, rareValueMode, rareCustomMultiplier, oreValsDict,
            oreNames
        ]);

    return (
        <MiscContext.Provider value={contextValue}>
            {children}
        </MiscContext.Provider>
    );
};
