import React from 'react';

const TableComponent = ({ data, title, currentMode, csvData, isJohnValues }) => {
  // Function to calculate the value based on the current mode
  const calculateValue = (baseValue) => {
    if (currentMode === 1) return baseValue * 100; // NV
    if (currentMode === 2) return baseValue * 10; // UV
    if (currentMode === 3) return baseValue * 1000; // SV
    return baseValue;
  };

  // Function to calculate the percentage
  const calculatePercentage = (baseValue, inventory) => {
    if (currentMode === 1) {
      return ((inventory / (baseValue * 100)) * 100).toFixed(1);
    } else if (currentMode === 2) {
      return ((inventory / (baseValue * 10)) * 100).toFixed(1);
    } else if (currentMode === 3) {
      return ((inventory / (baseValue * 1000)) * 100).toFixed(1);
    }
    return 0;
  };

  return (
    <div className="table-wrapper">
      <h2>{title}</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>{currentMode === 1 ? "1 NV%" : currentMode === 2 ? "1 UV%" : "1 SV%"}</th>
            <th>Inventory</th>
            <th>Ore Per AV</th>
            <th>{currentMode === 1 ? "Ore Per NV" : currentMode === 2 ? "Ore Per UV" : "Ore Per SV"}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            const inventory = csvData[index] || 0;
            const percentage = calculatePercentage(item.baseValue, inventory);
            return (
              <tr key={`compound-${index}`}>
                <td>Compound {index + 1}</td>
                <td>{Math.min(100, percentage)}%</td>
                <td>{inventory}</td>
                <td>{item.baseValue.toFixed(1)}</td>
                <td>{calculateValue(item.baseValue).toFixed(0)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent; // Ensure this is the default export