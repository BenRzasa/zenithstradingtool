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
    getValueForMode,
    oreValsDict,
    setOreValsDict,
    capCompletion,
    setCapCompletion,
  } = useContext(MiscContext);

  const navigate = useNavigate();

  // Toggle between three value modes: john, nan, & custom
  const toggleValueMode = (mode) => {
    if (mode === "custom") {
      // Check if we need to initialize custom values
      const hasCustomValues = Object.values(oreValsDict).some(layer => 
        layer.some(ore => ore.customVal !== undefined)
      );
      if (!hasCustomValues) {
        setShowCustomModal(true);
      } else {
        setValueMode(mode);
      }
    } else {
      setValueMode(mode);
    }
  };

  // eslint-disable-next-line
  const [lastUpdatedDates, setLastUpdatedDates] = useState({
    zenith: 'June 21, 2025',
    nan: 'June 20, 2025',
    john: 'Jan 19, 2025',
  });

  // UI control states
  const [isSummaryOpen, setIsSummaryOpen] = useState(true);
  const [moreStats, setMoreStats] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  // Draggable summary states
  // State and handlers
  const [dragState, setDragState] = useState({
    isDragging: false,
    position: { x: 15, y: 10 },
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
  const tableNames = Object.keys(oreValsDict);

  const calculateValue = (ore) => {
    const baseValue = getValueForMode(ore);

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
      let calculatedOres = [];

      Object.entries(oreValsDict).forEach(([layerName, layerData]) => {
        let tableCompletion = 0;
        let itemCount = 0;

        layerData.forEach((ore) => {
          // Check if this ore name has already been calculated
          if(calculatedOres.includes(ore.name)) {
            return; // skip this iteration
          }

          // calculate the stats normally
          const inventory = csvData[ore.name] || 0;
          const oreValue = calculateValue(ore);
          const perValue = oreValue.toFixed(getPrecision(oreValue));
          const numV = parseFloat((inventory / perValue).toFixed(1));
          const completion = capCompletion
            ? Math.min(1, inventory / oreValue)
            : inventory / oreValue;

          tableCompletion += completion;
          itemCount++;

          if (layerName.includes("True Rares") || layerName.includes("Rares")) {
            rareTotal += numV;
          } else if (layerName.includes("Unique")) {
            uniqueTotal += numV;
          } else {
            layerTotal += numV;
          }
          grandTotal += numV;

          // Mark this ore as calculated
          calculatedOres.push(ore.name);
        });

        const tableAvgCompletion =
          itemCount > 0 ? tableCompletion / itemCount : 0;
        tableCompletions.push(capCompletion ? Math.min(1, tableAvgCompletion) : tableAvgCompletion);
      });

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
        avgCompletion: capCompletion ? Math.min(100, avgCompletion).toFixed(3) : avgCompletion.toFixed(3),
        totalOres,
      };
    };
  // 2. Calculate min/max info (with exclusions)
  const calculateExtremes = () => {
    // Exclude outlier layers & ores
    const excludedOres = ["Stone", "Grimstone"];
    const excludedLayers = [
      "True Rares\n1/25000 or Rarer",
      "Rares\nMore Common Than 1/24999",
      "Uniques\nNon-Standard Obtainment",
      "Compounds\nCrafted via Synthesis",
      "Surface / Shallow\n[0m-74m]"
    ];

    let minLayer = { value: Infinity, name: "", ore: "" };
    let maxLayer = { value: -Infinity, name: "", ore: "" };
    let minOre = { value: Infinity, name: "", layer: "" };
    let maxOre = { value: -Infinity, name: "", layer: "" };
    const layerValues = {};

    Object.entries(oreValsDict).forEach(([layerName, layerData]) => {
      if (excludedLayers.includes(layerName)) return;

      let layerSum = 0;
      layerData.forEach((ore) => {
        if (excludedOres.includes(ore.name)) return;
        const inventory = csvData[ore.name] || 0;
        const oreValue = calculateValue(ore);
        const numV = parseFloat(
          (inventory / oreValue).toFixed(1)
        );
        // Track individual ores
        if (numV < minOre.value) {
          minOre = { value: numV, name: ore.name, layer: layerName };
        }
        if (numV > maxOre.value) {
          maxOre = { value: numV, name: ore.name, layer: layerName };
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
        layers:
          [
            "True Rares\n1/25000 or Rarer",
            "Rares\nMore Common Than 1/24999",
            "Uniques\nNon-Standard Obtainment", 
            "Compounds\nCrafted via Synthesis", 
            "Surface / Shallow\n[0m-74m]"],
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

  // Initialize custom dict
  const initializeCustomValues = (source) => {
      const newOreVals = JSON.parse(JSON.stringify(oreValsDict)); // Deep copy
      for (const layerName in newOreVals) {
        newOreVals[layerName] = newOreVals[layerName].map(ore => {
          let newValue;
          switch (source) {
            case 'john': newValue = ore.johnVal; break;
            case 'nan': newValue = ore.nanVal; break;
            default: newValue = ore.zenithVal; // 'zenith' is default
          }
          return {
            ...ore,
            customVal: newValue
          };
        });
      }
      setOreValsDict(newOreVals);
      setValueMode('custom');
      setShowCustomModal(false);
    };

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
      <div
        className="v-usage"
        style={{
          position:"absolute",
          left:"0px",
          top:"90px",
          width:"25%",
          fontSize:"18px",
        }}
      >
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
              onClick={() => setCapCompletion(!capCompletion)}
              className={!capCompletion ? "color-template-rainbonite active" : ""}
            >
              <span>{modeStr}% {capCompletion ? "Capped" : "Uncapped"}</span>
              <div className="v-last-updated">Toggle 100% max</div>
            </button>
          </div>
          <div className="box-button">
            <button
              onClick={() => {
                const newState = !moreStats;
                setMoreStats(newState);
                if (!isSummaryOpen) {
                  setIsSummaryOpen(newState);
                }
              }}
              className={moreStats ? "color-template-dystranum active" : ""}
              aria-pressed={moreStats && isSummaryOpen}
            >
              <span>More Stats {moreStats ? "▲" : "▼"}</span>
              <div className="v-last-updated">Click for fun info!</div>
            </button>
          </div>
          <div className="box-button">
            <button
              onClick={() => toggleValueMode("zenith")}
              className={valueMode === "zenith" ? "color-template-torn-fabric" : ""}
            >
              <span>Zenith Vals</span>
              <div className="v-last-updated">Updated {lastUpdatedDates.zenith}</div>
            </button>
          </div>
          <div className="box-button">
            <button
              onClick={() => toggleValueMode("nan")}
              className={valueMode === "nan" ? "color-template-diamond" : ""}
            >
              <span>NAN Vals</span>
              <div className="v-last-updated">Updated {lastUpdatedDates.nan}</div>
            </button>
          </div>
          <div className="box-button">
            <button
              onClick={() => toggleValueMode("john")}
              className={valueMode === "john" ? "color-template-pout" : ""}
            >
              <span>John Vals</span>
              <div className="v-last-updated">Updated {lastUpdatedDates.john}</div>
            </button>
          </div>

          <div className="box-button">
            <button
              onClick={() => {toggleValueMode("custom")}}
              className={
                valueMode === "custom" ? "color-template-havicron" : ""
              }
            >
              <span>Custom</span>
              <div className="v-last-updated">Personal values</div>
            </button>
          </div>

          {valueMode === "custom" && (
            <div className="box-button">
              <button onClick={() => navigate("/customvalues")}>
                <span>Modify</span>
                <div className="v-last-updated">Change values</div>
              </button>
            </div>
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
                  onClick={() => initializeCustomValues("zenith")}
                  className="color-template-torn-fabric"
                >
                  Zenith Vals
                </button>
                <button
                  onClick={() => initializeCustomValues("nan")}
                  className="color-template-diamond"
                >
                  NAN Vals
                </button>
                <button
                  onClick={() => initializeCustomValues("john")}
                  className="color-template-pout"
                >
                  John Vals
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
          {Object.entries(oreValsDict).map(([layerName, layerData]) => {
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
                  valueMode={valueMode}
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
