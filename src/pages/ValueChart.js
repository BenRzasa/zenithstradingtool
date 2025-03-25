// Value Chart page. Provides functionality below:
/*
    - Dynamically switch between UV (10x AV), NV (100x AV) and SV (1000x AV)
    - Switch between John and NAN's values (based off the dictionaries)
*/

import React, { useState, useContext, useEffect } from 'react';
import { CSVContext } from '../context/CSVContext';
import '../styles/ValueChart.css';
import { Link } from 'react-router-dom';
import TableComponent from '../components/TableComponent';
import { johnValsDict } from '../components/JohnVals';
import { nanValsDict } from '../components/NANVals';
import { LayerGradients } from '../components/LayerGradients';
import '../styles/AllGradients.css';
import '../styles/TableComponent.css';

function ValueChart() {
  const { csvData } = useContext(CSVContext);
  const [currentMode, setCurrentMode] = useState(1); // 1: NV, 2: UV, 3: TV, 4: SV
  const [isJohnValues, setIsJohnValues] = useState(true);
  // List of table names for the dropdown
  const tableNames = Object.keys(isJohnValues ? johnValsDict : nanValsDict);

  // Helper functions for calculations
  const calculateValue = (baseValue) => {
    if (currentMode === 1) return baseValue * 100; // NV
    if (currentMode === 2) return baseValue * 10; // UV
    if (currentMode === 3) return baseValue * 500; // TV
    if (currentMode === 4) return baseValue * 1000; // SV
    return baseValue;
  };

  // Get the correct precision dynamically
  const getPrecision = (number) => {
    if (typeof number !== 'number' || Number.isInteger(number)) return 1;
    const decimalPart = number.toString().split('.')[1];
    return decimalPart ? decimalPart.length : 0;
  };

  // Calculate grand totals for Quick Info section
  const calculateGrandTotals = () => {
    let rareTotal = 0;
    let uniqueTotal = 0;
    let layerTotal = 0;
    let grandTotal = 0;
    let totalOres = Object.values(csvData).reduce((acc, val) => acc + val, 0);
    let tableCompletions = [];
  
    Object.entries(isJohnValues ? johnValsDict : nanValsDict).forEach(([layerName, layerData]) => {
      let tableCompletion = 0;
      let itemCount = 0;
  
      layerData.forEach(item => {
        const inventory = csvData[item.name] || 0;
        const perValue = calculateValue(item.baseValue).toFixed(getPrecision(item.baseValue) - 1.0);
        const numV = parseFloat((inventory / perValue).toFixed(1));
        const completion = Math.min(1, inventory / calculateValue(item.baseValue));
  
        // Track completion for this table
        tableCompletion += completion;
        itemCount++;
  
        if (layerName.includes("Rare")) {
          rareTotal += numV;
        } else if (layerName.includes("Unique")) {
          uniqueTotal += numV;
        } else {
          layerTotal += numV;
        }
        grandTotal += numV;
      });
  
      // Calculate average completion for this table (capped at 100%)
      const tableAvgCompletion = itemCount > 0 ? (tableCompletion / itemCount) : 0;
      tableCompletions.push(Math.min(1, tableAvgCompletion));
    });
  
    // Calculate overall average of table averages (still capped at 100%)
    const avgCompletion = tableCompletions.length > 0 
      ? (tableCompletions.reduce((sum, comp) => sum + comp, 0) / tableCompletions.length) * 100
      : 0;
  
    return {
      rareTotal,
      uniqueTotal,
      layerTotal,
      grandTotal,
      avgCompletion: Math.min(100, avgCompletion).toFixed(3),
      totalOres
    };
  };

  // Function to handle dropdown selection
  const handleTableSelect = (e) => {
    const tableId = e.target.value;
    if (tableId) {
      const element = document.getElementById(tableId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Back to Top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Handle back-to-top displaying
  const [showBackToTop, setShowBackToTop] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch the total values object
  const totals = calculateGrandTotals();

  return (
    <div className="container">
      {/* Header Section */}
      <header className="header">
        {/* Quick Summary of global info */}
        <div className="quick-summary">
          <h2>Quick Summary</h2>
          <p>❑ Total Ores: <span className="placeholder">{totals.totalOres.toLocaleString()}</span></p>
          <p>
            ❑ {currentMode === 1 ? "Rare NVs" :
            currentMode === 2 ? "Rare UVs" :
            currentMode === 3 ? "Rare TVs" : "Rare SVs"}
            : <span className="placeholder">{totals.rareTotal.toLocaleString()}</span>
          </p>
          <p>
            ❑ {currentMode === 1 ? "Unique NVs" :
            currentMode === 2 ? "Unique UVs" :
            currentMode === 3 ? "Unique TVs" : "Unique SVs"}
            : <span className="placeholder">{totals.uniqueTotal.toLocaleString()}</span>
          </p>
          <p>
            ❑ {currentMode === 1 ? "Layer NVs" :
            currentMode === 2 ? "Layer UVs" :
            currentMode === 3 ? "Layer TVs" : "Layer SVs"}
            : <span className="placeholder">{totals.layerTotal.toLocaleString()}</span>
          </p>
          <p>
            ❑ {currentMode === 1 ? "Grand Total NV" :
            currentMode === 2 ? "Grand Total UV" :
            currentMode === 3 ? "Grand Total TV" : "Grand Total SV"}
            : <span className="placeholder">{totals.grandTotal.toLocaleString()}</span>
          </p>
          <p>
            ❑ {currentMode === 1 ? "Total NV Completion" :
            currentMode === 2 ? "Total UV Completion" :
            currentMode === 3 ? "Total TV Completion" : "Total SV Completion"}
            : <span className="placeholder">{totals.avgCompletion}%</span>
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
      <h1>Current Values: <span className='placeholder'>{isJohnValues ? "John's Values" : "NAN's Values"}</span></h1>
      <h2>
        Current Mode:<span className='placeholder'>{" "}
        {currentMode === 1 ? "NV" 
         : currentMode === 2 ? "UV" 
         : currentMode === 3 ? "TV"
         : "SV"}
         </span>
      </h2>

      {/* Value buttons */}
      <div className="button-container">
        <div className="box-button">
          <button onClick={() => setIsJohnValues(true)}>
            <span>John Values</span>
          </button>
        </div>
        <div className="box-button">
          <button onClick={() => setIsJohnValues(false)}>
            <span>NAN Values</span>
          </button>
        </div>
      </div>

      {/* Mode switching buttons */}
      <div className="button-container" style={{flexDirection: 'row', flexWrap: 'wrap'}}>
        <div className="box-button">
          <button onClick={() => setCurrentMode(2)}>
            <span>UV Mode</span>
          </button>
        </div>
        <div className="box-button">
          <button onClick={() => setCurrentMode(1)}>
            <span>NV Mode</span>
          </button>
        </div>
        <div className="box-button">
          <button onClick={() => setCurrentMode(3)}>
            <span>TV Mode</span>
          </button>
        </div>
        <div className="box-button">
          <button onClick={() => setCurrentMode(4)}>
            <span>SV Mode</span>
          </button>
        </div>
      </div>

      {/* Back to Top button */}
      {showBackToTop && (
        <div className="box-button" style={{position: 'fixed', bottom: '20px', right: '20px'}}>
          <button onClick={scrollToTop}>
            <span>↑ Back to Top</span>
          </button>
        </div>
      )}

      {/* Dropdown navigation */}
      <div className="table-navigation">
        <label htmlFor="table-select">Jump to Table: </label>
        <select 
          id="table-select" 
          onChange={handleTableSelect}
          defaultValue=""
        >
          <option value="" disabled>Select a table...</option>
          {tableNames.map(name => (
            <option key={name} value={name.replace(/\s+/g, '-')}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {/* Tables Section - modified to include IDs */}
      <div className="tables-container">
        {Object.entries(isJohnValues ? johnValsDict : nanValsDict).map(([layerName, layerData]) => {
          const gradientKey = Object.keys(LayerGradients).find(key => layerName.includes(key));
          const gradientStyle = gradientKey 
            ? LayerGradients[gradientKey].background 
            : 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)';

          return (
            <div id={layerName.replace(/\s+/g, '-')} key={layerName}>
              <TableComponent
                data={layerData}
                title={layerName}
                currentMode={currentMode}
                csvData={csvData}
                gradient={gradientStyle}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ValueChart;