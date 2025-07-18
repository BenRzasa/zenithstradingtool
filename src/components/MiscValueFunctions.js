import { useCallback, useMemo } from "react";

export const MiscValueFunctions = ({
  csvData,
  currentMode,
  customMultiplier,
  getValueForMode,
  oreValsDict,
  capCompletion,
}) => {
  // Get the correct precision dynamically
  const getPrecision = useCallback((number) => {
    if (typeof number !== "number" || Number.isInteger(number)) return 1;
    const decimalPart = number.toString().split(".")[1];
    return decimalPart ? decimalPart.length : 0;
  }, []);

  const calculateValue = useCallback((ore) => {
    const baseValue = getValueForMode(ore);

    switch (currentMode) {
      case 1: return baseValue; // AV
      case 2: return baseValue * 10; // UV
      case 3: return baseValue * 100; // NV
      case 4: return baseValue * 500; // TV
      case 5: return baseValue * 1000; // SV
      case 6: return baseValue * 50; // RV
      case 7: return baseValue * customMultiplier; // Custom value (AV #)
      default: return baseValue; // Default to AV
    }
  }, [currentMode, customMultiplier, getValueForMode]);

  // Calculate base totals (without exclusions)
  const calculateBaseTotals = useCallback(() => {
    let rareTotal = 0;
    let uniqueTotal = 0;
    let layerTotal = 0;
    let grandTotal = 0;
    let totalOres = Object.values(csvData).reduce((acc, val) => acc + val, 0);
    let tableCompletions = [];
    let calculatedOres = [];

    Object.entries(oreValsDict).forEach(([layerName, layerData]) => {
      let tableCompletion = 0;
      let itemCount = 0;

      layerData.forEach((ore) => {
        if (calculatedOres.includes(ore.name)) {
          return;
        }

        const inventory = csvData[ore.name] || 0;
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
      tableCompletions.push(capCompletion ? Math.min(1, tableAvgCompletion) : tableAvgCompletion);
    });

    const avgCompletion =
      tableCompletions.length > 0
        ? (tableCompletions.reduce((sum, comp) => sum + comp, 0) /
            tableCompletions.length) *
          100
        : 0;

    return {
      rareTotal,
      uniqueTotal,
      layerTotal,
      grandTotal,
      avgCompletion: capCompletion ? Math.min(100, avgCompletion).toFixed(3) : avgCompletion.toFixed(3),
      totalOres,
      tableCompletions,
    };
  }, [csvData, oreValsDict, calculateValue, capCompletion, getPrecision]);

  // Calculate min/max info (with exclusions)
  const calculateExtremes = useCallback(() => {
    const excludedOres = ["Stone", "Grimstone"];
    const excludedLayers = [
      "True Rares\n1/33,333 or Rarer",
      "Rares\nMore Common Than 1/33,333",
      "Uniques\nNon-Standard Obtainment",
      "Compounds\nCrafted via Synthesis",
      "Surface / Shallow\n[0m-74m]"
    ];

    let minLayer = { value: Infinity, name: "", ore: "" };
    let maxLayer = { value: -Infinity, name: "", ore: "" };
    let minOre = { value: Infinity, name: "", layer: "" };
    let maxOre = { value: -Infinity, name: "", layer: "" };
    const layerValues = {};

    Object.entries(oreValsDict).forEach(([layerName, layerData]) => {
      if (excludedLayers.includes(layerName)) return;

      let layerSum = 0;
      layerData.forEach((ore) => {
        if (excludedOres.includes(ore.name)) return;
        const inventory = csvData[ore.name] || 0;
        const oreValue = calculateValue(ore);
        const numV = parseFloat((inventory / oreValue).toFixed(1));

        if (numV < minOre.value) {
          minOre = { value: numV, name: ore.name, layer: layerName };
        }
        if (numV > maxOre.value) {
          maxOre = { value: numV, name: ore.name, layer: layerName };
        }
        layerSum += numV;
      });

      layerValues[layerName] = layerSum;
      if (layerSum < minLayer.value) {
        minLayer = { value: layerSum, name: layerName };
      }
      if (layerSum > maxLayer.value) {
        maxLayer = { value: layerSum, name: layerName };
      }
    });

    const handleDefault = (obj) =>
      obj.value === Infinity || obj.value === -Infinity
        ? { ...obj, value: 0, name: "N/A" }
        : obj;

    return {
      minLayer: handleDefault(minLayer),
      maxLayer: handleDefault(maxLayer),
      minOre: handleDefault(minOre),
      maxOre: handleDefault(maxOre),
      layerValues,
    };
  }, [csvData, oreValsDict, calculateValue]);

  // Calculate all values and memoize them
  const allValues = useMemo(() => {
    const baseTotals = calculateBaseTotals();
    const extremes = calculateExtremes();

    return {
      // Base totals
      rareTotal: baseTotals.rareTotal,
      uniqueTotal: baseTotals.uniqueTotal,
      layerTotal: baseTotals.layerTotal,
      grandTotal: baseTotals.grandTotal,
      avgCompletion: baseTotals.avgCompletion,
      totalOres: baseTotals.totalOres,
      tableCompletions: baseTotals.tableCompletions,

      // Extremes
      minLayer: extremes.minLayer,
      maxLayer: extremes.maxLayer,
      minOre: extremes.minOre,
      maxOre: extremes.maxOre,
      layerValues: extremes.layerValues,

      // Other useful values
      excluded: {
        ores: ["Stone", "Grimstone"],
        layers: [
          "True Rares\n1/33,333 or Rarer",
          "Rares\nMore Common Than 1/33,333",
          "Uniques\nNon-Standard Obtainment",
          "Compounds\nCrafted via Synthesis",
          "Surface / Shallow\n[0m-74m]"
        ],
      },

      // Helper functions
      calculateValue,
      getPrecision,
    };
  }, [calculateBaseTotals, calculateExtremes, calculateValue, getPrecision]);

  return allValues;
};