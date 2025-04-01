// Modular table component that works with any dictionary of values
// given the layer name, ore names, and a base value. And the gradient!
import '../styles/AllGradients.css';
import '../styles/ValueChart.css';
import '../styles/TableComponent.css';

import React, { useContext, useState } from 'react';
import { CSVContext } from '../context/CSVContext';

const TableComponent = ({
  data,
  title,
  currentMode,
  gradient,
  searchFilters,
}) => {
  const { csvData, setCSVData } = useContext(CSVContext);

  const modeStr = currentMode === 1 ? "AV" :
    currentMode === 2 ? "UV" :
      currentMode === 3 ? "NV" :
        currentMode === 4 ? "TV" :
          currentMode === 5 ? "SV" : "BAD";

  // Function to calculate the value based on the current mode
  const calculateValue = (baseValue) => {
    switch (currentMode) {
      case 1: return baseValue * 1;    // AV
      case 2: return baseValue * 10;   // UV
      case 3: return baseValue * 100;  // NV
      case 4: return baseValue * 500;  // TV
      case 5: return baseValue * 1000; // SV
      default: return baseValue;
    }
  };

  // Function to calculate the percentage with bounds
  const calculatePercentage = (baseValue, inventory) => {
    const orePerUnit = calculateValue(baseValue);
    return orePerUnit > 0
      ? Math.min(100, (inventory / orePerUnit) * 100)
      : 0;
  };

  // Preserve original precision exactly as in baseValue 
  // Now, add a K at the end, truncating all leading zeroes,
  // if the number is above 1000. Also, remove trailing zeroes
  // if the number is, say, "2.000"
  const formatDecimal = (value, mode = 3) => {
    const num = Number(value);
    if (!Number.isFinite(num)) return "0";
    // For /AV (mode 1) - return raw number exactly as provided
    if (mode === 1) return num.toString();
    // Calculate scaled value
    const scaleFactor = mode === 2 ? 10 : mode === 3 ? 100 :
      mode === 4 ? 500 : mode === 5 ? 1000 : 1;
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
      if (str.includes('.')) {
        str = str.replace(/\.?0+$/, '');
      }
      return str + suffix;
    };
    // Millions
    if (Math.abs(scaledValue) >= 1000000) {
      const divided = scaledValue / 1000000;
      return formatWithSuffix(divided, 'M');
    }
    // Thousands
    if (Math.abs(scaledValue) >= 1000) {
      const divided = scaledValue / 1000;
      return formatWithSuffix(divided, 'K');
    }
    // Regular numbers
    const truncated = truncate(scaledValue, 3);
    let str = truncated.toString();
    if (str.includes('.')) {
      str = str.replace(/\.?0+$/, '');
    }
    return str;
  };


  // Calculate completion percentage
  const getAverageCompletion = () => {
    const totalCompletion = data.reduce((sum, item) => {
      const inventory = csvData[item.name] || 0;
      const orePerUnit = calculateValue(item.baseValue);
      const completion = orePerUnit > 0 ? Math.min(1, inventory / orePerUnit) : 0;
      return sum + completion;
    }, 0);

    return ((totalCompletion / data.length) * 100).toFixed(1);
  };

  // Calculate total NVs/UVs/TVs/SVs
  const getTotalValue = () => {
    const total = data.reduce((sum, item) => {
      const inventory = csvData[item.name] || 0;
      const orePerUnit = calculateValue(item.baseValue);
      return orePerUnit > 0 ? sum + (inventory / orePerUnit) : sum;
    }, 0);

    return `${parseFloat(total.toFixed(1))} ${modeStr}`;
  };

  // Find highest value ore
  const getHighestValue = () => {
    const highestItem = data.reduce((max, item) => {
      const inventory = csvData[item.name] || 0;
      const orePerUnit = calculateValue(item.baseValue);
      const numV = orePerUnit > 0 ? inventory / orePerUnit : 0;
      return numV > max.value ? { name: item.name, value: numV } : max;
    }, { name: '', value: 0 });

    return `${highestItem.name} (${highestItem.value.toFixed(1)} ${modeStr})`;
  };


  // Handle inventory changes
  const handleInventoryChange = (itemName, newValue) => {
    const numericValue = Math.max(0, isNaN(newValue) ? 0 : Number(newValue));

    // Update through context which will automatically persist to localStorage
    setCSVData(prev => ({
      ...prev,
      [itemName]: numericValue
    }));
  };

  const [copiedFilter, setCopiedFilter] = useState(null);

  const findMatchingFilter = (layerName) => {
    return searchFilters.find(filter => {
      // Remove arrow and compare with layer name
      const filterName = filter.split('➜ ')[1]?.split(':')[0]?.trim();
      return filterName && layerName.includes(filterName);
    });
  };

  const copyLayerFilter = () => {
    const matchingFilter = findMatchingFilter(title);
    if (matchingFilter) {
      const filterItems = matchingFilter.split(': ')[1];
      navigator.clipboard.writeText(filterItems.trim())
        .then(() => {
          setCopiedFilter(filterItems);
          setTimeout(() => setCopiedFilter(null), 2000); // Clear after 2 seconds
        });
    }
  };

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
      <h2 className="table-wrapper h2" style={{ background: gradient }} data-text={title}>
        {title}
      </h2>
      <table className='table-comp'>
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
            const inventory = csvData[item.name] || 0;
            const baseValue = item.baseValue;
            const percentage = calculatePercentage(baseValue, inventory);
            const numV = calculateValue(baseValue) > 0
              ? (inventory / calculateValue(baseValue)).toFixed(2) // Round to 2 decimals here
              : "0";

            return (
              <tr key={index}>
                <td className={`name-column ${item.className || ""}`} data-text={item.name}>
                  {item.name}
                </td>
                <td className={`percent-${Math.floor(percentage / 20) * 20}`}>
                  {percentage.toFixed(1)}%
                </td>
                <td className="inventory-cell">
                  {/* Hidden span maintains natural cell sizing */}
                  <span className="value-display">
                    {inventory.toLocaleString()}
                  </span>

                  {/* Editable input */}
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={inventory}
                    onChange={(e) => {
                      // Allow empty value during editing
                      if (e.target.value === '') return;
                      const numericValue = Math.max(0, parseInt(e.target.value) || 0);
                      handleInventoryChange(item.name, numericValue);
                    }}
                    className="inventory-input"
                    onFocus={(e) => {
                      e.target.select();
                      e.target.dataset.prevValue = e.target.value;
                    }}
                    onBlur={(e) => {
                      const newValue = e.target.value === '' ? 0 : Math.max(0, parseInt(e.target.value) || 0);
                      if (newValue !== parseInt(e.target.dataset.prevValue || 0)) {
                        handleInventoryChange(item.name, newValue);
                      }
                      if (e.target.value === '') e.target.value = 0;
                    }}
                    onKeyDown={(e) => {
                      // Allow backspace/delete to clear
                      if (e.key === 'Backspace' || e.key === 'Delete') {
                        if (e.target.value.length === 1) {
                          e.target.value = '';
                        }
                      }
                      // Enter key to blur/submit
                      if (e.key === 'Enter') e.target.blur();
                    }}
                  />
                </td>
                <td>{numV}</td> {/* Already rounded to 2 decimals */}
                <td>{formatDecimal(baseValue, 1)}</td>
                <td>{formatDecimal(baseValue, currentMode)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="table-footer">
        <ul className="info-list">
          <li>➜ {modeStr} Completion: <span className="placeholder">
            {getAverageCompletion()}%
          </span></li>
          <li>➜ Total {modeStr}: <span className="placeholder">
            {getTotalValue()}
          </span></li>
          <li>➜ Highest {modeStr}: <span className="placeholder">
            {getHighestValue()}
          </span></li>
        </ul>
        
        {/* Add this copy button section */}
        <div className="copy-filter-container">
          <button 
            className="copy-filter-btn"
            onClick={copyLayerFilter}
            title="Copy search filter for this layer"
          >
            Copy Search Filter
          </button>
          {copiedFilter && (
            <div className="copy-confirmation">
              ✓ Copied to clipboard!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TableComponent;