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
  const formatDecimal = (value, baseValue) => {
    const num = Number(value);
    if (!Number.isFinite(num)) return "0";
    // Handle K notation ONLY for numbers >= 1000
    if (Math.abs(num) >= 1000) {
      const dividedValue = num / 1000;
      const basePrecision = baseValue?.toString().split('.')[1]?.length || 0;
      const precision = Math.min(basePrecision, 3);
      // Truncate (not round) to desired precision
      const factor = 10 ** precision;
      const truncated = Math.floor(dividedValue * factor) / factor;
      // Format without trailing zeros
      let formatted = truncated.toString();
      formatted = formatted.replace(/\.?0+$/, '').replace(/\.$/, '');
      return formatted + 'K';
    }
    // For numbers < 1000, handle decimal places
    const strValue = num.toString();
    const decimalIndex = strValue.indexOf('.');
    // If number has more than 3 decimal places
    if (decimalIndex !== -1 && strValue.length - decimalIndex > 4) {
      // Truncate to exactly 3 decimal places (no rounding)
      const truncated = Math.floor(num * 1000) / 1000;
      return truncated.toString().replace(/\.?0+$/, '').replace(/\.$/, '');
    }
    // Otherwise return original string representation
    return strValue;
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
                <td className={`percent-${Math.floor(percentage / 20) * 20}`}>
                  {percentage.toFixed(1)}%
                </td>
                <td>{inventory}</td>
                <td>{formatDecimal(numV)}</td>
                <td>{formatDecimal(baseValue)}</td>
                <td>{formatDecimal(perValue, baseValue)}</td> 
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