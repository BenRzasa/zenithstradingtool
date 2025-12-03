import React, { useState, useContext, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { MiscContext } from "../context/MiscContext";

import { MiscValueFunctions } from "../components/MiscValueFunctions";
import LayerTable from "../components/LayerTable";
import NavBar from "../components/NavBar";
import CSVLoaderPopup from "../components/CSVLoaderPopup";
import SecondaryCSVPopup from "../components/SecondaryCSVPopup";

import { OreIcons } from "../data/OreIcons";
import { useSearchFilters } from "../data/SearchFilters";
import bubby from "../images/misc/bubby.gif";

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
        useSeparateRareMode,
        rareValueMode,
        rareCustomMultiplier,
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
        useSeparateRareMode,
        rareValueMode,
        rareCustomMultiplier,
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
        getCurrentModeStr,
        calculateDisplayValue,
    } = allValues;

    const navigate = useNavigate();
    const csvData = getCurrentCSV();
    const searchFilters = useSearchFilters(oreValsDict);

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
                layer.layerOres.some((ore) => ore.customVal !== undefined)
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
        zenith: "Dec 01, 2025",
        random: "Nov ??, 2025",
    });

    // UI control states
    const [isSummaryOpen, setIsSummaryOpen] = useState(false);
    const [moreStats, setMoreStats] = useState(false);
    const [showBackToTop, setShowBackToTop] = useState(false);
    // Draggable summary states
    // State and handlers
    const [dragState, setDragState] = useState({
        isDragging: false,
        position: { x: 80, y: 15 },
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
    const tableNames = Object.values(oreValsDict).map(
        (layer) => layer.layerName.split("\n")[0]
    );

    const [tableSelected, setTableSelected] = useState("");
    // Function to handle dropdown selection
    const handleTableSelect = (e) => {
        let tableId = e.target.value;
        if (tableId) {
            // Convert the layer name to a valid ID (replace spaces and special characters)
            const elementId = tableId.replace(/\s+/g, "-").replace(/\n/g, "-");
            const element = document.getElementById(elementId);
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
        for (const layerKey in newOreVals) {
            newOreVals[layerKey].layerOres = newOreVals[layerKey].layerOres.map(
                (ore) => {
                    let newValue;
                    switch (source) {
                        case "zenith":
                            newValue = ore.zenithVal;
                        case "random":
                            newValue = ore.randomsVal;
                            break;
                        default:
                            newValue = ore.zenithVal;
                    }
                    return {
                        ...ore,
                        customVal: newValue,
                    };
                }
            );
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

    const currentModeString = getCurrentModeStr();

    // Calculate combined completion percentage for rares and true rares
    const calculateRaresCompletion = useCallback(() => {
        let totalCompletion = 0;
        let totalItems = 0;

        // Find rares and true rares layers
        const raresLayer = Object.values(oreValsDict).find(layer =>
            layer.layerName.includes("Rares") && !layer.layerName.includes("True Rares")
        );
        const trueRaresLayer = Object.values(oreValsDict).find(layer =>
            layer.layerName.includes("True Rares")
        );

        // Process rares layer
        if (raresLayer && raresLayer.layerOres) {
            raresLayer.layerOres.forEach(ore => {
                const inventory = csvData[ore.name] || 0;
                const value = useSeparateRareMode ?
                    calculateDisplayValue(ore) :
                    getValueForMode(ore);

                if (value > 0) {
                    const completion = capCompletion ?
                        Math.min(1, inventory / value) :
                        inventory / value;
                    totalCompletion += completion;
                    totalItems++;
                }
            });
        }

        // Process true rares layer
        if (trueRaresLayer && trueRaresLayer.layerOres) {
            trueRaresLayer.layerOres.forEach(ore => {
                const inventory = csvData[ore.name] || 0;
                const value = useSeparateRareMode ?
                    calculateDisplayValue(ore) :
                    getValueForMode(ore);

                if (value > 0) {
                    const completion = capCompletion ?
                        Math.min(1, inventory / value) :
                        inventory / value;
                    totalCompletion += completion;
                    totalItems++;
                }
            });
        }

        // Calculate average completion percentage
        const avgCompletion = totalItems > 0 ? (totalCompletion / totalItems) * 100 : 0;
        return capCompletion ? Math.min(100, avgCompletion) : avgCompletion;
    }, [
            oreValsDict,
            csvData,
            useSeparateRareMode,
            calculateDisplayValue,
            getValueForMode,
            capCompletion
        ]);

    // Calculate the value
    const raresCompletion = calculateRaresCompletion();

    // idk what this does 
    function crashPage() {
        let PIGGIES = "🐖";
        while (true) {
            PIGGIES = `${PIGGIES}${PIGGIES}`;
            console.log(PIGGIES);
            window.alert(PIGGIES);
        }
    };

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
                    <h2>
                        Quick Summary &nbsp;{" "}
                        <i
                            className={`fas fa-hand-pointer ${isSummaryOpen ? "open" : ""}`}
                        ></i>
                    </h2>
                </div>
                {isSummaryOpen && (
                    <div className="summary-content">
                        <p>
                            ⛏ Total Ores:{" "}
                            <span className="placeholder">{totalOres.toLocaleString()}</span>
                        </p>
                        <p>
                            ⛏ Total Rare {getCurrentModeStr("Rares\nMore")}:{" "}
                            <span className="placeholder">{rareTotal.toLocaleString()}</span>
                        </p>
                        {useSeparateRareMode && (
                            <p>
                                ⛏ Rare {getCurrentModeStr("Rares\nMore")} Completion:{" "}
                                <span className="placeholder">{raresCompletion.toFixed(3)}%</span>
                            </p>
                        )}
                        <p>
                            ⛏ Unique {currentModeString}:{" "}
                            <span className="placeholder">
                                {uniqueTotal.toLocaleString()}
                            </span>
                        </p>
                        <p>
                            ⛏ Layer {currentModeString}:{" "}
                            <span className="placeholder">{layerTotal.toLocaleString()}</span>
                        </p>
                        <p>
                            ⛏ Grand Total {currentModeString}:{" "}
                            <span className="placeholder">{grandTotal.toLocaleString()}</span>
                        </p>
                        <p>
                            ⛏ Total {currentModeString} Completion:{" "}
                            <span className="placeholder">{avgCompletion.toFixed(3)}%</span>
                        </p>
                        {moreStats && (
                            <>
                                <p>
                                    ⮝ Highest Value (Layer):
                                    <br></br>
                                    <span className="placeholder">
                                        {maxLayer.name.substring(0, maxLayer.name.indexOf("\n"))}{" "}
                                        ({maxLayer.value.toLocaleString()} {currentModeString})
                                    </span>
                                </p>
                                <p>
                                    ⮟ Lowest Value (Layer):
                                    <br></br>
                                    <span className="placeholder">
                                        {minLayer.name.substring(0, minLayer.name.indexOf("\n"))}{" "}
                                        ({minLayer.value.toLocaleString()} {currentModeString})
                                    </span>
                                </p>
                                <p>
                                    ⮝ Highest Value (Ore):
                                    <br></br>
                                    <span className="placeholder">
                                        {maxOre.name} ({maxOre.value.toLocaleString()} {currentModeString})
                                    </span>
                                </p>
                                <p>
                                    ⮟ Lowest Value (Ore):
                                    <br></br>
                                    <span className="placeholder">
                                        {minOre.name} ({minOre.value.toLocaleString()} {currentModeString})
                                    </span>
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
                            <span>Zenith's Vals</span>
                            <div className="v-last-updated">
                                Updated {lastUpdatedDates.zenith}
                            </div>
                        </button>
                    </div>
                    <div className="box-button">
                        <button
                            onClick={() => {
                                toggleValueMode("random");
                            }}
                            className={
                                valueMode === "random" ? "color-template-verglazium-custom" : ""
                            }
                            style={{ 
                                color: valueMode === "random" ? "white" : "black", 
                                textShadow: 
                                valueMode === "random" ? "1px 2px 2px black" : "" 
                            }}
                        >
                            <span>Random's Vals</span>
                            <div className="v-last-updated">
                                Updated {lastUpdatedDates.random}
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
                                        Ores Remaining for {currentModeString} Completion:{" "}
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
                                        <span>{currentModeString} Completion %</span>
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
                            <span>⮝ Back to Top</span>
                        </button>
                    </div>
                )}

                {/* Dropdown navigation */}
                <div className="table-navigation">
                    <select
                        id="table-select"
                        title="table-select"
                        value={tableSelected}
                        onChange={handleTableSelect}
                        style={{ appearance: "none" }}
                    >
                        <option value="" disabled>
                            Jump to layer table... &nbsp; ▼
                        </option>

                        {/* Map all tables/layers to the results based on the names */}
                        {tableNames.filter(name => !name.includes("Essences")).map((name) => (
                            <option key={name} value={name}>
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
                <div className="tables-container">
                    {Object.values(oreValsDict)
                        .filter(layer => !layer.layerName.includes("Essences"))
                        .map((layer) => {
                            const layerName = layer.layerName;
                            const layerData = layer.layerOres;

                            const gradientStyle =
                                layer.background ||
                                    "linear-gradient(90deg,rgb(255, 0, 0) 0%,rgb(238, 255, 0) 100%)";

                            const tableModeStr = getCurrentModeStr(layerName);

                            return (
                                <div
                                    id={layerName
                                        .split("\n")[0]
                                        .replace(/\s+/g, "-")
                                        .replace(/\n/g, "-")}
                                    key={layerName}
                                >
                                    <LayerTable
                                        data={layerData}
                                        title={layerName}
                                        currentMode={currentMode}
                                        customMultiplier={customMultiplier}
                                        csvData={csvData}
                                        gradient={gradientStyle}
                                        searchFilters={searchFilters}
                                        valueMode={valueMode}
                                        modeStr={tableModeStr}
                                        calculateDisplayValue={calculateDisplayValue}
                                        useSeparateRareMode={useSeparateRareMode}
                                        rareValueMode={rareValueMode}
                                        rareCustomMultiplier={rareCustomMultiplier}
                                    />
                                </div>
                            );
                        })
                    }
                </div>
            </div>
            <button
                style={{
                    border: "none",
                    background: "transparent",
                    width: "60px",
                    height: "60px",
                    cursor: "pointer",
                    color: "red",
                }}
                onClick={() => crashPage()}
            >
                <img 
                    src={bubby}
                    style={{
                        border: "none",
                        background: "transparent",
                        width: "60px",
                        height: "60px",
                        color: "red",
                    }}
                /></button>
        </div>
    );
}

export default ValueChart;
