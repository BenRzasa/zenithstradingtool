import { useCallback, useMemo } from "react";

export const MiscValueFunctions = ({
  csvData,
  currentMode,
  customMultiplier,
  getValueForMode,
  oreValsDict,
  capCompletion,
  valueMode,
  // Add new parameters for rare mode
  useSeparateRareMode = false,
  rareValueMode = 1,
  rareCustomMultiplier = 100,
}) => {
  // Get the correct precision dynamically
  const getPrecision = useCallback((number) => {
    if (typeof number !== "number" || Number.isInteger(number)) return 1;
    const decimalPart = number.toString().split(".")[1];
    return decimalPart ? decimalPart.length : 0;
  }, []);

  // Helper function to check if an ore is rare or true rare
  const isRareOre = useCallback((oreName) => {
    const raresLayer = Object.values(oreValsDict).find(layer =>
      layer.layerName.includes("Rares\nMore")
    );
    const trueRaresLayer = Object.values(oreValsDict).find(layer =>
      layer.layerName.includes("True Rares")
    );

    return (raresLayer?.layerOres.some(ore => ore.name === oreName) ||
            trueRaresLayer?.layerOres.some(ore => ore.name === oreName));
  }, [oreValsDict]);

  // Calculate value using ONLY the normal mode for ALL calculations
  const calculateValue = useCallback(
    (ore) => {
      const baseValue = getValueForMode(ore);

      switch (currentMode) {
        case 1:
          return baseValue; // AV
        case 2:
          return baseValue * 10; // UV
        case 3:
          return baseValue * 100; // NV
        case 4:
          return baseValue * 500; // TV
        case 5:
          return baseValue * 1000; // SV
        case 6:
          return baseValue * 50; // RV
        case 7:
          return baseValue * customMultiplier; // Custom value (AV #)
        default:
          return baseValue; // Default to AV
      }
    },
    [currentMode, customMultiplier, getValueForMode]
  );

  // Calculate value for rare ores using rare mode - FOR DISPLAY ONLY
  const calculateRareDisplayValue = useCallback(
    (ore) => {
      const baseValue = getValueForMode(ore);
      
      if (useSeparateRareMode && isRareOre(ore.name)) {
        // Use rare mode for rare ores when separate rare mode is enabled
        switch (rareValueMode) {
          case 1:
            return baseValue; // AV
          case 2:
            return baseValue * 10; // UV
          case 3:
            return baseValue * 100; // NV
          case 4:
            return baseValue * 500; // TV
          case 5:
            return baseValue * 1000; // SV
          case 6:
            return baseValue * 50; // RV
          case 7:
            return baseValue * rareCustomMultiplier; // Custom value (AV #)
          default:
            return baseValue; // Default to AV
        }
      } else {
        // Use normal mode for non-rare ores or when separate rare mode is disabled
        return calculateValue(ore);
      }
    },
    [
      getValueForMode,
      useSeparateRareMode,
      rareValueMode,
      rareCustomMultiplier,
      isRareOre,
      calculateValue
    ]
  );

  // Calculate value for display purposes only - uses rare mode for rare ores
  const calculateDisplayValue = useCallback(
    (ore) => {
      const baseValue = getValueForMode(ore);

      // Determine which mode and multiplier to use for display
      const isRare = useSeparateRareMode && isRareOre(ore.name);
      const effectiveMode = isRare ? rareValueMode : currentMode;
      const effectiveMultiplier = isRare ? rareCustomMultiplier : customMultiplier;

      switch (effectiveMode) {
        case 1:
          return baseValue; // AV
        case 2:
          return baseValue * 10; // UV
        case 3:
          return baseValue * 100; // NV
        case 4:
          return baseValue * 500; // TV
        case 5:
          return baseValue * 1000; // SV
        case 6:
          return baseValue * 50; // RV
        case 7:
          return baseValue * effectiveMultiplier; // Custom value (AV #)
        default:
          return baseValue; // Default to AV
      }
    },
    [
      currentMode,
      customMultiplier,
      getValueForMode,
      useSeparateRareMode,
      rareValueMode,
      rareCustomMultiplier,
      isRareOre
    ]
  );

  // Calculate base totals - ALWAYS uses normal mode for grand total calculations
  const calculateBaseTotals = useCallback(() => {
    let rareTotal = 0;
    let rareDisplayTotal = 0; // For display purposes only
    let uniqueTotal = 0;
    let layerTotal = 0;
    let grandTotal = 0;
    let totalOres = Object.values(csvData).reduce((acc, val) => acc + val, 0);
    let tableCompletions = [];
    let calculatedOres = [];

    Object.values(oreValsDict).forEach((layer) => {
      const layerName = layer.layerName;
      const layerData = layer.layerOres;

      // Skip essences
      if (layerName.includes("Essences")) return;

      let tableCompletion = 0;
      let itemCount = 0;

      layerData.forEach((ore) => {
        if (calculatedOres.includes(ore.name)) {
          return;
        }

        const inventory = csvData[ore.name] || 0;
        
        // ALWAYS use normal mode for grand total calculations
        const oreValue = calculateValue(ore);
        const perValue = oreValue.toFixed(getPrecision(oreValue));
        const numV = parseFloat((inventory / perValue).toFixed(1));
        const completion = capCompletion
          ? Math.min(1, inventory / oreValue)
          : inventory / oreValue;

        tableCompletion += completion;
        itemCount++;

        if (layerName.includes("True Rares") || layerName.includes("Rares")) {
          rareTotal += numV;
          
          // Calculate display value for rare total (using rare mode if enabled)
          const displayOreValue = calculateRareDisplayValue(ore);
          const displayPerValue = displayOreValue.toFixed(getPrecision(displayOreValue));
          const displayNumV = parseFloat((inventory / displayPerValue).toFixed(1));
          rareDisplayTotal += displayNumV;
        } else if (layerName.includes("Unique")) {
          uniqueTotal += numV;
        } else {
          layerTotal += numV;
        }
        grandTotal += numV;

        calculatedOres.push(ore.name);
      });

      const tableAvgCompletion =
        itemCount > 0 ? tableCompletion / itemCount : 0;
      tableCompletions.push(
        capCompletion ? Math.min(1, tableAvgCompletion) : tableAvgCompletion
      );
    });

    const avgCompletion =
      tableCompletions.length > 0
        ? (tableCompletions.reduce((sum, comp) => sum + comp, 0) /
            tableCompletions.length) *
          100
        : 0;

    return {
      rareTotal: useSeparateRareMode ? rareDisplayTotal : rareTotal, // Use display total when rare mode enabled
      rareBaseTotal: rareTotal, // Always the normal mode calculation
      uniqueTotal,
      layerTotal,
      grandTotal,
      avgCompletion: capCompletion
        ? Math.min(100, avgCompletion)
        : avgCompletion,
      totalOres,
      tableCompletions,
    };
  }, [
    csvData,
    oreValsDict,
    calculateValue, // ALWAYS uses normal mode for calculations
    calculateRareDisplayValue, // For rare display total only
    capCompletion,
    getPrecision,
    useSeparateRareMode
  ]);

  // Calculate min/max info (with exclusions) - ALWAYS uses normal mode
  const calculateExtremes = useCallback(() => {
    const excludedOres = ["Stone", "Grimstone"];
    const excludedLayers = [
      "True Rares\n1/33,333 or Rarer",
      "Rares\nMore Common Than 1/33,333",
      "Uniques\nNon-Standard Obtainment",
      "Compounds\nCrafted via Synthesis",
      "Surface / Shallow\n[0m-74m]",
      "Essences\nObtained from Wisps",
    ];

    let minLayer = { value: Infinity, name: "", ore: "" };
    let maxLayer = { value: -Infinity, name: "", ore: "" };
    let minOre = { value: Infinity, name: "", layer: "" };
    let maxOre = { value: -Infinity, name: "", layer: "" };
    const layerValues = {};
    let validOresFound = false;
    let validLayersFound = false;

    Object.values(oreValsDict).forEach((layer) => {
      const layerName = layer.layerName;
      const layerData = layer.layerOres;

      // Check if layer should be excluded (exact match)
      if (excludedLayers.includes(layerName)) {
        return;
      }

      let layerSum = 0;
      let layerHasValidOres = false;

      layerData.forEach((ore) => {
        // Check if ore should be excluded (exact match)
        if (excludedOres.includes(ore.name) || ore.name.includes("Essence")) return;

        const inventory = csvData[ore.name] || 0;
        const oreValue = calculateValue(ore); // ALWAYS uses normal mode
        const numV = parseFloat((inventory / oreValue).toFixed(3));

        validOresFound = true;
        layerHasValidOres = true;

        if (numV < minOre.value) {
          minOre = { value: numV, name: ore.name, layer: layerName };
        }
        if (numV > maxOre.value) {
          maxOre = { value: numV, name: ore.name, layer: layerName };
        }
        layerSum += numV;
      });

      if (layerHasValidOres) {
        validLayersFound = true;
        layerValues[layerName] = layerSum;
        if (layerSum < minLayer.value) {
          minLayer = { value: layerSum, name: layerName };
        }
        if (layerSum > maxLayer.value) {
          maxLayer = { value: layerSum, name: layerName };
        }
      }
    });

    // Handle cases where no valid data was found
    const handleDefault = (obj, isValid) =>
      !isValid ? { ...obj, value: 0, name: "N/A" } : obj;

    return {
      minLayer: handleDefault(minLayer, validLayersFound),
      maxLayer: handleDefault(maxLayer, validLayersFound),
      minOre: handleDefault(minOre, validOresFound),
      maxOre: handleDefault(maxOre, validOresFound),
      layerValues,
    };
  }, [
    csvData,
    oreValsDict,
    calculateValue // ALWAYS uses normal mode
  ]);

  const calculateIncompleteOres = useCallback(() => {
    const incompleteOres = [];

    Object.values(oreValsDict).forEach((layer) => {
      const layerName = layer.layerName;
      const layerData = layer.layerOres;

      if (layerName.includes("Essences")) return;

      layerData.forEach((ore) => {
        const inventory = csvData[ore.name] || 0;
        const orePerUnit = calculateValue(ore); // ALWAYS uses normal mode

        const completionRatio =
          orePerUnit > 0
            ? capCompletion
              ? Math.min(1, inventory / orePerUnit)
              : inventory / orePerUnit
            : 0;

        const completionPercentage = completionRatio * 100;

        if (completionPercentage < 100) {
          // Determine which mode would be used for display
          const isRare = useSeparateRareMode && isRareOre(ore.name);
          const effectiveDisplayMode = isRare ? rareValueMode : currentMode;

          incompleteOres.push({
            name: ore.name,
            layer: layerName,
            completion: parseFloat(completionPercentage.toFixed(2)),
            remaining: Math.max(0, orePerUnit - inventory),
            valueMode: valueMode,
            inventory: inventory,
            required: orePerUnit,
            numV: orePerUnit > 0 ? (inventory / orePerUnit).toFixed(2) : "0",
            completionRatio: completionRatio,
            isRare: isRare,
            effectiveDisplayMode: effectiveDisplayMode,
          });
        }
      });
    });

    // Sort by completion percentage (highest to lowest)
    return incompleteOres.sort((a, b) => b.completion - a.completion);
  }, [
    csvData,
    oreValsDict,
    calculateValue, // ALWAYS uses normal mode
    valueMode,
    capCompletion,
    useSeparateRareMode,
    isRareOre,
    rareValueMode,
    currentMode
  ]);

  // Get mode strings for display
  const getModeStrings = useCallback(() => {
    const isNV = customMultiplier % 100 === 0;
    const isRareNV = rareCustomMultiplier % 100 === 0;
    const isSV = customMultiplier % 1000 === 0;
    const isRareSV = rareCustomMultiplier % 1000 === 0;

    const mainModeStr =
      currentMode === 1
        ? "AV"
        : currentMode === 2
        ? "UV"
        : currentMode === 3
        ? "NV"
        : currentMode === 4
        ? "TV"
        : currentMode === 5
        ? "SV"
        : currentMode === 6
        ? "RV"
        : !(isNV && isSV) && currentMode === 7
        ? "CV"
        : isNV && currentMode === 7
        ? `${customMultiplier / 100} NV`
        : isSV && currentMode === 7
        ? `${customMultiplier / 1000} NV`
        : "BAD";

    const rareModeStr =
      rareValueMode === 1
        ? "AV"
        : rareValueMode === 2
        ? "UV"
        : rareValueMode === 3
        ? "NV"
        : rareValueMode === 4
        ? "TV"
        : rareValueMode === 5
        ? "SV"
        : rareValueMode === 6
        ? "RV"
        : !(isRareNV && isRareSV) && rareValueMode === 7
        ? "CV"
        : isRareNV && rareValueMode === 7
        ? `${rareCustomMultiplier / 100} NV`
        : isRareSV && rareValueMode === 7
        ? `${rareCustomMultiplier / 1000} SV`
        : "BAD";

    return {
      mainModeStr,
      rareModeStr,
      usingSeparateRareMode: useSeparateRareMode,
    };
  }, [
    currentMode,
    customMultiplier,
    rareValueMode,
    rareCustomMultiplier,
    useSeparateRareMode
  ]);

  // Calculate all values and memoize them
  const allValues = useMemo(() => {
    const baseTotals = calculateBaseTotals();
    const extremes = calculateExtremes();
    const incompleteOres = calculateIncompleteOres();
    const modeStrings = getModeStrings();

    return {
      // Base totals (calculated with appropriate modes)
      rareTotal: baseTotals.rareTotal, // Uses rare mode for display when enabled
      rareBaseTotal: baseTotals.rareBaseTotal, // Always uses normal mode
      uniqueTotal: baseTotals.uniqueTotal,
      layerTotal: baseTotals.layerTotal,
      grandTotal: baseTotals.grandTotal, // ALWAYS uses normal mode
      avgCompletion: baseTotals.avgCompletion,
      totalOres: baseTotals.totalOres,
      tableCompletions: baseTotals.tableCompletions,

      minLayer: extremes.minLayer,
      maxLayer: extremes.maxLayer,
      minOre: extremes.minOre,
      maxOre: extremes.maxOre,
      layerValues: extremes.layerValues,

      incompleteOres,

      modeStrings,

      calculateValue, // Normal mode only
      calculateRareDisplayValue, // Rare mode for display only
      calculateDisplayValue, // For display purposes
      getPrecision,
      isRareOre,
    };
  }, [
    calculateBaseTotals,
    calculateExtremes,
    calculateValue,
    calculateRareDisplayValue,
    calculateDisplayValue,
    getPrecision,
    calculateIncompleteOres,
    getModeStrings,
    isRareOre,
  ]);

  return allValues;
};