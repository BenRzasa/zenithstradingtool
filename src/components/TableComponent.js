// Modular table component that works with any dictionary of values
// given the layer name, ore names, and a base value.
import '../styles/AllGradients.css';
import '../styles/ValueChart.css';
import '../styles/TableComponent.css';

import React from 'react';

const TableComponent = ({
  data,
  title,
  currentMode,
  csvData,
  gradient,
}) => {
  const modeStr = currentMode === 1 ? "AV" :
                currentMode === 2 ? "UV" :
                currentMode === 3 ? "NV" : 
                currentMode === 4 ? "TV" :
                currentMode === 5 ? "SV" : "BAD";

  // Function to calculate the value based on the current mode
  const calculateValue = (baseValue) => {
    if (currentMode === 1) return baseValue * 1;    // AV
    if (currentMode === 2) return baseValue * 10;   // UV
    if (currentMode === 3) return baseValue * 100;  // NV
    if (currentMode === 4) return baseValue * 500;  // TV
    if (currentMode === 5) return baseValue * 1000; // SV
    return baseValue;
  };

  // Function to calculate the percentage with bounds
  const calculatePercentage = (baseValue, inventory) => {
    const orePerUnit = calculateValue(baseValue);
    return orePerUnit > 0 
      ? Math.min(100, (inventory / orePerUnit) * 100)
      : 0;
  };

  // Special formatter for numV column only
  const formatNumV = (value) => {
    if (!Number.isFinite(value)) return "0";
    
    // For whole numbers
    if (value % 1 === 0) return value.toString();
    
    // For decimals, show up to 3 places without trailing zeros
    const fixed = value.toFixed(3);
    return fixed.replace(/\.?0+$/, '');
  };

  // Preserve original precision exactly as in baseValue 
  // Now, add a K at the end, truncating all leading zeroes,
  // if the number is above 1000. Also, remove trailing zeroes
  // if the number is, say, "2.000"
  const formatWithOriginalPrecision = (value, baseValue) => {
    if (!Number.isFinite(value)) return "0";
    // Count decimal places from baseValue and detect trailing zeros
    const baseStr = baseValue.toString();
    // eslint-disable-next-line
    const [integerPart, decimalPart] = baseStr.split('.');
    const hasDecimal = decimalPart !== undefined;
    // Determine original precision (length of decimal part)
    const originalPrecision = decimalPart ? decimalPart.length : 0;
    // For numbers >= 1000, format with K notation
    if (Math.abs(value) >= 1000) {
      const divided = value / 1000;
      // Count significant decimal places (ignore trailing zeros)
      let significantDigits = originalPrecision;
      if (decimalPart) {
        // Count trailing zeros in original number
        const trailingZerosMatch = decimalPart.match(/0+$/);
        const trailingZeroCount = trailingZerosMatch ? trailingZerosMatch[0].length : 0;
        significantDigits = Math.max(0, originalPrecision - trailingZeroCount);
      }
      // Format with significant digits, then clean up trailing . if needed
      let formatted = divided.toFixed(significantDigits);
      // Remove trailing .000 if present
      if (formatted.includes('.')) {
        formatted = formatted.replace(/\.?0+$/, '');
        // If we ended with just a decimal point, remove it (e.g., "2." -> "2")
        if (formatted.endsWith('.')) {
          formatted = formatted.slice(0, -1);
        }
      }
      return formatted + 'K';
    }
    // For small numbers, use original precision but trim trailing zeros
    let smallFormatted = value.toFixed(originalPrecision);
    // Remove trailing zeros and possible decimal point if not needed
    if (hasDecimal && smallFormatted.includes('.')) {
      smallFormatted = smallFormatted.replace(/\.?0+$/, '');
      // Handle case where we removed all decimals (e.g., "2." -> "2")
      if (smallFormatted.endsWith('.')) {
        smallFormatted = smallFormatted.slice(0, -1);
      }
    }
    return smallFormatted;
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
      return numV > max.value ? {name: item.name, value: numV} : max;
    }, {name: '', value: 0});
    
    return `${highestItem.name} (${highestItem.value.toFixed(1)} ${modeStr})`;
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
            const orePerUnit = calculateValue(baseValue);
            
            // Calculate all values with proper precision
            const percentage = calculatePercentage(baseValue, inventory);
            const numV = orePerUnit > 0 ? inventory / orePerUnit : 0;
            const perValue = calculateValue(baseValue);
            
            return (
              <tr key={index}>
                <td className={`name-column ${item.className || ""}`} data-text={item.name}>
                  {item.name}
                </td>
                <td className={`percent-${Math.floor(percentage/20)*20}`}>
                  {percentage.toFixed(1)}%
                </td>
                <td>{inventory}</td>
                <td>{formatNumV(numV)}</td>
                <td>{formatWithOriginalPrecision(baseValue, baseValue)}</td>
                <td>{formatWithOriginalPrecision(perValue, baseValue)}</td>
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
      </div>
    </div>
  );
};

export default TableComponent;