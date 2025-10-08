import React, { useContext, useState } from "react";

import { MiscValueFunctions } from "./MiscValueFunctions";
import { MiscContext } from "../context/MiscContext";
import {
  nanPlaceholderOres,
  zenithPlaceholderOres,
} from "../data/PlaceholderOres";

import { OreIcons } from "../data/OreIcons";
import missingIcon from "../images/ore-icons/Missing_Texture.webp";

import "../styles/AllGradients.css";
import "../styles/ValueChart.css";
import "../styles/LayerTable.css";

const LayerTable = ({
  data,
  title,
  currentMode,
  customMultiplier,
  gradient,
  searchFilters,
}) => {
  const {
    getCurrentCSV,
    getOreClassName,
    updateCSVData,
    valueMode,
    getValueForMode,
    capCompletion,
    oreValsDict,
    useSeparateRareMode,
    rareValueMode,
    rareCustomMultiplier,
  } = useContext(MiscContext);

  const csvData = getCurrentCSV();

  const [copiedFilter, setCopiedFilter] = useState(null);

  const allValues = MiscValueFunctions({
    csvData: csvData,
    currentMode,
    customMultiplier,
    getValueForMode,
    oreValsDict,
    capCompletion,
    valueMode,
    useSeparateRareMode,
    rareValueMode,
    rareCustomMultiplier,
  });

  const {
    modeStrings,
  } = allValues;

  // null check for oreValsDict
  if (!oreValsDict) {
    return (
      <div className="table-wrapper">
        <h2>{title}</h2>
        <p>Loading data...</p>
      </div>
    );
  }

  // Determine if this table shows rares
  const isRaresTable = title.includes("Rares\nMore") || title.includes("True Rares");

  // Use rare mode if enabled and this is a rares table
  const effectiveMode = useSeparateRareMode && isRaresTable ? rareValueMode : currentMode;

  // Function to calculate the value based on the effective mode
  const calculateValue = (ore) => {
    const baseValue = getValueForMode(ore);
    const mode = useSeparateRareMode && isRaresTable ? rareValueMode : currentMode;
    const multiplier = useSeparateRareMode && isRaresTable ? rareCustomMultiplier : customMultiplier;

    switch (mode) {
      case 1:
        return baseValue * 1; // AV
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
        return baseValue * multiplier; // Custom
      default:
        return baseValue;
    }
  };

  // Function to calculate the percentage with bounds
  const calculatePercentage = (ore, inventory) => {
    const orePerUnit = calculateValue(ore);
    return orePerUnit > 0
      ? capCompletion
        ? Math.min(100, (inventory / orePerUnit) * 100).toFixed(2)
        : ((inventory / orePerUnit) * 100).toFixed(2)
      : 0;
  };

  const formatValue = (value, mode = effectiveMode) => {
    const num = Number(value);
    if (!Number.isFinite(num)) return 0;

    // For /AV (mode 1) - return raw number exactly as provided
    if (mode === 1) return num;

    // Calculate scaled value
    const scaleFactor =
      mode === 2
        ? 10 // UV
        : mode === 3
        ? 100 // NV
        : mode === 4
        ? 500 // TV
        : mode === 5
        ? 1000 // SV
        : mode === 6
        ? 50 // RV
        : mode === 7
        ? (useSeparateRareMode && isRaresTable ? rareCustomMultiplier : customMultiplier) // Custom
        : 1; // Default to 1

    const scaledValue = num * scaleFactor;

    // Strict truncation function (no rounding)
    const truncate = (n, decimals) => {
      const factor = 10 ** decimals;
      return Math.trunc(n * factor) / factor;
    };

    // Return the numeric value based on mode
    switch (effectiveMode) {
      case 1:
        return truncate(scaledValue, 3);
      case 2:
        return truncate(scaledValue, 2);
      case 3:
        return truncate(scaledValue, 2);
      case 6:
        return truncate(scaledValue, 2);
      case 7:
        return truncate(scaledValue, 3);
      default:
        return Math.round(truncate(scaledValue, 3));
    }
  };

  const formatDisplayValue = (value, mode) => {
    if (value === "N/A" || title.includes("Essence")) return "N/A";
    const num = formatValue(value, mode);

    // Format with suffix for display purposes (M or K)
    if (Math.abs(num) >= 1000000) {
      return (num / 1000000).toFixed(3).replace(/\.?0+$/, "") + "M";
    }
    if (Math.abs(num) >= 1000) {
      return (num / 1000).toFixed(3).replace(/\.?0+$/, "") + "K";
    }
    return num.toFixed(3).replace(/\.?0+$/, "");
  };

  // Calculate completion percentage
  const getAverageCompletion = () => {
    const totalCompletion = data.reduce((sum, item) => {
      const inventory = csvData[item.name] || 0;
      const orePerUnit = calculateValue(item);
      const completion =
        orePerUnit > 0
          ? capCompletion
            ? Math.min(1, inventory / orePerUnit)
            : inventory / orePerUnit
          : 0;
      return sum + completion;
    }, 0);
    return ((totalCompletion / data.length) * 100).toFixed(2);
  };

  // Calculate total values
  const getTotalValue = () => {
    const total = data.reduce((sum, item) => {
      const inventory = csvData[item.name] || 0;
      const orePerUnit = calculateValue(item);
      return orePerUnit > 0 ? sum + inventory / orePerUnit : sum;
    }, 0);

    return `${parseFloat(total.toFixed(1))} ${modeStrings.mainModeStr}`;
  };

  // Find highest value ore
  const getHighestValue = () => {
    const highestItem = data.reduce(
      (max, item) => {
        const inventory = csvData[item.name] || 0;
        const orePerUnit = calculateValue(item);
        const numV = orePerUnit > 0 ? inventory / orePerUnit : 0;
        return numV > max.value ? { name: item.name, value: numV } : max;
      },
      { name: "", value: 0 }
    );

    return `${highestItem.name} (${highestItem.value.toFixed(2)} ${modeStrings.mainModeStr})`;
  };

  // Handle inventory changes
  const handleInventoryChange = (itemName, newValue) => {
    const numericValue = Math.max(0, isNaN(newValue) ? 0 : Number(newValue));
    updateCSVData((prev) => ({
      ...prev,
      [itemName]: numericValue,
    }));
  };

  const findMatchingFilter = (layerName) => {
    return searchFilters.find((filter) => {
      const filterName = filter.split(":")[0]?.trim();
      return filterName && layerName.includes(filterName);
    });
  };

  const copyLayerFilter = () => {
    const matchingFilter = findMatchingFilter(title);
    if (matchingFilter) {
      const filterItems = matchingFilter.split(": ")[1];
      navigator.clipboard.writeText(filterItems.trim()).then(() => {
        setCopiedFilter(filterItems);
        setTimeout(() => setCopiedFilter(null), 2000);
      });
    }
  };

  function isPlaceholderOre(itemName) {
    switch (valueMode) {
      case "nan":
        return nanPlaceholderOres.includes(itemName);
      case "zenith":
        return zenithPlaceholderOres.includes(itemName);
      default:
        return false;
    }
  }

  if (!data) {
    return (
      <div className="table-wrapper">
        <h2>{title}</h2>
        <p>No data available.</p>
      </div>
    );
  }

  return (
    <div
      className="table-wrapper"
      style={{
        width: title.includes("Essences") ? "430px" : undefined,
        marginRight: title.includes("Essences") ? "195px" : undefined,
      }}
    >
      <pre>
        <h2
          className="table-wrapper h2"
          style={{ background: gradient }}
          data-text={title}
        >
          {title}
          {getAverageCompletion() === "100.00" &&
            !title.includes("Essences") && (
              <span className="nv-comp-check">{useSeparateRareMode ? "✦" : "✔"}</span>
            )}
        </h2>
      </pre>
      <table className="table-comp">
        <thead>
          <tr>
            <th>Ore Name</th>
            {!title.includes("Essences") && <th>{isRaresTable ? modeStrings.rareModeStr : modeStrings.mainModeStr}%</th>}

            <th>&nbsp;&nbsp;#&nbsp;&nbsp;</th>

            {!title.includes("Essences") && (
              <>
                <th>{isRaresTable ? modeStrings.rareModeStr : modeStrings.mainModeStr}s</th>
                {!title.includes("Rares") && !title.includes("True Rares") && (
                  <th>1 AV</th>
                )}
                {(title.includes("Rares") || title.includes("True Rares")) && (
                  <th>AV</th>
                )}
                <th>{
                  effectiveMode === 7 ? `${isRaresTable ? modeStrings.rareModeStr : modeStrings.mainModeStr}`
                  : `1 ${isRaresTable ? modeStrings.rareModeStr : modeStrings.mainModeStr}`}</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            const isEssences = title.includes("Essences");
            const isRares = title.includes("Rares\nMore");
            const isTrueRares = title.includes("True Rares");
            const inventory = csvData[item.name] || 0;
            const baseValue = getValueForMode(item);
            const percentage = calculatePercentage(item, inventory);
            const unroundedNumV = inventory / calculateValue(item);
            const roundedNumV =
              effectiveMode === 1
                ? unroundedNumV.toFixed(0)
                : effectiveMode === 2
                ? unroundedNumV.toFixed(1)
                : effectiveMode === 3
                ? unroundedNumV.toFixed(2)
                : effectiveMode === 4
                ? unroundedNumV.toFixed(3)
                : effectiveMode === 5
                ? unroundedNumV.toFixed(3)
                : effectiveMode === 6
                ? unroundedNumV.toFixed(2)
                : effectiveMode === 7
                ? unroundedNumV.toFixed(2)
                : "0";

            return (
              <tr key={index}>
                <td
                  className={`name-column ${getOreClassName(item.name)}`}
                  data-text={item.name}
                >
                  {OreIcons[item.name.replace(/ /g, "_")] ? (
                    <img
                      src={OreIcons[item.name.replace(/ /g, "_")]}
                      alt={`${item.name} icon`}
                      className="ore-icon"
                      onError={(e) => {
                        console.error(`Missing icon for: ${item.name}`);
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    <span>
                      <img
                        src={missingIcon}
                        alt={"Missing icon"}
                        className="ore-icon"
                      ></img>
                    </span>
                  )}
                  {item.name}
                </td>
                {/* Percentage column */}
                {!isEssences && (
                  <td
                    className={
                      percentage <= 100.0
                        ? `percent-${Math.floor(percentage / 10) * 10}`
                        : "percent-over100"
                    }
                  >
                    {percentage}%
                  </td>
                )}
                {/* Inventory column - editable */}
                <td className="v-inventory-cell">
                  <div className="inventory-wrapper">
                    <span className="value-display" aria-hidden="true">
                      {inventory.toLocaleString()}
                    </span>
                    <input
                      id={`inventory-${item.name.replace(/\W+/g, "-")}`}
                      name={`inventory-${index}`}
                      type="text"
                      min="0"
                      step="1"
                      value={inventory}
                      aria-label={`Edit ${item.name} quantity`}
                      className="v-inventory-input"
                      onChange={(e) => {
                        if (e.target.value === "") return;
                        const numericValue = Math.max(
                          0,
                          parseInt(e.target.value) || 0
                        );
                        handleInventoryChange(item.name, numericValue);
                      }}
                      onFocus={(e) => {
                        e.target.select();
                        e.target.dataset.prevValue = e.target.value;
                      }}
                      onBlur={(e) => {
                        const newValue =
                          e.target.value === ""
                            ? 0
                            : Math.max(0, parseInt(e.target.value) || 0);
                        if (
                          newValue !== parseInt(e.target.dataset.prevValue || 0)
                        ) {
                          handleInventoryChange(item.name, newValue);
                        }
                        if (e.target.value === "") e.target.value = "0";
                      }}
                      onKeyDown={(e) => {
                        if (["Backspace", "Delete"].includes(e.key)) {
                          if (e.target.value.length === 1) {
                            e.target.value = "";
                          }
                        }
                        if (e.key === "Enter") e.target.blur();
                      }}
                    />
                  </div>
                </td>
                {!isEssences && (
                  <>
                    <td>{roundedNumV}</td>
                    {!(isRares || isTrueRares) && (
                      <td>
                        {formatDisplayValue(baseValue, 1)}
                        {isPlaceholderOre(item.name) ? " [P]" : ""}
                      </td>
                    )}
                    {isTrueRares && <td>{1 / baseValue}</td>}
                    {isRares && <td>{(1 / baseValue).toFixed(2)}</td>}
                    <td>{formatDisplayValue(baseValue, effectiveMode)}</td>
                  </>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="table-footer">
        <ul className="info-list">
          <li>
            ⛏ {isRaresTable ? modeStrings.rareModeStr : modeStrings.mainModeStr} Completion:{" "}
            <span className="placeholder">
              {title.includes("Essence") ? "N/A" : `${getAverageCompletion()}%`}
            </span>
          </li>
          <li>
            ⛏ Total {isRaresTable ? modeStrings.rareModeStr : modeStrings.mainModeStr}:{" "}
            <span className="placeholder">
              {title.includes("Essence") ? "N/A" : getTotalValue()}
            </span>
          </li>
          <li>
            ⛏ Highest {isRaresTable ? modeStrings.rareModeStr : modeStrings.mainModeStr}:{" "}
            <span className="placeholder">
              {title.includes("Essence") ? "N/A" : getHighestValue()}
            </span>
          </li>
        </ul>
        <div className="copy-filter-container">
          <button
            className="copy-filter-btn"
            onClick={copyLayerFilter}
            title="Copy search filter for this layer"
          >
            Copy Search Filter
          </button>
          {copiedFilter && (
            <div className="copy-confirmation">✓ Copied to clipboard!</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LayerTable;