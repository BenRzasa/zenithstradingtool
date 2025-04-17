/* ZTT | CSV Loader Page
  - Allows the user to update their data and view
  the name and quantity of each ore in their inventory.
  - Parses a CSV string, comma-separated, to ore names in
  alphabetical order. Stored in local storage to ensure persistency
  across sessions
*/

import React, { useContext, useState } from "react";
import NavBar from "../components/NavBar";
import { OreNames } from "../components/OreNames";
import { CSVContext } from "../context/CSVContext";

import { johnValsDict } from "../components/JohnVals";
import { nanValsDict } from "../components/NANVals";

import "../styles/CSVLoader.css";

function CSVLoader() {
  // Fetch the current data and the set function from context
  const {
    csvData,
    previousAmounts,
    lastUpdated,
    updateCSVData,
    isJohnValues
  } = useContext(CSVContext);

  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [currentFilter, setCurrentFilter] = useState('alphabetical');

  // Add this filter function
  const filterOres = (filterType) => {
    setCurrentFilter(filterType);
    setShowFilterPopup(false);
  };

  const updateOreAmounts = () => {
    const csvInput = document.getElementById("csvInput").value;
    if (!csvInput) return;

    const newAmounts = csvInput.split(",").map(Number);
    const updatedData = OreNames.reduce((acc, ore, index) => {
      acc[ore] = newAmounts[index] !== undefined && !isNaN(newAmounts[index])
        ? newAmounts[index]
        : 0;
      return acc;
    }, {});

    updateCSVData(updatedData); // Using the context helper
  };

  // Calculate total value change from last update
  const calculateValueChanges = () => {
    let totalGained = 0;
    let totalLost = 0;
    const changedOres = [];
    // Get both value dictionaries
    const valueDict = isJohnValues ? johnValsDict : nanValsDict;
    // Calculate changes for each ore
    OreNames.forEach((ore) => {
      const currentAmount = csvData[ore] || 0;
      const previousAmount = previousAmounts[ore] || 0;
      const quantityChange = currentAmount - previousAmount;
      // Only process if there's an actual change
      if (quantityChange !== 0) {
        // Find the ore's base value from any layer
        let baseValue = 1; // Default if not found
        Object.values(valueDict).some(layer => {
          const oreData = layer.find(item => item.name === ore);
          if (oreData) {
            baseValue = oreData.baseValue;
            return true;
          }
          return false;
        });
        // Calculate the value change using ONLY the base value (AV)
        const valueChange = quantityChange / baseValue;
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
      {/* Usage instructions for the user */}
      <h1>CSV Loader Usage:</h1>
      <l>
        <ul>1. Copy & Paste your CSV string from Settings ➜ Other (in TCC) in the box below.</ul>
        <ul>2. Click "Update Amounts" button to load your CSV data into the website.</ul>
        <ul>3. Navigate to the Value Chart by clicking on the link in the top right corner.</ul>
        {/* Show the time & date when the CSV data was last updated */}
        <ul className='placeholder'>
          Last Updated: { lastUpdated ? lastUpdated.toLocaleString() : "Never"}</ul>
      </l>
      {/* Main content area with flex layout */}
      <div className="main-content">
        {/* Ore list table - now part of flex layout */}
        <div className="ore-table-parent">
          <div className="ore-list">
            <table>
              <thead>
                <tr>
                  <th>Ore</th>
                  <th>Amount</th>
                  <th>Change</th>
                </tr>
              </thead>
              <tbody>
                {/*
                    Map all ores from OreNames, with the corresponding
                    amount from the user's inventory CSV string.
                    Now includes sorting based on the current sort chosen
                */}
                {OreNames
                  .sort((a, b) => {
                    switch(currentFilter) {
                      case 'quantity':
                        return (csvData[b] || 0) - (csvData[a] || 0);
                      case 'change':
                        const changeA = (csvData[a] || 0) - (previousAmounts[a] || 0);
                        const changeB = (csvData[b] || 0) - (previousAmounts[b] || 0);
                        return changeB - changeA;
                      default:
                        return a.localeCompare(b);
                    }
                  })
                  .map((ore) => {
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
                          {
                            change !== 0 ? (change > 0 ? `+${change}` : change) : ''
                          }
                        </td>
                      </tr>
                    );
                  })
                }
              </tbody>
            </table>
          </div>
        </div>
        {/* CSV Input Section */}
        <div className="button-container">
          <div className="box-button">
              <button onClick={updateOreAmounts}>
                <span>Update Amounts</span>
              </button>
          </div>
          <div className="box-button">
              <button onClick={exportCSV}>
                <span>Export CSV</span>
              </button>
          </div>
          <div className="box-button">
            <button onClick={() => setShowFilterPopup(!showFilterPopup)}>
              <span>Filter Table</span>
            </button>
          </div>
          {/* filter popup - under the filter button */}
          {showFilterPopup && (
            <div className="filter-popup">
              <div className="filter-options">
                <button
                  onClick={() => filterOres('alphabetical')}
                  className={currentFilter === 'alphabetical' ? 'active' : ''}
                >
                  Alphabetically
                </button>
                <button
                  onClick={() => filterOres('quantity')}
                  className={currentFilter === 'quantity' ? 'active' : ''}
                >
                  Quantity in Inventory
                </button>
                <button
                  onClick={() => filterOres('change')}
                  className={currentFilter === 'change' ? 'active' : ''}
                >
                  Change Amount
                </button>
              </div>
            </div>
          )}
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
      <h2>Value Changes (AV)</h2>
      <div className="value-change-cards">
        <div className="value-card gained">
          <span>Value Gained:</span>
          <span> +{calculateValueChanges().totalGained.toFixed(1)}</span> AV
        </div>
        <div className="value-card lost">
          <span>Value Lost:</span>
          <span> -{calculateValueChanges().totalLost.toFixed(1)}</span> AV
        </div>
        <div className={`value-card net ${
          calculateValueChanges().netChange >= 0 ? 'positive' : 'negative'
        }`}>
          <span>Net Change:</span>
          <span>
            {calculateValueChanges().netChange >= 0 ? ' +' : ' '}
            {calculateValueChanges().netChange.toFixed(1)}
          </span> AV
        </div>
      </div>
      {/* Show detailed changes per ore */}
      <div className="ore-changes-details">
        <h2>Changed Ores:</h2>
        <div className="ore-changes-list">
        <ul>
          {calculateValueChanges().changedOres
            .sort((a, b) => b.valueChange - a.valueChange) // Sort by valueChange descending
            .map(({ore, valueChange}) => (
            <li key={ore}>
              {ore}: <span className={valueChange > 0 ? 'positive-change' : 'negative-change'}>
                {(valueChange > 0 ? ' +' : ' ') + valueChange.toFixed(2)} AV
              </span>
            </li>
          ))}
        </ul>
        </div>
      </div>
    </div>
    )}
    </>
  );
}

export default CSVLoader;
