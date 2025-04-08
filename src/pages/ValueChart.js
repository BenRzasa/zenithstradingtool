// Value Chart page. Provides functionality below:
/*
    - Dynamically switch between UV (10x AV), NV (100x AV) and SV (1000x AV)
    - Switch between John and NAN's values (based off the dictionaries)
    - Users can copy search filters of all ores in the layer
    - Display various global and layer-specific stats
*/

import React, { useState, useContext, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { CSVContext } from "../context/CSVContext";
import LayerTable from "../components/LayerTable";
import { johnValsDict } from "../components/JohnVals";
import { nanValsDict } from "../components/NANVals";
import { LayerGradients } from "../components/LayerGradients";
import searchFilters from "../components/SearchFilters";

import "../styles/ValueChart.css";
import "../styles/LayerTable.css";
import "../styles/AllGradients.css";

function ValueChart() {
  // Import CSV data to ensure persistency
  const {
    csvData,
    currentMode,
    setCurrentMode,
    isJohnValues,
    setIsJohnValues,
  } = useContext(CSVContext);

  const toggleJohnVals = (enableJohn) => {
    setIsJohnValues(enableJohn); // true for John, false for NAN
  };

  // UI control states
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [moreStats, setMoreStats] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  // Draggable summary states
  // State and handlers
  const [dragState, setDragState] = useState({
    isDragging: false,
    position: { x: 115, y: 20 },
    clickOffset: { x: 0, y: 0 },
  });

  // Mouse drag handlers
  const handleMouseDown = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setDragState({
      isDragging: true,
      position: { x: rect.left, y: rect.top },
      clickOffset: {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      },
    });
    e.stopPropagation();
    e.preventDefault();
  };

  const handleMouseMove = useCallback(
    (e) => {
      if (!dragState.isDragging) return;
      setDragState((prev) => ({
        ...prev,
        position: {
          x: e.clientX - prev.clickOffset.x,
          y: e.clientY - prev.clickOffset.y,
        },
      }));
    },
    [dragState.isDragging]
  );

  const handleMouseUp = useCallback(() => {
    setDragState((prev) => ({ ...prev, isDragging: false }));
  }, []);

  // Set up event listeners
  useEffect(() => {
    if (dragState.isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [dragState.isDragging, handleMouseMove, handleMouseUp]);

  // List of table names for the dropdown
  const tableNames = Object.keys(isJohnValues ? johnValsDict : nanValsDict);

  const calculateValue = (baseValue) => {
    switch (currentMode) {
      case 1:
        return baseValue * 1; // AV
      case 2:
        return baseValue * 10; // UV
      case 3:
        return baseValue * 100; // NV
      case 4:
        return baseValue * 500; // TV
      case 5:
        return baseValue * 1000; // SV
      case 6:
        return baseValue * 50; // RV
      default:
        return baseValue;
    }
  };

  // Get the correct precision dynamically
  const getPrecision = (number) => {
    if (typeof number !== "number" || Number.isInteger(number)) return 1;
    const decimalPart = number.toString().split(".")[1];
    return decimalPart ? decimalPart.length : 0;
  };

  // For displaying the current mode dynamically
  const modeStr =
    currentMode === 1
      ? "AV"
      : currentMode === 2
      ? "UV"
      : currentMode === 3
      ? "NV"
      : currentMode === 4
      ? "TV"
      : currentMode === 5
      ? "SV"
      : currentMode === 6
      ? "RV"
      : "BAD";

  // Calculate quick summary info
  // 1. Calculate base totals (without exclusions)
  const calculateBaseTotals = () => {
    let rareTotal = 0;
    let uniqueTotal = 0;
    let layerTotal = 0;
    let grandTotal = 0;
    let totalOres = Object.values(csvData).reduce((acc, val) => acc + val, 0);
    let tableCompletions = [];

    Object.entries(isJohnValues ? johnValsDict : nanValsDict).forEach(
      ([layerName, layerData]) => {
        let tableCompletion = 0;
        let itemCount = 0;
        // For each layer, calculate its totals
        layerData.forEach((item) => {
          const inventory = csvData[item.name] || 0;
          const perValue = calculateValue(item.baseValue).toFixed(
            getPrecision(item.baseValue)
          );
          const numV = parseFloat((inventory / perValue).toFixed(1));
          const completion = Math.min(
            1,
            inventory / calculateValue(item.baseValue)
          );
          // Update the ore count and table total completion
          tableCompletion += completion;
          itemCount++;
          // Track rare & unique totals individually
          if (layerName.includes("Rare")) {
            rareTotal += numV;
          } else if (layerName.includes("Unique")) {
            uniqueTotal += numV;
          } else {
            layerTotal += numV;
          }
          grandTotal += numV;
        });
        // Calculate the avg completion for one table
        const tableAvgCompletion =
          itemCount > 0 ? tableCompletion / itemCount : 0;
        tableCompletions.push(Math.min(1, tableAvgCompletion));
      }
    );
    // Calculate the average completion percentage from all layers
    const avgCompletion =
      tableCompletions.length > 0
        ? (tableCompletions.reduce((sum, comp) => sum + comp, 0) /
            tableCompletions.length) *
          100
        : 0;

    return {
      rareTotal,
      uniqueTotal,
      layerTotal,
      grandTotal,
      avgCompletion: Math.min(100, avgCompletion).toFixed(3),
      totalOres,
    };
  };

  // 2. Calculate min/max info (with exclusions)
  const calculateExtremes = () => {
    // Exclude outlier layers & ores
    const excludedOres = ["Stone", "Grimstone"];
    const excludedLayers = [
      "Rares",
      "Uniques",
      "Compounds",
      "Surface / Shallow",
    ];

    let minLayer = { value: Infinity, name: "", ore: "" };
    let maxLayer = { value: -Infinity, name: "", ore: "" };
    let minOre = { value: Infinity, name: "", layer: "" };
    let maxOre = { value: -Infinity, name: "", layer: "" };
    const layerValues = {};

    Object.entries(isJohnValues ? johnValsDict : nanValsDict).forEach(
      ([layerName, layerData]) => {
        if (excludedLayers.includes(layerName)) return;

        let layerSum = 0;
        layerData.forEach((item) => {
          if (excludedOres.includes(item.name)) return;
          const inventory = csvData[item.name] || 0;
          const numV = parseFloat(
            (inventory / calculateValue(item.baseValue)).toFixed(1)
          );
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
      }
    );
    // Just in case, handle nonexistent/wrong data
    const handleDefault = (obj) =>
      obj.value === Infinity || obj.value === -Infinity
        ? { ...obj, value: 0, name: "N/A" }
        : obj;

    return {
      minLayer: handleDefault(minLayer),
      maxLayer: handleDefault(maxLayer),
      minOre: handleDefault(minOre),
      maxOre: handleDefault(maxOre),
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
        ores: ["Stone", "Grimstone"],
        layers: ["Rares", "Uniques", "Compounds", "Surface / Shallow"],
      },
    };
  };

  // Function to handle dropdown selection
  const handleTableSelect = (e) => {
    const tableId = e.target.value;
    if (tableId) {
      const element = document.getElementById(tableId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // Back to Top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Handle back-to-top displaying
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch the total values object
  const totals = calculateGrandTotals();

  // Main page layout
  return (
    <div className="outer-frame">
      {/* Quick Summary Dropdown */}
      <div
        className={`quick-summary ${isSummaryOpen ? "open" : ""} ${
          dragState.isDragging ? "dragging" : ""
        }`}
        style={{
          left: `${dragState.position.x}px`,
          top: `${dragState.position.y}px`,
          transform: `scale(${isSummaryOpen ? 1 : 0.8})`,
        }}
        onMouseDown={handleMouseDown}
      >
        <div
          className="summary-header"
          onClick={() => setIsSummaryOpen(!isSummaryOpen)} // Click handler for toggle
        >
          <h2>Quick Summary</h2>
          <span className={`dropdown-arrow ${isSummaryOpen ? "open" : ""}`}>
            ⛛
          </span>
        </div>
        {isSummaryOpen && (
          <div className="summary-content">
            <p>
              ❑ Total Ores:{" "}
              <span className="placeholder">
                {totals.totalOres.toLocaleString()}
              </span>
            </p>
            <p>
              ❑ Rare {modeStr}:{" "}
              <span className="placeholder">
                {totals.rareTotal.toLocaleString()}
              </span>
            </p>
            <p>
              ❑ Unique {modeStr}:{" "}
              <span className="placeholder">
                {totals.uniqueTotal.toLocaleString()}
              </span>
            </p>
            <p>
              ❑ Layer {modeStr}:{" "}
              <span className="placeholder">
                {totals.layerTotal.toLocaleString()}
              </span>
            </p>
            <p>
              ❑ Grand Total {modeStr}:{" "}
              <span className="placeholder">
                {totals.grandTotal.toLocaleString()}
              </span>
            </p>
            <p>
              ❑ Total {modeStr} Completion:{" "}
              <span className="placeholder">{totals.avgCompletion}%</span>
            </p>
            {moreStats && (
              <>
                <p>
                  ❑ Highest Value (Layer):
                  <p>
                    <span className="placeholder">
                      {totals.maxLayer.name} (
                      {totals.maxLayer.value.toLocaleString()} {modeStr})
                    </span>
                  </p>
                </p>
                <p>
                  ❑ Lowest Value (Layer):
                  <p>
                    <span className="placeholder">
                      {totals.minLayer.name} (
                      {totals.minLayer.value.toLocaleString()} {modeStr})
                    </span>
                  </p>
                </p>
                <p>
                  ❑ Highest Value (Ore):
                  <p>
                    <span className="placeholder">
                      {totals.maxOre.name} (
                      {totals.maxOre.value.toLocaleString()} {modeStr})
                    </span>
                  </p>
                </p>
                <p>
                  ❑ Lowest Value (Ore):
                  <p>
                    <span className="placeholder">
                      {totals.minOre.name} (
                      {totals.minOre.value.toLocaleString()} {modeStr})
                    </span>
                  </p>
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
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/tradetool">Trade Tool</Link>
              </li>
              <li>
                <Link to="/csvloader">CSV Loader</Link>
              </li>
              <li>
                <Link to="/misc">Miscellaneous</Link>
              </li>
            </ul>
          </nav>
        </header>
        {/* Value buttons */}
        <div className="button-container" style={{ flexDirection: "row" }}>
          {/* More stats button - expands quick summary & enables more info */}
          <div className="box-button">
            <button
              onClick={() => {
                const newState = !moreStats;
                setMoreStats(newState);
                setIsSummaryOpen(newState);
              }}
              className={moreStats ? "color-template-dystranum active" : ""}
              aria-pressed={moreStats && isSummaryOpen}
            >
              <span>More Stats {moreStats ? "▲" : "▼"}</span>
            </button>
          </div>
          <div className="box-button">
            <button
              onClick={() => toggleJohnVals(true)}
              className={isJohnValues ? "color-template-rhylazil" : ""}
            >
              <span>John Values</span>
            </button>
          </div>
          <div className="box-button">
            <button
              onClick={() => toggleJohnVals(false)}
              className={isJohnValues === false ? "color-template-diamond" : ""}
            >
              <span>NAN Values</span>
            </button>
          </div>
        </div>

        {/* Mode selection buttons */}
        {/* AV/UV/RV/NV/TV/SV */}
        <div
          className="val-button-container"
          style={{ flexDirection: "row", flexWrap: "wrap" }}
        >
          {[
            {
              mode: 1,
              className: "color-template-ambrosine",
              label: "AV Mode",
            },
            {
              mode: 2,
              className: "color-template-universallium",
              label: "UV Mode",
            },
            {
              mode: 6,
              className: "color-template-rhylazil",
              label: "RV Mode",
            },
            {
              mode: 3,
              className: "color-template-neutrine",
              label: "NV Mode" },
            {
              mode: 4,
              className: "color-template-torn-fabric",
              label: "TV Mode",
            },
            {
              mode: 5,
              className: "color-template-singularity",
              label: "SV Mode",
            }
            // Mapped to avoid more redundant code
            // Key is the mode, template has the mode number,
            // Class name (gradient template) & label (text)
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
          // Should probably move this styling into the css.
          // Just title it ".back-to-top"...
          <div
            className="box-button"
            style={{
              position: "fixed",
              bottom: "15px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: "1000",
            }}
          >
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
            <option value="" disabled>
              Select a table...
            </option>
            {/* Map all tables/layers to the results based on the names */}
            {tableNames.map((name) => (
              <option key={name} value={name.replace(/\s+/g, "-")}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* Tables section */}
        {/* Makes use of the LayerTable component
            - Accounts for John/NAN vals
            - Finds the gradient key (color-template-oreName) and applies
            - Layer name is the header outside of the table in the wrapper
            - Layer data, name, mode, csv data, gradient, and search filter is passed in
        */}
        <div className="tables-container">
          {Object.entries(isJohnValues ? johnValsDict : nanValsDict).map(
            ([layerName, layerData]) => {

              const gradientKey = Object.keys(LayerGradients).find((key) =>
                layerName.includes(key)
              );

              const gradientStyle = gradientKey
                ? LayerGradients[gradientKey].background
                : "linear-gradient(90deg, #667eea 0%, #764ba2 100%)";

              return (
                <div id={layerName.replace(/\s+/g, "-")} key={layerName}>
                  <LayerTable
                    data={layerData}
                    title={layerName}
                    currentMode={currentMode}
                    csvData={csvData}
                    gradient={gradientStyle}
                    searchFilters={searchFilters}
                  />
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
}

export default ValueChart;
