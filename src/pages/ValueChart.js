// Value Chart page. Provides functionality below:
/*
    - Dynamically switch between UV (10x AV), NV (100x AV) and SV (1000x AV)
    - Switch between John and NAN's values (based off the dictionaries)
*/

import React, { useState, useContext, useEffect, useCallback } from 'react';
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
  // Import CSV data to ensure persistency
  const { csvData } = useContext(CSVContext);
  // Display mode state | 1:AV, 2:UV, 3:NV, 4:TV, 5:SV
  const [currentMode, setCurrentMode] = useState(3); // 
  const [isJohnValues, setIsJohnValues] = useState(false);
  // UI control states
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [moreStats, setMoreStats] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  // Draggable summary states
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y
    });
  }, [isDragging, dragOffset]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // List of table names for the dropdown
  const tableNames = Object.keys(isJohnValues ? johnValsDict : nanValsDict);

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

  // Get the correct precision dynamically
  const getPrecision = (number) => {
    if (typeof number !== 'number' || Number.isInteger(number)) return 1;
    const decimalPart = number.toString().split('.')[1];
    return decimalPart ? decimalPart.length : 0;
  };

  const modeStr = currentMode === 1 ? "AV" :
                  currentMode === 2 ? "UV" :
                  currentMode === 3 ? "NV" :
                  currentMode === 4 ? "TV" : 
                  currentMode === 5 ? "SV" : "BAD";

  // Calculate quick summary info
  // 1. Calculate base totals (without exclusions)
  const calculateBaseTotals = () => {
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
        const perValue = calculateValue(item.baseValue).toFixed(getPrecision(item.baseValue));
        const numV = parseFloat((inventory / perValue).toFixed(1));
        const completion = Math.min(1, inventory / calculateValue(item.baseValue));

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

      const tableAvgCompletion = itemCount > 0 ? (tableCompletion / itemCount) : 0;
      tableCompletions.push(Math.min(1, tableAvgCompletion));
    });

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

  // 2. Calculate min/max info (with exclusions)
  const calculateExtremes = () => {
    const excludedOres = ['Stone', 'Grimstone'];
    const excludedLayers = ['Rares', 'Uniques', 'Compounds', 'Surface / Shallow'];

    let minLayer = { value: Infinity, name: '', ore: '' };
    let maxLayer = { value: -Infinity, name: '', ore: '' };
    let minOre = { value: Infinity, name: '', layer: '' };
    let maxOre = { value: -Infinity, name: '', layer: '' };
    const layerValues = {};

    Object.entries(isJohnValues ? johnValsDict : nanValsDict).forEach(([layerName, layerData]) => {
      if (excludedLayers.includes(layerName)) return;

      let layerSum = 0;
      layerData.forEach(item => {
        if (excludedOres.includes(item.name)) return;

        const inventory = csvData[item.name] || 0;
        const numV = parseFloat((inventory / calculateValue(item.baseValue)).toFixed(1));

        // Track individual ores
        if (numV < minOre.value) {
          minOre = { value: numV, name: item.name, layer: layerName };
        }
        if (numV > maxOre.value) {
          maxOre = { value: numV, name: item.name, layer: layerName };
        }

        layerSum += numV;
      });

      layerValues[layerName] = layerSum;

      // Track layers
      if (layerSum < minLayer.value) {
        minLayer = { value: layerSum, name: layerName };
      }
      if (layerSum > maxLayer.value) {
        maxLayer = { value: layerSum, name: layerName };
      }
    });

    const handleDefault = (obj) => obj.value === Infinity || obj.value === -Infinity 
      ? { ...obj, value: 0, name: 'N/A' } 
      : obj;

    return {
      minLayer: handleDefault(minLayer),
      maxLayer: handleDefault(maxLayer),
      minOre: handleDefault(minOre),
      maxOre: handleDefault(maxOre)
    };
  };

  // 3. Combined function
  const calculateGrandTotals = () => {
    const baseTotals = calculateBaseTotals();
    const extremes = calculateExtremes();

    return {
      ...baseTotals,
      ...extremes,
      excluded: {
        ores: ['Stone', 'Grimstone'],
        layers: ['Rares', 'Uniques', 'Compounds', 'Surface / Shallow']
      }
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
    <div className="outer-frame">
      {/* Quick Summary Dropdown */}
      <div 
      className={`quick-summary ${isSummaryOpen ? 'open' : ''}`}
      style={{
        transform: `scale(0.8) translate(${position.x}px, ${position.y}px)`,
        left: '50px',
        top: '-10px'
      }}
      onMouseDown={handleMouseDown}
    >
      <div 
          className="summary-header"
          onClick={() => setIsSummaryOpen(!isSummaryOpen)}
        > 
          <h2>Quick Summary</h2>
          <span className={`dropdown-arrow ${isSummaryOpen ? 'open' : ''}`}>⛛</span>
      </div>
      {isSummaryOpen && (
        <div className="summary-content">
          <p>❑ Total Ores: <span className="placeholder">{totals.totalOres.toLocaleString()}
              </span></p>
          <p>❑ Rare {modeStr}: <span className="placeholder">{totals.rareTotal.toLocaleString()}
              </span></p>
          <p>❑ Unique {modeStr}: <span className="placeholder">{totals.uniqueTotal.toLocaleString()}
              </span></p>
          <p>❑ Layer {modeStr}: <span className="placeholder">{totals.layerTotal.toLocaleString()}
              </span></p>
          <p>❑ Grand Total {modeStr}: <span className="placeholder">{totals.grandTotal.toLocaleString()}
              </span></p>
          <p>❑ Total {modeStr} Completion: <span className="placeholder">{totals.avgCompletion}%
              </span></p>
          {moreStats && (
          <>
            <p>❑ Highest Value (Layer): 
              <p><span className="placeholder">
                {totals.maxLayer.name} ({totals.maxLayer.value.toLocaleString()} {modeStr})
              </span></p>
            </p>
            <p>❑ Lowest Value (Layer): 
              <p><span className="placeholder">
                {totals.minLayer.name} ({totals.minLayer.value.toLocaleString()} {modeStr})
              </span></p>
            </p>
            <p>❑ Highest Value (Ore): 
              <p><span className="placeholder">
                {totals.maxOre.name} ({totals.maxOre.value.toLocaleString()} {modeStr})
              </span></p>
            </p>
            <p>❑ Lowest Value (Ore): 
              <p><span className="placeholder">
                {totals.minOre.name} ({totals.minOre.value.toLocaleString()} {modeStr})
              </span></p>
            </p>
          </>
          )}
        </div>
      )}
    </div>
      <div className="container">
        {/* Header Section */}
        <header className="header">
          <nav>
            <ul>
              <li><Link to="/">Back to Home Page</Link></li>
              <li><Link to="/tradetool">Trade Tool</Link></li>
              <li><Link to="/csvloader">CSV Loader</Link></li>
            </ul>
          </nav>
        </header>
        {/* Value buttons */}
        <div className="button-container" style={{flexDirection: 'row'}}>
        <div className="box-button">
          <button 
            onClick={() => setMoreStats(!moreStats)}
            className={moreStats ? "color-template-dystranum active" : ""}
            aria-pressed={moreStats && isSummaryOpen}
          >
            <span>More Stats {moreStats ? '▲' : '▼'}</span>
          </button>
        </div>
          <div className="box-button">
            <button 
              onClick={() => setIsJohnValues(true)}
              className={isJohnValues ? "color-template-rhylazil" : ""}
            ><span>John Values</span>
            </button>
          </div>
          <div className="box-button">
            <button 
              onClick={() => setIsJohnValues(false)}
              className={isJohnValues === false ? "color-template-diamond" : ""}
            ><span>NAN Values</span>
            </button>
          </div>
        </div>

        {/* Mode Selection Buttons */}
        <div className="button-container" style={{flexDirection: 'row', flexWrap: 'wrap'}}>
          {[
            { mode: 1, className: "color-template-ambrosine", label: "AV Mode" },
            { mode: 2, className: "color-template-universallium", label: "UV Mode" },
            { mode: 3, className: "color-template-neutrine", label: "NV Mode" },
            { mode: 4, className: "color-template-torn-fabric", label: "TV Mode" },
            { mode: 5, className: "color-template-singularity", label: "SV Mode" }
          ].map(({ mode, className, label }) => (
            <div className="box-button" key={mode}>
              <button 
                onClick={() => setCurrentMode(mode)}
                className={currentMode === mode ? className : ""}
              >
                <span>{label}</span>
              </button>
            </div>
          ))}
        </div>

        {/* Back to Top button */}
        {showBackToTop && (
          <div className="box-button" style={{
            position: 'fixed',
            bottom: '15px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: '1000'
          }}>
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

        {/* Tables Section */}
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
    </div>
  );
}

export default ValueChart;