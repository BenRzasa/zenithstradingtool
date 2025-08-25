import React, { useState, useContext, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { MiscContext } from "../context/MiscContext";

import { MiscValueFunctions } from "../components/MiscValueFunctions";
import LayerTable from "../components/LayerTable";
import NavBar from "../components/NavBar";
import CSVLoaderPopup from "../components/CSVLoaderPopup";
import SecondaryCSVPopup from "../components/SecondaryCSVPopup";

import { LayerGradients } from "../data/LayerGradients";
import searchFilters from "../data/SearchFilters";

import "../styles/ValueChart.css";
import "../styles/LayerTable.css";
import "../styles/AllGradients.css";

function ValueChart() {
  const {
    hotkeysEnabled,
    currentMode,
    customMultiplier,
    valueMode,
    setValueMode,
    getValueForMode,
    oreValsDict,
    setOreValsDict,
    capCompletion,
    secondaryCSVData,
    setSecondaryCSVData,
    useSecondaryCSV,
    setUseSecondaryCSV,
    getCurrentCSV,
  } = useContext(MiscContext);

  const allValues = MiscValueFunctions({
    csvData: getCurrentCSV(),
    currentMode,
    customMultiplier,
    valueMode,
    getValueForMode,
    oreValsDict,
    capCompletion,
  });

  const {
    rareTotal,
    uniqueTotal,
    layerTotal,
    grandTotal,
    avgCompletion,
    totalOres,
    minLayer,
    maxLayer,
    minOre,
    maxOre,
    incompleteOres,
  } = allValues;

  const navigate = useNavigate();
  const csvData = getCurrentCSV();

  const [showCSVLoader, setShowCSVLoader] = useState(false);
  const [showSecondaryCSVPopup, setShowSecondaryCSVPopup] = useState(false);
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);

  useEffect(() => {
    const csvData = getCurrentCSV();
    const hasData = Object.values(csvData).some((val) => val > 0);

    if (!hasData) {
      setShowCSVLoader(true);
    }
  }, [getCurrentCSV]);

  const toggleValueMode = (mode) => {
    if (mode === "custom") {
      const hasCustomValues = Object.values(oreValsDict).some((layer) =>
        layer.some((ore) => ore.customVal !== undefined)
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
    zenith: "Aug 24, 2025",
    nan: "Jul 19, 2025",
    john: "Jan 19, 2025",
  });

  // UI control states
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [moreStats, setMoreStats] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  // Draggable summary states
  // State and handlers
  const [dragState, setDragState] = useState({
    isDragging: false,
    position: { x: 15, y: 15 },
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

  const [tableSelected, setTableSelected] = useState("");
  // Function to handle dropdown selection
  const handleTableSelect = (e) => {
    let tableId = e.target.value;
    if (tableId) {
      const element = document.getElementById(tableId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        setTableSelected("");
      }
    }
  };

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

  // Custom value mode states
  const [showCustomModal, setShowCustomModal] = useState(false);

  // Initialize custom dict
  const initializeCustomValues = (source) => {
    const newOreVals = JSON.parse(JSON.stringify(oreValsDict));
    for (const layerName in newOreVals) {
      newOreVals[layerName] = newOreVals[layerName].map((ore) => {
        let newValue;
        switch (source) {
          case "john":
            newValue = ore.johnVal;
            break;
          case "nan":
            newValue = ore.nanVal;
            break;
          default:
            newValue = ore.zenithVal;
        }
        return {
          ...ore,
          customVal: newValue,
        };
      });
    }
    setOreValsDict(newOreVals);
    setValueMode("custom");
    setShowCustomModal(false);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if typing in an input/textarea or hotkeys disabled
      if (
        !hotkeysEnabled ||
        ["INPUT", "TEXTAREA", "SELECT"].includes(
          document.activeElement?.tagName
        )
      ) {
        return;
      }

      // Check for modifier keys (don't trigger if Ctrl/Alt/Shift/Meta is pressed)
      if (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey) return;

      switch (e.key.toLowerCase()) {
        case "c":
          setShowCSVLoader(!showCSVLoader);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hotkeysEnabled, showCSVLoader]);

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
          onClick={() => setIsSummaryOpen(!isSummaryOpen)}
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
              <span className="placeholder">{totalOres.toLocaleString()}</span>
            </p>
            <p>
              ⛏ Total Rare {modeStr}:{" "}
              <span className="placeholder">{rareTotal.toLocaleString()}</span>
            </p>
            <p>
              ⛏ Unique {modeStr}:{" "}
              <span className="placeholder">
                {uniqueTotal.toLocaleString()}
              </span>
            </p>
            <p>
              ⛏ Layer {modeStr}:{" "}
              <span className="placeholder">{layerTotal.toLocaleString()}</span>
            </p>
            <p>
              ⛏ Grand Total {modeStr}:{" "}
              <span className="placeholder">{grandTotal.toLocaleString()}</span>
            </p>
            <p>
              ⛏ Total {modeStr} Completion:{" "}
              <span className="placeholder">{avgCompletion.toFixed(3)}%</span>
            </p>
            {moreStats && (
              <>
                <p>
                  ⮝ Highest Value (Layer):
                  <div>
                    <span className="placeholder">
                      {maxLayer.name.substring(0, maxLayer.name.indexOf("\n"))}{" "}
                      ({maxLayer.value.toLocaleString()} {modeStr})
                    </span>
                  </div>
                </p>
                <p>
                  ⮟ Lowest Value (Layer):
                  <div>
                    <span className="placeholder">
                      {minLayer.name.substring(0, minLayer.name.indexOf("\n"))}{" "}
                      ({minLayer.value.toLocaleString()} {modeStr})
                    </span>
                  </div>
                </p>
                <p>
                  ⮝ Highest Value (Ore):
                  <div>
                    <span className="placeholder">
                      {maxOre.name} ({maxOre.value.toLocaleString()} {modeStr})
                    </span>
                  </div>
                </p>
                <p>
                  ⮟ Lowest Value (Ore):
                  <div>
                    <span className="placeholder">
                      {minOre.name} ({minOre.value.toLocaleString()} {modeStr})
                    </span>
                  </div>
                </p>
              </>
            )}
          </div>
        )}
      </div>
      <div
        className="v-usage"
        style={{
          position: "absolute",
          left: "0px",
          top: "90px",
          width: "25%",
          fontSize: "18px",
        }}
      ></div>
      <div>
        <NavBar />
      </div>
      <div className="container">
        {/* Value buttons */}
        <div
          className="button-container"
          style={{
            flexDirection: "row",
            marginBottom: "20px",
          }}
        >
          {/* More stats button - expands quick summary & enables more info */}
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
              onClick={() => {
                toggleValueMode("zenith");
              }}
              className={
                valueMode === "zenith" ? "color-template-torn-fabric" : ""
              }
            >
              <span>Zenith Vals</span>
              <div className="v-last-updated">
                Updated {lastUpdatedDates.zenith}
              </div>
            </button>
          </div>
          <div className="box-button">
            <button
              onClick={() => toggleValueMode("nan")}
              className={valueMode === "nan" ? "color-template-diamond" : ""}
            >
              <span>NAN Vals</span>
              <div className="v-last-updated">
                Updated {lastUpdatedDates.nan}
              </div>
            </button>
          </div>
          <div className="box-button">
            <button
              onClick={() => toggleValueMode("custom")}
              className={
                valueMode === "custom" ? "color-template-havicron" : ""
              }
            >
              <span>Custom</span>
              <div className="v-last-updated">Personal values</div>
            </button>
          </div>
          <div className="box-button">
            <button
              onClick={() => setShowCSVLoader(true)}
              className="color-template-tachyon"
            >
              <span>Load CSV</span>
              <div className="v-last-updated">Import your inventory</div>
            </button>
          </div>
          <div className="box-button">
            <button
              onClick={() => {
                if (!secondaryCSVData) {
                  setShowSecondaryCSVPopup(true);
                } else {
                  setUseSecondaryCSV(!useSecondaryCSV);
                }
              }}
              className={
                useSecondaryCSV ? "color-template-protireal active" : ""
              }
            >
              <span>
                {useSecondaryCSV
                  ? "Using 2nd CSV"
                  : secondaryCSVData
                  ? "Toggle 2nd CSV"
                  : "Add 2nd CSV"}
              </span>
              <div className="v-last-updated">
                {secondaryCSVData
                  ? "Switch between CSV sets"
                  : "Add alternate inventory"}
              </div>
            </button>
          </div>
          {useSecondaryCSV && (
            <>
              <div className="box-button">
                <button onClick={() => setShowSecondaryCSVPopup(true)}>
                  <span>Modify 2nd CSV</span>
                </button>
              </div>
              <div className="box-button">
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to delete the 2nd CSV data?"
                      )
                    ) {
                      setSecondaryCSVData(null);
                      setUseSecondaryCSV(false);
                    }
                  }}
                >
                  <span>Delete 2nd CSV</span>
                </button>
              </div>
            </>
          )}
          {valueMode === "custom" && (
            <div className="box-button">
              <button onClick={() => navigate("/customvalues")}>
                <span>Modify</span>
                <div className="v-last-updated">Change values</div>
              </button>
            </div>
          )}

          <div className="box-button">
            <button
              onClick={() => setShowCompletionPopup(true)}
              className={
                showCompletionPopup ? "color-template-dystranum active" : ""
              }
            >
              <span>Incomplete Ores</span>
              <div className="v-last-updated">Progress to Completion</div>
            </button>
          </div>
          {showCompletionPopup && (
            <div
              className="custom-modal-overlay"
              style={{ paddingTop: "50px" }}
            >
              <div
                className="custom-modal"
                style={{
                  maxWidth: "650px",
                  maxHeight: "80vh",
                  overflow: "auto",
                }}
              >
                <div className="modal-header">
                  <h3>
                    Ores Remaining for {modeStr} Completion:{" "}
                    {incompleteOres.length}
                  </h3>
                  <button
                    onClick={() => setShowCompletionPopup(false)}
                    className="modal-close"
                    style={{ position: "absolute", right: "15px", top: "15px" }}
                  >
                    ✖
                  </button>
                </div>
                <div className="completion-popup-content">
                  <div className="completion-header">
                    <span>Ore</span>
                    <span>Layer</span>
                    <span>{modeStr} Completion %</span>
                    <span># Remaining</span>
                  </div>
                  {incompleteOres.map((ore, index) => (
                    <div key={index} className="completion-row">
                      <span className="ore-name">{ore.name}</span>
                      <span className="ore-layer">
                        {ore.layer.split("\n")[0]}
                      </span>
                      <span className="ore-completion">
                        <div className="completion-bar-container">
                          <div
                            className="completion-bar"
                            style={{
                              width: "100%",
                              background: `linear-gradient(90deg,
                              #3ebd21ff 0%,
                              #3ebd21ff ${ore.completion}%,
                              #494949ff ${ore.completion}%,
                              #717171ff 100%)`,
                            }}
                          />
                          <span className="completion-text">
                            {ore.completion.toFixed(3)}%
                          </span>
                        </div>
                      </span>
                      <span className="ore-remaining">
                        {Math.ceil(ore.remaining).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {showSecondaryCSVPopup && (
          <SecondaryCSVPopup onClose={() => setShowSecondaryCSVPopup(false)} />
        )}

        <CSVLoaderPopup
          isOpen={showCSVLoader}
          onClose={() => setShowCSVLoader(false)}
        />

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
            value={tableSelected}
          >
            <option value="" disabled>
              Jump to layer table...
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
              : "linear-gradient(90deg,rgb(255, 0, 0) 0%,rgb(238, 255, 0) 100%)";

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
