// Value Chart page. Provides functionality below:
/*
    - Dynamically switch between UV (10x AV), NV (100x AV) and SV (1000x AV)
    - Switch between John and NAN's values (based off the dictionaries)
*/

import React, { useState, useContext } from 'react';
import { CSVContext } from '../context/CSVContext'; // Import the context
import '../styles/ValueChart.css'; // Import the CSS file
import { Link } from 'react-router-dom';
import TableComponent from '../components/TableComponent';

function ValueChart() {
  const { csvData } = useContext(CSVContext); // Access the CSV data from context
  const [currentMode, setCurrentMode] = useState(1); // 1: NV, 2: UV, 3: SV
  const [isJohnValues, setIsJohnValues] = useState(true);
  
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

  // Dictionaries for John and NAN values
  const johnValsDict = {
    Compounds: [4.5, 2.5, 2.5, 1],
    // Add other layers
  };

  const nanValsDict = {
    Compounds: [2.5, 2, 2, 1],
    // Add other layers
  };

  // Rare ore table data
  const rareOres = [
    { name: "Ambrosine", baseValue: 1.0 },
    { name: "Universallium", baseValue: 0.1 },
    { name: "Neutrine", baseValue: 0.01 },
    { name: "Torn Fabric", baseValue: 0.002 },
    { name: "Singularity", baseValue: 0.001 },
    { name: "Egg", baseValue: 0.02 },
    { name: "Cindrasil", baseValue: 0.25 },
    { name: "Zynulvinite", baseValue: 1.0 },
    { name: "Element V", baseValue: 0.2 },
    { name: "Neutrino", baseValue: 1.0 },
    { name: "Malbrane", baseValue: 1.0 },
    { name: "Dystranum", baseValue: 0.067 },
    { name: "Ectokelyte", baseValue: 0.333 },
    { name: "Havicron", baseValue: 0.1 },
    { name: "Rhylazil", baseValue: 0.02 },
    { name: "Ubriniale", baseValue: 0.01 },
    { name: "Nyrvinoris", baseValue: 1.0 },
    { name: "Unobtanium", baseValue: 1.0 },
  ];

  // Unique ore table data
  const uniqueOres = [
    { name: "Vicious Shard", baseValue: 0.004 },
    { name: "Jalabono", baseValue: 1.0 },
    { name: "Hollevite", baseValue: 1.0 },
    { name: "Verglazium", baseValue: 2.0 },
    { name: "Meteorite", baseValue: 2.0 },
    { name: "Panolethrium", baseValue: 1.0 },
    { name: "Astathian", baseValue: 0.5 },
    { name: "Sunstone", baseValue: 5.0 },
    { name: "Amber", baseValue: 2.0 },
    { name: "Chalcedony", baseValue: 2.5 },
    { name: "Onyx", baseValue: 2.5 },
  ];

  // Compounds data (fetched from the dictionary)
  const compounds = isJohnValues
    ? johnValsDict["Compounds"].map((baseValue) => ({ baseValue }))
    : nanValsDict["Compounds"].map((baseValue) => ({ baseValue }));

  return (
    <div className="container">
      {/* Header Section */}
      <header className="header">
        <div className="quick-summary">
          <h2>Quick Summary</h2>
          <p>Total Ores: {csvData.reduce((acc, val) => acc + val, 0)}</p>
          <p>
            {currentMode === 1
              ? "Rare NVs"
              : currentMode === 2
              ? "Rare UVs"
              : "Rare SVs"}: Placeholder
          </p>
          <p>
            {currentMode === 1
              ? "Unique NVs"
              : currentMode === 2
              ? "Unique UVs"
              : "Unique SVs"}: Placeholder
          </p>
          <p>
            {currentMode === 1
              ? "Layer NVs"
              : currentMode === 2
              ? "Layer UVs"
              : "Layer SVs"}: Placeholder
          </p>
          <p>
            {currentMode === 1
              ? "Grand Total NV"
              : currentMode === 2
              ? "Grand Total UV"
              : "Grand Total SV"}: Placeholder
          </p>
          <p>
            {currentMode === 1
              ? "Total NV Completion %"
              : currentMode === 2
              ? "Total UV Completion %"
              : "Total SV Completion %"}: Placeholder
          </p>
        </div>
        <nav>
          <ul>
            <li>
              <Link to="/">Back to Home Page</Link>
            </li>
            <li>
              <Link to="/tradetool">Trade Tool</Link>
            </li>
            <li>
              <Link to="/csvunloader">CSV Unloader</Link>
            </li>
          </ul>
        </nav>
      </header>
      <h1>Current Values: {isJohnValues ? "John's Values" : "NAN's Values"}</h1>
      <h2>Current Mode: {currentMode === 1 ? "NV" : currentMode === 2 ? "UV" : "SV"}</h2>
      {/* Buttons Section */}
      <div className="value-buttons">
        <button
          style={{ backgroundImage: 'linear-gradient(144deg, #00ddeb, #5b42f3 50%, #af40ff)' }}
          onClick={() => setIsJohnValues(true)}
        >
          <span>John Values</span>
        </button>
        <button
          style={{ backgroundImage: 'linear-gradient(144deg, #ffd700, #ff3c42 50%, #ff8c42)' }}
          onClick={() => setIsJohnValues(false)}
        >
          <span>NAN Values</span>
        </button>
      </div>

      <div className="mode-buttons">
        <button
          style={{ backgroundImage: 'linear-gradient(144deg, #af40ff, #5b42f3 50%, #00ddeb)' }}
          onClick={() => setCurrentMode(2)}
        >
          <span>UV Mode</span>
        </button>
        <button
          style={{ backgroundImage: 'linear-gradient(144deg, #ff8c42, #ff3c42 50%, #ffd700)' }}
          onClick={() => setCurrentMode(1)}
        >
          <span>NV Mode</span>
        </button>
        <button
          style={{ backgroundImage: 'linear-gradient(144deg, #ffffff, #ff7e5f 50%, #feb47b)' }}
          onClick={() => setCurrentMode(3)}
        >
          <span>SV Mode</span>
        </button>
      </div>

      {/* Tables Section */}
      <div className="tables-container">
        {/* Rares Table */}
        <div className="table-wrapper">
          <h2>Rares</h2>
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
              {rareOres.map((ore, index) => {
                const inventory = csvData.find((item) => item.name === ore.name)?.amount || 0;
                const percentage = calculatePercentage(ore.baseValue, inventory);
                return (
                  <tr key={ore.name}>
                    <td>{ore.name}</td>
                    <td>{Math.min(100, percentage)}%</td>
                    <td>{inventory}</td>
                    <td>{ore.baseValue.toFixed(1)}</td>
                    <td>{calculateValue(ore.baseValue).toFixed(0)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Uniques Table */}
        <div className="table-wrapper">
          <h2>Uniques</h2>
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
              {uniqueOres.map((ore, index) => {
                const inventory = csvData.find((item) => item.name === ore.name)?.amount || 0;
                const percentage = calculatePercentage(ore.baseValue, inventory);
                return (
                  <tr key={ore.name}>
                    <td>{ore.name}</td>
                    <td>{Math.min(100, percentage)}%</td>
                    <td>{inventory}</td>
                    <td>{ore.baseValue.toFixed(1)}</td>
                    <td>{calculateValue(ore.baseValue).toFixed(0)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Compounds Table */}
        <TableComponent
          data={compounds}
          title="Compounds"
          currentMode={currentMode}
          csvData={csvData}
          isJohnValues={isJohnValues}
        />
      </div>
    </div>
  );
}

export default ValueChart