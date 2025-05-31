// Value Chart page. Provides functionality below:
/*
    - Dynamically switch between UV (10x AV), NV (100x AV) and SV (1000x AV)
    - and more
    - Switch between John and NAN's values (based off the dictionaries)
    - Users can copy search filters of all ores in the layer
    - Display various global and layer-specific stats
*/

import React, { useState, useContext, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { MiscContext } from "../context/MiscContext";

import LayerTable from "../components/LayerTable";
import NavBar from "../components/NavBar";
import ValueModeSelector from "../components/ValueModeSelector";
import CustomMultiplierInput from "../components/CustomMultiplierInput";

import { johnValsDict } from "../data/JohnVals";
import { nanValsDict } from "../data/NANVals";
import { LayerGradients } from "../data/LayerGradients";
import searchFilters from "../data/SearchFilters";

import "../styles/ValueChart.css";
import "../styles/LayerTable.css";
import "../styles/AllGradients.css";

function ValueChart() {
  // Import CSV data to ensure persistency
  const {
    csvData,
    currentMode,
    setCurrentMode,
    customMultiplier,
    valueMode,
    setValueMode,
    customDict,
    setCustomDict,
    updateCustomDict
  } = useContext(MiscContext);

  const navigate = useNavigate();

  // Toggle between three value modes: john, nan, & custom
  const toggleValueMode = (mode) => {
    if (mode === "custom" && !customDict) {
      setShowCustomModal(true);
    } else {
      setValueMode(mode);
    }
  };

  const currentDict =
    valueMode === "john"
      ? johnValsDict
      : valueMode === "nan"
      ? nanValsDict
      : customDict;

  // UI control states
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [moreStats, setMoreStats] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  // Draggable summary states
  // State and handlers
  const [dragState, setDragState] = useState({
    isDragging: false,
    position: { x: 90, y: 10 },
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
  const tableNames = Object.keys(johnValsDict);

  const calculateValue = (baseValue) => {
    switch (currentMode) {
      case 1:
        return baseValue; // AV
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
      case 7:
        return baseValue * customMultiplier; // Custom value (AV #)
      default:
        return baseValue; // Default to AV
    }
  };

  // Get the correct precision dynamically
  const getPrecision = (number) => {
    if (typeof number !== "number" || Number.isInteger(number)) return 1;
    const decimalPart = number.toString().split(".")[1];
    return decimalPart ? decimalPart.length : 0;
  };
  // Bool for NVs
  const isNV = customMultiplier % 100 === 0;
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
      : !isNV && currentMode === 7
      ? "CV"
      : isNV && currentMode === 7
      ? `${customMultiplier / 100}NV`
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

    Object.entries(currentDict).forEach(([layerName, layerData]) => {
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
        if (layerName.includes("True Rares") || layerName.includes("Rares")) {
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
    });
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
      "True Rares",
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

    Object.entries(currentDict).forEach(([layerName, layerData]) => {
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
    });

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

  // Custom value mode states
  const [showCustomModal, setShowCustomModal] = useState(false);
  // const [customDictSource] = useState(null); // 'john' or 'nan'

  // Initialize custom dict
  const initializeCustomDict = (source) => {
    const newCustomDict =
      source === "john"
        ? JSON.parse(JSON.stringify(johnValsDict))
        : JSON.parse(JSON.stringify(nanValsDict));
    setCustomDict(newCustomDict);
    setCurrentMode("custom");
    setShowCustomModal(false);
  };

  // Function to export the custom dict
  /*
  const exportCustomDict = () => {
    if (!customDict) return;
    const dataStr = JSON.stringify(customDict, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `custom_values_${customDictSource}_${new Date()
      .toISOString()
      .slice(0, 10)}.json`;
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };
  */

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
              ⛏ Total Ores:{" "}
              <span className="placeholder">
                {totals.totalOres.toLocaleString()}
              </span>
            </p>
            <p>
              ⛏ Total Rare {modeStr}:{" "}
              <span className="placeholder">
                {totals.rareTotal.toLocaleString()}
              </span>
            </p>
            <p>
              ⛏ Unique {modeStr}:{" "}
              <span className="placeholder">
                {totals.uniqueTotal.toLocaleString()}
              </span>
            </p>
            <p>
              ⛏ Layer {modeStr}:{" "}
              <span className="placeholder">
                {totals.layerTotal.toLocaleString()}
              </span>
            </p>
            <p>
              ⛏ Grand Total {modeStr}:{" "}
              <span className="placeholder">
                {totals.grandTotal.toLocaleString()}
              </span>
            </p>
            <p>
              ⛏ Total {modeStr} Completion:{" "}
              <span className="placeholder">{totals.avgCompletion}%</span>
            </p>
            {moreStats && (
              <>
                <p>
                  ⮝ Highest Value (Layer):
                  <p>
                    <span className="placeholder">
                      {totals.maxLayer.name} (
                      {totals.maxLayer.value.toLocaleString()} {modeStr})
                    </span>
                  </p>
                </p>
                <p>
                  ⮟ Lowest Value (Layer):
                  <p>
                    <span className="placeholder">
                      {totals.minLayer.name} (
                      {totals.minLayer.value.toLocaleString()} {modeStr})
                    </span>
                  </p>
                </p>
                <p>
                  ⮝ Highest Value (Ore):
                  <p>
                    <span className="placeholder">
                      {totals.maxOre.name} (
                      {totals.maxOre.value.toLocaleString()} {modeStr})
                    </span>
                  </p>
                </p>
                <p>
                  ⮟ Lowest Value (Ore):
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
      <div>
        <NavBar />
      </div>
      <div className="container">
        {/* Value buttons */}
        <div
          className="button-container"
          style={{
            flexDirection: "row",
          }}
        >
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
              onClick={() => toggleValueMode("john")}
              className={valueMode === "john" ? "color-template-pout" : ""}
            >
              <span>John Values</span>
            </button>
          </div>
          <div className="box-button">
            <button
              onClick={() => toggleValueMode("nan")}
              className={valueMode === "nan" ? "color-template-diamond" : ""}
            >
              <span>NAN Values</span>
            </button>
          </div>
          <div className="box-button">
            <button
              onClick={() => {
                if (!customDict) {
                  // Initialize with John's values if none exists
                  const newDict = JSON.parse(JSON.stringify(johnValsDict));
                  setCustomDict(newDict);
                  setValueMode("custom");
                } else {
                  setValueMode("custom");
                }
              }}
              className={
                valueMode === "custom" ? "color-template-havicron active" : ""
              }
            >
              <span>Custom</span>
            </button>
          </div>

          {valueMode === "custom" && customDict && (
            <>
              <div className="box-button">
              <button onClick={() => {
                const updated = updateCustomDict();
                if (updated) {
                  alert("Custom values successfully updated with new ores!");
                } else {
                  alert("No new ores found - your custom values are already up to date.");
                }
              }}>
                <span> [ Update ] </span>
              </button>
            </div>
            <div className="box-button">
              <button onClick={() => navigate("/customvalues")}>
                <span>Customize</span>
              </button>
            </div>
            </>
          )}
        </div>
        {/* Mode selection buttons */}
        <ValueModeSelector
          currentMode={currentMode}
          setCurrentMode={setCurrentMode}
        />
        <CustomMultiplierInput />
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

        {/* Custom mode starting overlay for empty data */}
        {showCustomModal && (
          <div className="custom-modal-overlay">
            <div className="custom-modal">
              <h3>Select Base Values</h3>
              <p>Choose which value set to use as a starting point:</p>
              <div className="modal-buttons">
                <button
                  onClick={() => initializeCustomDict("john")}
                  className="color-template-pout"
                >
                  John Values
                </button>
                <button
                  onClick={() => initializeCustomDict("nan")}
                  className="color-template-diamond"
                >
                  NAN Values
                </button>
              </div>
              <button
                onClick={() => setShowCustomModal(false)}
                className="modal-close"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Tables section */}
        {/* Makes use of the LayerTable component
            - Accounts for John/NAN vals
            - Finds the gradient key (color-template-oreName) and applies
            - Layer name is the header outside of the table in the wrapper
            - Layer data, name, mode, csv data, gradient, and search filter 
            is passed in
        */}
        <div className="tables-container">
          {Object.entries(currentDict).map(([layerName, layerData]) => {
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
                  customMultiplier={customMultiplier}
                  csvData={csvData}
                  gradient={gradientStyle}
                  searchFilters={searchFilters}
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
