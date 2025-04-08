/* ZTT | Table component - adapts for any layer information
  - Modular table component that works with any dictionary of values
  given the layer name, ore names, and a base value. And the gradient!
*/

import React, { useContext, useState } from "react";
import { CSVContext } from "../context/CSVContext";

import { oreIcons } from "../lib/oreIcons";

import "../styles/AllGradients.css";
import "../styles/ValueChart.css";
import "../styles/LayerTable.css";

const TableComponent = ({
  // Table's data fields/components
  data,
  title,
  currentMode,
  gradient,
  searchFilters,
}) => {
  const { csvData, setCSVData } = useContext(CSVContext);

  // Pick the string based on the value mode
  const modeStr =
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
      : "BAD";

  // Function to calculate the value based on the current mode
  const calculateValue = (baseValue) => {
    switch (currentMode) {
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
      default:
        return baseValue;
    }
  };

  // Function to calculate the percentage with bounds
  const calculatePercentage = (baseValue, inventory) => {
    const orePerUnit = calculateValue(baseValue);
    return orePerUnit > 0 ? Math.min(100, (inventory / orePerUnit) * 100) : 0;
  };

  // Preserve original precision exactly as in baseValue
  // Now, add a K at the end, truncating all leading zeroes,
  // if the number is above 1000. Also, remove trailing zeroes
  // if the number is, say, "2.000"
  const formatValue = (value, mode = 3) => {
    const num = Number(value);
    if (!Number.isFinite(num)) return "0";
    // For /AV (mode 1) - return raw number exactly as provided
    if (mode === 1) return num.toString();
    // Calculate scaled value
    const scaleFactor =
      mode === 2
        ? 10
        : mode === 3
        ? 100
        : mode === 4
        ? 500
        : mode === 5
        ? 1000
        : mode === 6
        ? 50
        : 1;
    const scaledValue = num * scaleFactor;
    // Strict truncation function (no rounding)
    const truncate = (n, decimals) => {
      const factor = 10 ** decimals;
      return Math.trunc(n * factor) / factor;
    };
    // Format with suffix
    const formatWithSuffix = (val, suffix) => {
      const truncated = truncate(val, 3);
      let str = truncated.toString();
      // Remove trailing .000 if present
      if (str.includes(".")) {
        str = str.replace(/\.?0+$/, "");
      }
      return str + suffix;
    };
    // Millions
    if (Math.abs(scaledValue) >= 1000000) {
      const divided = scaledValue / 1000000;
      return formatWithSuffix(divided, "M");
    }
    // Thousands
    if (Math.abs(scaledValue) >= 1000) {
      const divided = scaledValue / 1000;
      return formatWithSuffix(divided, "K");
    }
    // Regular numbers
    const truncated = truncate(scaledValue, 3);
    let str = truncated.toString();
    if (str.includes(".")) {
      str = str.replace(/\.?0+$/, "");
    }
    return str;
  };

  // Calculate completion percentage
  const getAverageCompletion = () => {
    const totalCompletion = data.reduce((sum, item) => {
      const inventory = csvData[item.name] || 0;
      const orePerUnit = calculateValue(item.baseValue);
      const completion =
        orePerUnit > 0 ? Math.min(1, inventory / orePerUnit) : 0;
      return sum + completion;
    }, 0);
    // Divide the total percentage by number of ores in the table and fix to .1
    return ((totalCompletion / data.length) * 100).toFixed(1);
  };

  // Calculate total NVs/UVs/TVs/SVs
  const getTotalValue = () => {
    const total = data.reduce((sum, item) => {
      const inventory = csvData[item.name] || 0;
      const orePerUnit = calculateValue(item.baseValue);
      return orePerUnit > 0 ? sum + inventory / orePerUnit : sum;
    }, 0);
    // Format string with the parsed total NV value, and mode string
    return `${parseFloat(total.toFixed(1))} ${modeStr}`;
  };

  // Find highest value ore
  const getHighestValue = () => {
    const highestItem = data.reduce(
      (max, item) => {
        const inventory = csvData[item.name] || 0;
        const orePerUnit = calculateValue(item.baseValue);
        const numV = orePerUnit > 0 ? inventory / orePerUnit : 0;
        // Gets the max number of NV/SV/etc value from the ores and returns it
        return numV > max.value ? { name: item.name, value: numV } : max;
      },
      { name: "", value: 0 }
    );
    // Format the max value ore with one decimal and the mode string after
    return `${highestItem.name} (${highestItem.value.toFixed(1)} ${modeStr})`;
  };

  // Handle inventory changes
  const handleInventoryChange = (itemName, newValue) => {
    // Account for non-number values
    const numericValue = Math.max(0, isNaN(newValue) ? 0 : Number(newValue));
    // Update through context which will automatically persist to localStorage
    setCSVData((prev) => ({
      ...prev,
      [itemName]: numericValue,
    }));
  };

  // Track the current copied search filter
  const [copiedFilter, setCopiedFilter] = useState(null);

  const findMatchingFilter = (layerName) => {
    return searchFilters.find((filter) => {
      // Remove arrow and compare with layer name
      const filterName = filter.split("➜ ")[1]?.split(":")[0]?.trim();
      return filterName && layerName.includes(filterName);
    });
  };

  // Copy the layer filter to the clipboard, clearing after 2s
  const copyLayerFilter = () => {
    const matchingFilter = findMatchingFilter(title);
    if (matchingFilter) {
      // If the filter exists, split it from the title and copy it to the clipboard
      const filterItems = matchingFilter.split(": ")[1];
      navigator.clipboard.writeText(filterItems.trim()).then(() => {
        setCopiedFilter(filterItems);
        // Clear the filter after 2 seconds
        setTimeout(() => setCopiedFilter(null), 2000);
      });
    }
  };

  // Default component to return in case the data bugs out
  if (!data) {
    return (
      <div className="table-wrapper">
        <h2>{title}</h2>
        <p>No data available.</p>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <h2
        className="table-wrapper h2"
        style={{ background: gradient }}
        data-text={title}
      >
        {title}
      </h2>
      <table className="table-comp">
        <thead>
          <tr>
            <th>Ore Name</th>
            <th>{modeStr}%</th>
            <th>[ # ]</th>
            <th>{modeStr}s</th>
            <th>/AV</th>
            <th>/{modeStr}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            /* Components mapped per ore:
              - Ore Icon (NEEDED) from Icons map/file (Match name exactly)
              - Ore Name from CSV data
              - Ore gradient - matches pattern in ore name to ore color-template in AllGradients
              - Amount of ore in inventory
              - Percent completion of 1 AV/NV/UV/etc.
              - Number of the value mode (AV/UV/NV/TV/SV)
              - The base value (Per AV) of that ore
              - Expanded value (UV/NV/TV/SV)

              - Also allows user to edit the quantity in real time, updating the
              CSV data as they do so
            */
            const inventory = csvData[item.name] || 0;
            const baseValue = item.baseValue;
            const percentage = calculatePercentage(baseValue, inventory);
            const numV =
              calculateValue(baseValue) > 0
                ? (inventory / calculateValue(baseValue)).toFixed(2) // Round to 2 decimals here
                : "0";

            return (
              <tr key={index}>
                {/* Get the gradient dynamically for each ore name */}
                <td className={`name-column ${item.className || ""}`} data-text={item.name}>
                  {oreIcons[item.name.replace(/ /g, '_')] ? (
                    <img
                      src={oreIcons[item.name.replace(/ /g, '_')]}
                      alt={`${item.name} icon`}
                      className="ore-icon"
                      loading="lazy"
                      onError={(e) => {
                        console.error(`Missing icon for: ${item.name}`);
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <span>🖼️</span>
                  )}
                  {item.name}
                </td>
                <td className={`percent-${Math.floor(percentage / 20) * 20}`}>
                  {percentage.toFixed(1)}%
                </td>
                <td className="inventory-cell">
                  {/* Wrapper div ensures stable layout during edits */}
                  <div className="inventory-wrapper">
                    {/* Visible display of the value (hidden during editing) */}
                    {/* Uses aria-hidden because screen readers should focus on the input */}
                    <span className="value-display" aria-hidden="true">
                      {inventory.toLocaleString()}
                    </span>
                    {/* Actual editable input - absolutely positioned over the display */}
                    <input
                      id={`inventory-${item.name.replace(/\W+/g, "-")}`}
                      name={`inventory-${index}`} // Name for form handling
                      type="number"
                      min="0" // Prevent negative numbers
                      step="1" // Whole numbers only
                      value={inventory} // Controlled component
                      aria-label={`Edit ${item.name} quantity`}
                      className="inventory-input"
                      /* Handle live changes while typing */
                      onChange={(e) => {
                        // Allow empty value during editing (shows placeholder)
                        if (e.target.value === "") return;
                        // Convert to number and ensure it's not negative
                        const numericValue = Math.max(
                          0,
                          parseInt(e.target.value) || 0
                        );
                        handleInventoryChange(item.name, numericValue);
                      }}
                      /* Select all text when focused for easy editing */
                      onFocus={(e) => {
                        e.target.select(); // Highlight current value
                        e.target.dataset.prevValue = e.target.value; // Store for comparison
                      }}
                      /* Finalize changes when leaving the field */
                      onBlur={(e) => {
                        const newValue =
                          e.target.value === ""
                            ? 0 // Treat empty as zero
                            : Math.max(0, parseInt(e.target.value) || 0); // Ensure valid number
                        // Only update if value actually changed
                        if (
                          newValue !== parseInt(e.target.dataset.prevValue || 0)
                        ) {
                          handleInventoryChange(item.name, newValue);
                        }
                        // Ensure field always shows a value (even if cleared during edit)
                        if (e.target.value === "") e.target.value = "0";
                      }}
                      /* Special key handling */
                      onKeyDown={(e) => {
                        // Allow complete clearing with backspace/delete
                        if (["Backspace", "Delete"].includes(e.key)) {
                          if (e.target.value.length === 1) {
                            e.target.value = ""; // Clear completely when last character removed
                          }
                        }
                        // Submit on Enter key
                        if (e.key === "Enter") e.target.blur();
                      }}
                    />
                  </div>
                </td>
                <td>{numV}</td>{/* Already rounded to 2 decimals */}
                <td>{formatValue(baseValue, 1)}</td>
                <td>{formatValue(baseValue, currentMode)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="table-footer">
        <ul className="info-list">
          <li>
            ➜ {modeStr} Completion:{" "}
            <span className="placeholder">{getAverageCompletion()}%</span>
          </li>
          <li>
            ➜ Total {modeStr}:{" "}
            <span className="placeholder">{getTotalValue()}</span>
          </li>
          <li>
            ➜ Highest {modeStr}:{" "}
            <span className="placeholder">{getHighestValue()}</span>
          </li>
        </ul>
        {/* Copy search filter button section */}
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

export default TableComponent;
