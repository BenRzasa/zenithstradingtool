// Modular table component that works with any dictionary of values
// given the layer name, ore names, and a base value.
import '../styles/AllGradients.css';
import '../styles/ValueChart.css';
import '../styles/TableComponent.css';

import React from "react";

const TableComponent = ({
  data,
  title,
  currentMode,
  csvData,
}) => {
  // Function to calculate the value based on the current mode
  const calculateValue = (baseValue) => {
    if (currentMode === 1) return baseValue * 100; // NV
    if (currentMode === 2) return baseValue * 10; // UV
    if (currentMode === 3) return baseValue * 500; // TV
    if (currentMode === 4) return baseValue * 1000; // SV
    return baseValue;
  };

  // Function to calculate the percentage
  const calculatePercentage = (baseValue, inventory) => {
    if (currentMode === 1) {        // NV
      return ((inventory / (baseValue * 100)) * 100).toFixed(1);
    } else if (currentMode === 2) { // UV
      return ((inventory / (baseValue * 10)) * 100).toFixed(1);
    } else if (currentMode === 3) { // TV
      return ((inventory / (baseValue * 500)) * 100).toFixed(1);
    } else if (currentMode === 4) { // SV
      return ((inventory / (baseValue * 1000)) * 100).toFixed(1);
    }
    return 0;
  };

  // Helper function to determine the number of decimal places
  const getPrecision = (number) => {
    if (typeof number !== 'number' || Number.isInteger(number)) {
      return 1; // One decimal place for integers
    }
    const decimalPart = number.toString().split('.')[1];
    return decimalPart ? decimalPart.length : 0;
  };

  // 1. Calculate completion percentage (matches Excel MIN(1,Inventory/OrePerUnit) logic
  const getAverageCompletion = () => {
    const totalCompletion = data.reduce((sum, item) => {
      const inventory = csvData[item.name] || 0;
      const orePerUnit = calculateValue(item.baseValue); // NV/UV/TV/SV per ore
      const completion = Math.min(1, inventory / orePerUnit); // Cap at 100%
      return sum + completion;
    }, 0);
    
    return ((totalCompletion / data.length) * 100).toFixed(1); // Convert to percentage
  };

  // 2. Calculate total NVs/UVs/TVs/SVs
  const getTotalValue = () => {
    return data.reduce((sum, item) => {
      const inventory = csvData[item.name] || 0;
      const perValue = calculateValue(item.baseValue).toFixed(getPrecision(item.baseValue) - 1.0);
      return sum + parseFloat((inventory / perValue).toFixed(1));
    }, 0).toLocaleString();
  };

  // 3. Find highest value ore
  const getHighestValue = () => {
    const highestItem = data.reduce((max, item) => {
      const inventory = csvData[item.name] || 0;
      const perValue = calculateValue(item.baseValue).toFixed(getPrecision(item.baseValue) - 1.0);
      const numV = parseFloat((inventory / perValue).toFixed(1));
      return numV > max.value ? {name: item.name, value: numV} : max;
    }, {name: '', value: 0});
    
    const unit = currentMode === 1 ? "NV" :
                 currentMode === 2 ? "UV" :
                 currentMode === 3 ? "TV" : "SV";
    
    return `${highestItem.name} (${highestItem.value.toLocaleString()} ${unit})`;
  };

  // If data is undefined, render a fallback
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
      <h2>{title}</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>
              {currentMode === 1 ? "NV%"
             : currentMode === 2 ? "UV%"
             : currentMode === 3 ? "TV%"
             : "SV%"}
            </th>
            <th>Amount</th>
            <th>
              {currentMode === 1 ? "NVs" 
             : currentMode === 2 ? "UVs" 
             : currentMode === 3 ? "TVs" 
             : "SVs"}
            </th>
            <th>Per AV</th>
            <th>
              {currentMode === 1 ? "Per NV"
             : currentMode === 2 ? "Per UV"
             : currentMode === 3 ? "Per TV"
             : "Per SV"}
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            // Fetch the inventory value for the current ore using the ore name
            const inventory = csvData[item.name] || 0;
            const value = item.baseValue;
            // Calculate perValue with dynamic precision
            const percentage = Math.min(100, calculatePercentage(value, inventory));
            const precision = getPrecision(value);
            const perPres = precision - 1.0;
            const perValue = calculateValue(value).toFixed(perPres);
            const numV = (inventory / perValue).toFixed(1);
            return (
              <tr key={index}>
                <td className={`name-column ${item.className || ""}`} data-text={item.name}>
                  {item.name}
                </td>
                <td className={`percent-${Math.floor(percentage/20)*20}`}>
                  {percentage}%
                </td>
                <td>{inventory}</td>
                <td>{numV}</td>
                <td>{value.toFixed(precision)}</td>
                <td>{perValue}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
        {/* Information section */}
        <div className="table-footer">
        <ul className="info-list">
          <li>• Completion: <span className="placeholder">
            {getAverageCompletion()}%
          </span></li>

          <li>• Total Value: <span className="placeholder">
            {getTotalValue()} {currentMode === 1 ? "NV" :
                               currentMode === 2 ? "UV" :
                               currentMode === 3 ? "TV" : "SV"}
          </span></li>

          <li>• Highest Value: <span className="placeholder">
            {getHighestValue()}
          </span></li>
        </ul>
      </div>
    </div>
  );
};

export default TableComponent;