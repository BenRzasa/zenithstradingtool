/* ZTT | CSV Loader Page
  - Allows the user to update their data and view
  the name and quantity of each ore in their inventory.
  - Parses a CSV string, comma-separated, to ore names in
  alphabetical order. Stored in local storage to ensure persistency
  across sessions
*/

import React, { useContext, useState } from "react";
import NavBar from "../components/NavBar";
import ValueModeSelector from "../components/ValueModeSelector";
import { MiscValueFunctions } from "../components/MiscValueFunctions";
import { MiscContext } from "../context/MiscContext";
import CSVEditor from "../components/CSVEditor";
import { OreNames } from "../data/OreNames";
import { initialOreValsDict } from "../data/OreValues";

import "../styles/CSVLoader.css";

// To make useMemo shut up...
const ORE_NAMES = Object.freeze([...OreNames]);

function CSVLoader() {
  // Fetch the current data and the set function from context
  const {
    csvData,
    oreValsDict,
    previousAmounts,
    lastUpdated,
    updateCSVData,
    currentMode,
    setCurrentMode,
    customMultiplier,
    capCompletion,
    valueMode,
    getValueForMode,
    csvHistory,
    loadOldCSV,
  } = useContext(MiscContext);

  const allValues = MiscValueFunctions({
    csvData,
    valueMode,
    currentMode,
    setCurrentMode,
    getValueForMode,
    oreValsDict,
  });

  const {
    grandTotal,
    avgCompletion,
  } = allValues;

  // State for dropdown visibility
  const [showHistoryDropdown, setShowHistoryDropdown] = useState(false);

  // State for sorting configuration
  const [sortConfig, setSortConfig] = useState({
    key: 'change',     // Current column being sorted 'ore', 'amount', 'change'
    direction: 'desc'  // Current direction 'asc' or 'desc'
  });

  // State for CSV editor popup
  const [ showCSVEditor, setShowCSVEditor ] = useState(false);

  // Function to handle header clicks and toggle sorting
  const handleSort = (columnKey) => {
    let direction = 'asc';
    // If clicking the same column, toggle the direction
    if (sortConfig.key === columnKey) {
      direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    }
    setSortConfig({ key: columnKey, direction });
  };

  // Get sort indicator for a column
  const displaySortArrow = (columnKey) => {
    if (sortConfig.key !== columnKey) return null;
    return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
  };

  // Memoized sorted ores
  const sortedOres = React.useMemo(() => {
    const sortableOres = [...ORE_NAMES];

    sortableOres.sort((a, b) => {
      // Handle change column cases - requires some nitpicking to format nicely
      if (sortConfig.key === 'change') {
        const changeA = (csvData[a] || 0) - (previousAmounts[a] || 0);
        const changeB = (csvData[b] || 0) - (previousAmounts[b] || 0);
        // Handle zeros first (they should always be last)
        if (changeA === 0 && changeB === 0) return 0;
        if (changeA === 0) return 1;
        if (changeB === 0) return -1;
        if (sortConfig.direction === 'asc') {
          // ASCENDING: Negative increasing then Positive increasing
          if (changeA < 0 && changeB < 0) return changeA - changeB;
          if (changeA < 0 && changeB > 0) return -1;
          if (changeA > 0 && changeB < 0) return 1;
          if (changeA > 0 && changeB > 0) return changeA - changeB;
        } else {
          // DESCENDING: Positive decreasing then Negative decreasing
          if (changeA > 0 && changeB > 0) return changeB - changeA;
          if (changeA > 0 && changeB < 0) return -1;
          if (changeA < 0 && changeB > 0) return 1;
          if (changeA < 0 && changeB < 0) return changeB - changeA;
        }
        return 0;
      }

      // Get values to compare based on sort column
      let aValue, bValue;

      switch (sortConfig.key) {
        case 'amount':
          aValue = csvData[a] || 0;
          bValue = csvData[b] || 0;
          break;
        default: // 'ore'
          aValue = a;
          bValue = b;
          break;
      }

      // Compare values
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
  });
    return sortableOres;
  }, [csvData, previousAmounts, sortConfig]);

  const updateOreAmounts = () => {
    // Process the CSV data
    const csvInput = document.getElementById("csvInput").value;
    if (!csvInput) return;
    const newAmounts = csvInput.split(",").map(Number);
    const updatedData = {};
    // Process in alphabetical order to ensure consistency
    OreNames.sort((a, b) => a.localeCompare(b)).forEach((ore, index) => {
      updatedData[ore] = newAmounts[index] !== undefined && !isNaN(newAmounts[index])
        ? newAmounts[index]
        : 0;
    });
    // Update the CSV data
    updateCSVData(updatedData);
  };

  const isNV = customMultiplier % 100 === 0;
  // For displaying the current mode dynamically
  const modeStr =
    currentMode === 1 ? "AV"
  : currentMode === 2 ? "UV"
  : currentMode === 3 ? "NV"
  : currentMode === 4 ? "TV"
  : currentMode === 5 ? "SV"
  : currentMode === 6 ? "RV"
  : !isNV && currentMode === 7 ? "CV"
  : isNV && currentMode === 7 ? `${customMultiplier / 100}NV`
  : "BAD";

  // Calculate total value change from last update
  const calculateValueChanges = () => {
    let multiplier = 0;

    switch(currentMode) {
      case 1:
        multiplier = 1;
        break;
      case 2:
        multiplier = 10;
        break;
      case 3:
        multiplier = 100;
        break;
      case 4:
        multiplier = 500;
        break;
      case 5:
        multiplier = 1000
        break;
      case 6:
        multiplier = 50;
        break;
      case 7:
        multiplier = customMultiplier;
        break;
      default:
        multiplier = 1;
        break;
    }

    let totalGained = 0;
    let totalLost = 0;
    const changedOres = [];
    const valueDict = initialOreValsDict;
    // Calculate changes for each ore
    OreNames.forEach((ore) => {
      const currentAmount = csvData[ore] || 0;
      const previousAmount = previousAmounts[ore] || 0;
      const quantityChange = currentAmount - previousAmount;
      // Only process if there's an actual change
      if (quantityChange!== 0) {
        // Find the ore's base value from any layer
        let baseValue = 1; // Default if not found
        Object.values(valueDict).some(layer => {
          const oreData = layer.find(item => item.name === ore);
          if (oreData) {
            // Use the value based on the current value mode
            baseValue = getValueForMode(oreData);
            return true;
          }
          return false;
        });
        // Calculate the value change
        const valueChange = quantityChange / (baseValue * multiplier);
        if (valueChange > 0) {
          totalGained += valueChange;
        } else {
          totalLost += Math.abs(valueChange);
        }
        // Track changed ores for display
        changedOres.push({
          ore,
          quantityChange,
          valueChange
        });
      }
    });

    return {
      totalGained,
      totalLost,
      netChange: totalGained - totalLost,
      changedOres
    };
  };

  // Export the CSV data and put it in the input box
  const exportCSV = () => {
    // Create an array of values in the same order as OreNames
    const csvValues = OreNames.map(ore => csvData[ore] || 0);
    // Join with commas and put in textarea
    document.getElementById("csvInput").value = csvValues.join(",");
  };

  return (
    <>
    {/* Nav Bar - remains fixed at top */}
    <NavBar />
    <div className="main-container">
      <div className="csv-usage">
      {/* Usage instructions for the user */}
      <h1>CSV Loader Usage</h1>
      <ol>
        <li>Copy & Paste your CSV string from Settings ➜ Other (in TCC) in the box below.</li>
        <li>Click "Update Amounts" button to load your CSV data into the website.</li>
        <li>Navigate to the Value Chart by clicking on the link in the top right corner.</li>
        {/* Show the time & date when the CSV data was last updated */}
        <div
          className='placeholder'
          style={{fontSize:"25px"}}
        >
          Last Updated: { lastUpdated ? lastUpdated.toLocaleString() : "Never"}</div>
      </ol>
      </div>
      <div className="b-container" style={{marginLeft:""}}>
      {/* CSV update section */}
      <div className="box-button">
        {/* Update the amounts, sort by Change # and descending */}
          <button onClick={() => {
            updateOreAmounts();
            // Force sort by change
            setSortConfig({
              key: 'change',
              direction: 'desc'
            });
          }}>
            <span>Update</span>
          </button>
      </div>
      <div className="box-button">
          <button onClick={exportCSV}>
            <span>Export CSV</span>
          </button>
      </div>
      <div className="box-button">
        <button
          onClick={() => setShowCSVEditor(!showCSVEditor)}
          className={showCSVEditor ? "color-template-protireal" : ""}
        >
          <span>Edit CSV</span>
        </button>
      </div>
        <div className="box-button c-dropdown-container">
          <button
            className={showHistoryDropdown ? "color-template-stardust" : ""}
            onClick={() => setShowHistoryDropdown(!showHistoryDropdown)}>
            <span>Load Past CSV</span>
          </button>
          {showHistoryDropdown && (
            <div className="history-dropdown">
              {csvHistory.length === 0 ? (
                <div className="dropdown-item">No history yet</div>
              ) : (
                csvHistory.map((entry, index) => (
                  <div
                    key={index}
                    className="dropdown-item"
                    onClick={() => {
                      loadOldCSV(index);
                      setShowHistoryDropdown(false);
                    }}
                  >
                    {new Date(entry.timestamp).toLocaleString()}
                    <br />
                    {entry.totalAV.toFixed(1)} AV
                    <br />
                    {entry.valueMode === 'custom'
                      ? 'CUSTOM' : entry.valueMode.toUpperCase()}
                  </div>
                ))
              )}
          </div>
        )}
      </div>
        {showCSVEditor && (
          <CSVEditor onClose={() => setShowCSVEditor(false)}/>
        )}
      </div>

      <div className="main-content">
        {/* Ore list table - now part of flex layout */}
        <div className="ore-table-parent">
          <div className="ore-list">
            <table>
              <thead>
                <tr>
                  <th onClick={() => handleSort('ore')}
                      className="sortable-header">
                    Ore{displaySortArrow('ore')}
                  </th>
                  <th onClick={() => handleSort('amount')}
                      className="sortable-header">
                    Amount{displaySortArrow('amount')}
                  </th>
                  <th onClick={() => handleSort('change')}
                      className="sortable-header">
                    Change{displaySortArrow('change')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {/*
                    Map all ores from OreNames, with the corresponding
                    amount from the user's inventory CSV string.
                    Now includes sorting based on the current sort chosen
                     - User can interact with the header by clicking to sort in ascending/
                       descending order
                */}
                {sortedOres.map((ore) => {
                  const currentAmount = csvData[ore] || 0;
                  const previousAmount = previousAmounts[ore] || 0;
                  const change = currentAmount - previousAmount;
                  return (
                    <tr key={ore}>
                      <td>{ore}</td>
                      <td>{currentAmount}</td>
                      <td
                        className={
                          change > 0 ? 'positive-change'
                          : change < 0 ? 'negative-change'
                          : ''
                        }>
                        {change !== 0 ? (change > 0 ? `+${change}` : change) : ''}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="csv-input">
          {/* CSV Input Box */}
          <textarea
            id="csvInput"
            placeholder="Enter comma-separated numbers..."
          />
        </div>
      </div>
    </div>
    {/* Total value updates from last csv update */}
    {Object.keys(previousAmounts).length > 0 && (
      <div className="value-change-summary">
      <div className="value-change-cards">
        <div className="value-card gained">
          <span>Value Gained:</span>
          <span> +{calculateValueChanges().totalGained.toFixed(1)}</span> {modeStr}
        </div>
        <div className="value-card lost">
          <span>Value Lost:</span>
          <span> -{calculateValueChanges().totalLost.toFixed(1)}</span> {modeStr}
        </div>
        <div className={`value-card net ${
          calculateValueChanges().netChange >= 0 ? 'positive' : 'negative'
        }`}>
          <span>Net Change:</span>
          <span>
            {calculateValueChanges().netChange >= 0 ? ' +' : ' '}
            {calculateValueChanges().netChange.toFixed(1)}
          </span> {modeStr}
        </div>
      </div>
      {/* Show detailed changes per ore */}
      <div className="ore-changes-details">
        <h3>Changed Ores:</h3>
        <div className="ore-changes-list">
        <ul>
          {calculateValueChanges().changedOres
            .sort((a, b) => b.valueChange - a.valueChange) // Sort by valueChange descending
            .map(({ore, valueChange}) => (
            <li key={ore}>
              {ore}: <span className={valueChange > 0 ? 'positive-change' : 'negative-change'}>
                {(valueChange > 0 ? ' +' : ' ') + valueChange.toFixed(2)} {modeStr}
              </span>
            </li>
          ))}
        </ul>
        </div>
      </div>
      <div className="ore-changes-details">
      <h3>⛏ {modeStr} % Gained:{" "}</h3>
        <span className="placeholder">PLACEHOLDER %</span>
      </div>
    </div>
    )}
    </>
  );
}

export default CSVLoader;
