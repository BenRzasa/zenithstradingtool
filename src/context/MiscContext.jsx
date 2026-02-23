/*
 * Zenith's Trading Tool - An external website created for Celestial Caverns
 * Copyright (C) 2026 - Ben Rzasa
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the 'Software'), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE 
 * SOFTWARE.
*/

/*
 * Zenith's Trading Tool - An external website created for Celestial Caverns
 * Copyright (C) 2026 - Ben Rzasa
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE 
 * SOFTWARE.
*/

import React, { createContext, useState, useEffect, useRef, useMemo } from "react";
import { useOreValues } from "../hooks/useOreValues";
import { getOreNames } from "../data/OreNames";

export const MiscContext = createContext();

// ==================== UTILITY FUNCTIONS (DEFINE FIRST) ====================

const initializeCustomValues = (oreData) => {
    return oreData.map(layer => ({
        ...layer,
        layerOres: layer.layerOres.map(ore => ({
            ...ore,
            defaultVal: ore.defaultVal || ore.zenithVal || ore.obtainVal || ore.randomsVal || 0
        }))
    }));
};

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

export const MiscProvider = ({ children }) => {
    // ==================== STATE INITIALIZATION ====================
    const oreValuesFromHook = useOreValues();

    const [oreValsDict, setOreValsDict] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (oreValuesFromHook && oreValuesFromHook.length > 0) {
            const savedDict = localStorage.getItem("oreValsDict");

            if (!savedDict) {
                setOreValsDict(initializeCustomValues(oreValuesFromHook));
            } else {
                try {
                    const savedData = JSON.parse(savedDict);

                    if (Array.isArray(savedData)) {
                        setOreValsDict(mergeOreValues(oreValuesFromHook, savedData));
                    }
                } catch (e) {
                    console.error("Error parsing saved ore values:", e);
                    setOreValsDict(initializeCustomValues(oreValuesFromHook));
                }
            }
            setIsLoading(false);
        }
    }, [oreValuesFromHook]);

    const oreNames = useMemo(() => {
        return getOreNames(oreValsDict);
    }, [oreValsDict]);

    // UI States
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [hotkeysEnabled, setHotkeysEnabled] = useState(() => {
        const savedHotkeys = localStorage.getItem("hotkeysEnabled");
        return savedHotkeys !== null ? JSON.parse(savedHotkeys) : true;
    });

    const [moreStats, setMoreStats] = useState(() => {
        const savedMoreStats = localStorage.getItem("moreStats");
        return savedMoreStats !== null ? JSON.parse(savedMoreStats) : false;
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

    const [previousAmounts, setPreviousAmounts] = useState(() => {
        const savedPreviousData = localStorage.getItem("csvPreviousData");
        return savedPreviousData ? JSON.parse(savedPreviousData) : {};
    });

    const [lastUpdated, setLastUpdated] = useState(() => {
        const savedTime = localStorage.getItem("csvLastUpdated");
        return savedTime ? new Date(savedTime) : null;
    });

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

    const initialDictRef = useRef(oreValuesFromHook);

    // ==================== COMPONENT FUNCTIONS ====================

    const resetCustomValues = (source) => {
        const resetData = {};
        
        Object.keys(oreValsDict).forEach(layerKey => {
            const layer = oreValsDict[layerKey];
            
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

            resetData[layerKey] = { ...layer, layerOres: resetOres };
        });

        setOreValsDict(resetData);
        setValueMode("custom");
        return resetData;
    };

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

    const calculateTotalAV = (data, useHistoricalOreVals = null) => {
        if (!data) return 0;

        let total = 0;
        const oreValuesToUse = useHistoricalOreVals || oreValsDict;

        oreNames.forEach((oreName) => {
            if (oreName.includes("Essence")) return;

            const amount = data[oreName] || 0;
            let baseValue = 1;

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

        setLastUpdated(now);
    };


    const clearCSVData = () => {
        localStorage.removeItem("csvData");
        localStorage.removeItem("csvPreviousData");
        localStorage.removeItem("csvLastUpdated");
        localStorage.removeItem("secondaryCSVData");
        localStorage.removeItem("useSecondaryCSV");

        setCSVData({});
        setPreviousAmounts({});
        setLastUpdated(null);
        setSecondaryCSVData(null);
        setUseSecondaryCSV(false);

        console.log("All CSV data cleared");
    };

    const getOreClassName = (oreName) => {
        return `color-template-${oreName.toLowerCase().replace(/ /g, "-")}`;
    };

    const getCurrentCSV = () => {
        return useSecondaryCSV ? secondaryCSVData : csvData;
    };

    // ==================== EFFECTS ====================

    useEffect(() => {
        if (initialDictRef.current !== oreValuesFromHook) {
            const merged = mergeOreValues(oreValuesFromHook, oreValsDict);
            setOreValsDict(merged);
            initialDictRef.current = oreValuesFromHook;
        }
    }, [oreValuesFromHook]);

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
        settingsOpen,
        setSettingsOpen,
        hotkeysEnabled,
        setHotkeysEnabled,
        moreStats,
        setMoreStats,

        csvData,
        secondaryCSVData,
        setSecondaryCSVData,
        useSecondaryCSV,
        setUseSecondaryCSV,
        getCurrentCSV,
        updateCSVData,
        previousAmounts,
        lastUpdated,
        clearCSVData,

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

        rareFindsData,
        setRareFindsData,
        useSeparateRareMode,
        setUseSeparateRareMode,
        rareValueMode,
        setRareValueMode,
        rareCustomMultiplier,
        setRareCustomMultiplier,

        oreValsDict,
        setOreValsDict,
        oreNames,
        resetCustomValues,

        getOreClassName,
    }), [
            settingsOpen, hotkeysEnabled, moreStats, csvData, secondaryCSVData, useSecondaryCSV,
            previousAmounts, lastUpdated, capCompletion, valueMode,
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
