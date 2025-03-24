// Value Chart page. Provides functionality below:
/*
    - Dynamically switch between UV (10x AV), NV (100x AV) and SV (1000x AV)
    - Switch between John and NAN's values (based off the dictionaries)
*/

import React, { useState, useContext } from 'react';
import { CSVContext } from '../context/CSVContext';
import '../styles/ValueChart.css';
import { Link } from 'react-router-dom';
import TableComponent from '../components/TableComponent';
import { johnValsDict } from '../components/JohnVals';
import { nanValsDict } from '../components/NANVals';

function ValueChart() {
  const { csvData } = useContext(CSVContext);
  const [currentMode, setCurrentMode] = useState(1); // 1: NV, 2: UV, 3: SV
  const [isJohnValues, setIsJohnValues] = useState(true);

  // Compounds data (fetched from the dictionary)
  // Clean up so that it can loop through an array of layer names and
  // get the data from the John and NAN dicts

  // Create a single data object for all layers
  const data = Object.keys(johnValsDict).reduce((acc, layer) => {
    acc[layer] = isJohnValues ? johnValsDict[layer] : nanValsDict[layer];
    return acc;
  }, {});

  return (
    <div className="container">
      {/* Header Section */}
      <header className="header">
        <div className="quick-summary">
          <h2>Quick Summary</h2>
          <p>
            Total Ores:{" "}
            {Object.values(csvData).reduce((acc, val) => acc + val, 0)}
          </p>
          <p>
            {currentMode === 1 ? "Rare NVs"
           : currentMode === 2 ? "Rare UVs"
           : currentMode === 3 ? "Rare TVs"
           : "Rare SVs"}
           : Placeholder
          </p>
          <p>
            {currentMode === 1 ? "Unique NVs"
           : currentMode === 2 ? "Unique UVs"
           : currentMode === 3 ? "Rare TV"
           : "Unique SVs"}
           : Placeholder
          </p>
          <p>
            {currentMode === 1 ? "Layer NVs"
           : currentMode === 2 ? "Layer UVs"
           : currentMode === 3 ? "Layer TVs"
           : "Layer SVs"}
           : Placeholder
          </p>
          <p>
            {currentMode === 1 ? "Grand Total NV"
           : currentMode === 2 ? "Grand Total UV"
           : currentMode === 3 ? "Grand Total TV"
           : "Grand Total SV"}
           : Placeholder
          </p>
          <p>
            {currentMode === 1 ? "Total NV Completion %"
           : currentMode === 2 ? "Total UV Completion %"
           : currentMode === 3 ? "Total TV Completion %"
           : "Total SV Completion %"}
           : Placeholder
          </p>
        </div>
        <nav>
          <ul>
            <li><Link to="/">Back to Home Page</Link></li>
            <li><Link to="/tradetool">Trade Tool</Link></li>
            <li><Link to="/csvloader">CSV Loader</Link></li>
          </ul>
        </nav>
      </header>

      {/* Display current mode*/}
      <h1>Current Values: {isJohnValues ? "John's Values" : "NAN's Values"}</h1>
      <h2>
        Current Mode:{" "}
        {currentMode === 1 ? "NV" 
       : currentMode === 2 ? "UV" 
       : currentMode === 3 ? "TV"
       : "SV"}
      </h2>

      {/* Buttons Section */}
      <div className="value-buttons">
        <button
          style={{
            backgroundImage:
              "linear-gradient(144deg, #00ddeb, #5b42f3 50%, #af40ff)",
          }}
          onClick={() => setIsJohnValues(true)}
        >
          <span>John Values</span>
        </button>
        <button
          style={{
            backgroundImage:
              "linear-gradient(144deg,rgb(155, 44, 214),rgb(205, 85, 238) 50%,rgb(224, 123, 244))",
          }}
          onClick={() => setIsJohnValues(false)}
        >
          <span>NAN Values</span>
        </button>
      </div>

      <div className="mode-buttons">
        <button
          style={{
            backgroundImage:
              "linear-gradient(124deg,#fdf3fc 0%, #f38cf9 23.4%, #f072f8 43.9%, #cb32d5 58%, #9133d2 77.3%, #5216b0 100%)",
          }}
          onClick={() => setCurrentMode(2)}
        >
          <span>UV Mode</span>
        </button>
        <button
          style={{
            backgroundImage: 
              "linear-gradient(135deg, #fffcce 0%, #ffe873 24.4%, #ff8000 51.4%, #ff0000 70.2%, #9b0f0f 86.7%, #633f3f 100%)"
          }}
          onClick={() => setCurrentMode(1)}
        >
          <span>NV Mode</span>
        </button>
        <button
          style={{
            backgroundImage:
              "linear-gradient(123deg, #feffff 0%, #ccffff 13.8%, #8ec5d8 26.1%, #476ccc 33.7%, #887dc5 47.1%, #a17cc3 64.4%, #403e68 84.3%,#171c41 100%)",
          }}
          onClick={() => setCurrentMode(4)}
        >
          <span>TV Mode</span>
        </button>
        <button
          style={{
            backgroundImage:
              "linear-gradient(135deg, #fdfcef 0%, #d3f8f8 20%, #faedfd 30%, #f2caff 37.5%, #ffffff 50%, #ffd9a1 62.5%, #edebd6 70%, #ecf9df 80%, #b7dce1 100%)",
          }}
          onClick={() => setCurrentMode(3)}
        >
          <span>SV Mode</span>
        </button>
      </div>

      {/* Tables Section */}
      <div className="tables-container">
        {/* Dynamically create tables for each layer */}
        {Object.keys(data).map((layer) => (
          <TableComponent
            key={layer}
            data={data[layer]}
            title={layer}
            currentMode={currentMode}
            csvData={csvData}
            isJohnValues={isJohnValues}
          />
        ))}
      </div>
    </div>
  );
}

export default ValueChart;