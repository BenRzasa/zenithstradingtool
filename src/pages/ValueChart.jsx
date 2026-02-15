import React, { useState, useContext, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { MiscContext } from "../context/MiscContext";

import { MiscValueFunctions } from "../components/MiscValueFunctions";
import LayerTable from "../components/LayerTable";
import CSVLoaderPopup from "../components/CSVLoaderPopup";
import SecondaryCSVPopup from "../components/SecondaryCSVPopup";

import { OreIcons } from "../data/OreIcons";
import { useSearchFilters } from "../data/SearchFilters";
import bubby from "../images/misc/bubby.gif";
import missingIcon from "../images/ore-icons/Missing_Texture.png";

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
        moreStats,
        getOreClassName
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

    let formatter = Intl.NumberFormat('en', { notation: 'standard', maximumFractionDigits: 3 });

    const toggleValueMode = (mode) => {
        if (mode === "custom") {
            const hasCustomValues = Object.values(oreValsDict).some((layer) =>
                layer.layerOres.some((ore) => ore.defaultVal !== undefined)
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
        zenith: "Dec 2025",
        random: "Nov 2025",
    });

    // UI control states
    const [isSummaryOpen, setIsSummaryOpen] = useState(false);
    const [showBackToTop, setShowBackToTop] = useState(false);

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
                            newValue = ore.defaultVal;
                    }
                    return {
                        ...ore,
                        defaultVal: newValue,
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


    return (
        <div className="page-wrapper" id="value">
            {/* Quick summary dropdown */}
            <button
                className="summary-header"
                onClick={() => setIsSummaryOpen(!isSummaryOpen)}
            >
                <h2>
                    Quick Summary &nbsp;{" "}
                    <i class="fa-solid fa-arrow-pointer"></i>
                </h2>
            </button>
            <div className={`quick-summary ${isSummaryOpen ? "open" : ""}`}>
                {isSummaryOpen && (
                    <div className="summary-content">
                        <p>
                            ⛏ Total Ores:{" "}
                            <span className="accent">{totalOres.toLocaleString()}</span>
                        </p>
                        <p>
                            ⛏ Total Rare {getCurrentModeStr("Rares\nMore")}:{" "}
                            <span className="accent">{rareTotal.toLocaleString()}</span>
                        </p>
                        {useSeparateRareMode && (
                            <p>
                                ⛏ Rare {getCurrentModeStr("Rares\nMore")} Completion:{" "}
                                <span className="accent">{raresCompletion.toFixed(3)}%</span>
                            </p>
                        )}
                        <p>
                            ⛏ Unique {currentModeString}:{" "}
                            <span className="accent">
                                {uniqueTotal.toLocaleString()}
                            </span>
                        </p>
                        <p>
                            ⛏ Layer {currentModeString}:{" "}
                            <span className="accent">{layerTotal.toLocaleString()}</span>
                        </p>
                        <p>
                            ⛏ Grand Total {currentModeString}:{" "}
                            <span className="accent">{grandTotal.toLocaleString()}</span>
                        </p>
                        <p>
                            ⛏ Total {currentModeString} Completion:{" "}
                            <span className="accent">{avgCompletion.toFixed(3)}%</span>
                        </p>
                        {moreStats && (
                            <>
                                <p>
                                    ⮝ Highest Value (Layer):
                                    <br></br>
                                    <span className="accent">
                                        {maxLayer.name.substring(0, maxLayer.name.indexOf("\n"))}{" "}
                                        ({maxLayer.value.toLocaleString()} {currentModeString})
                                    </span>
                                </p>
                                <p>
                                    ⮟ Lowest Value (Layer):
                                    <br></br>
                                    <span className="accent">
                                        {minLayer.name.substring(0, minLayer.name.indexOf("\n"))}{" "}
                                        ({minLayer.value.toLocaleString()} {currentModeString})
                                    </span>
                                </p>
                                <p>
                                    ⮝ Highest Value (Ore):
                                    <br></br>
                                    <span className="accent">
                                        {maxOre.name} ({maxOre.value.toLocaleString()} {currentModeString})
                                    </span>
                                </p>
                                <p>
                                    ⮟ Lowest Value (Ore):
                                    <br></br>
                                    <span className="accent">
                                        {minOre.name} ({minOre.value.toLocaleString()} {currentModeString})
                                    </span>
                                </p>
                            </>
                        )}
                    </div>
                )}
            </div>
            {/* Value buttons */}
            <div className="button-container">
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
                <button
                    onClick={() => toggleValueMode("custom")}
                    className={
                        valueMode === "custom" ? "color-template-havicron" : ""
                    }
                >
                    <span>Custom</span>
                    <div className="v-last-updated">Personal values</div>
                </button>
                <button
                    onClick={() => setShowCSVLoader(true)}
                    className="color-template-tachyon"
                >
                    <span>Load CSV</span>
                    <div className="v-last-updated">Import your inventory</div>
                </button>
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
                {useSecondaryCSV && (
                    <>
                        <button onClick={() => setShowSecondaryCSVPopup(true)}>
                            <span>Modify 2nd CSV</span>
                        </button>
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
                    </>
                )}
                {valueMode === "custom" && (
                    <button onClick={() => navigate("/customvalues")}>
                        <span>Modify</span>
                        <div className="v-last-updated">Change values</div>
                    </button>
                )}

                <button
                    onClick={() => setShowCompletionPopup(true)}
                    className={
                        showCompletionPopup ? "color-template-dystranum active" : ""
                    }
                >
                    <span>Incomplete Ores</span>
                    <div className="v-last-updated">Progress to Completion</div>
                </button>
                {showCompletionPopup && (
                    <div className="popup-overlay">
                        <div 
                            className="box"
                            id="remaining"
                            style={{
                                paddingTop: "3em",
                                zIndex: "25000",
                            }}>
                            <button
                                className="close-button"
                                onClick={() => setShowCompletionPopup(false)}
                            >
                                ✖
                            </button>
                            <h2>
                                Ores Remaining for 100% {currentModeString}s: {" "}
                                {incompleteOres.length}
                            </h2>
                            <div 
                                className="table-wrapper"
                                style={{
                                    maxHeight: "800px",
                                    overflowY: "scroll",
                                }}
                            >
                                <table style={{
                                    position: "relative", 
                                    textAlign: "left",
                                    marginLeft: "-1em"
                                }}>
                                    <thead>
                                        <tr>
                                            <th>Ore Name</th>
                                            <th>{currentModeString} %</th>
                                            <th>Left / <span className="accent">Total</span></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {incompleteOres.map((ore, index) => (
                                            <tr key={index}>
                                                <td
                                                    className={`name-column ${getOreClassName(ore.name)}`}
                                                    data-text={ore.name}
                                                    style={{
                                                        borderRight: "2px solid var(--switch-outline)"
                                                    }}
                                                >
                                                    {OreIcons[ore.name.replace(/ /g, "_")] ? (
                                                        <img
                                                            src={OreIcons[ore.name.replace(/ /g, "_")]}
                                                            alt={`${ore.name} icon`}
                                                            className="ore-icon"
                                                            onError={(e) => {
                                                                console.error(`Missing icon for: ${ore.name}`);
                                                                e.target.style.display = "none";
                                                            }}
                                                        />
                                                    ) : (
                                                            <span>
                                                                <img
                                                                    src={missingIcon}
                                                                    alt={"Missing icon"}
                                                                    className="ore-icon"
                                                                ></img>
                                                            </span>
                                                        )}
                                                    {ore.name}
                                                </td>
                                                <td>
                                                    <div className="progress-wrapper" style={{paddingLeft: "5px", paddingRight: "5px"}}>
                                                        <div className="progress-bar" >
                                                            <span 
                                                                className="progress-bar-fill" 
                                                                style={{width: `${ore.completion}%`
                                                                }}>{ore.completion}%</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td 
                                                    style={{
                                                        textAlign: "left", 
                                                        paddingLeft: "0.5em",
                                                        borderLeft: "2px solid var(--switch-outline)",
                                                        borderBottom: "2px solid var(--switch-outline)",

                                                    }}>
                                                    {formatter.format(Math.floor(ore.required - (csvData[ore.name] || 0)))} / <span className="accent">{formatter.format(Math.floor(ore.required))}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
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
                onClose={() => {
                    setShowCSVLoader(false);
                    console.log(showCSVLoader);
                }}
            />

            {/* Back to Top button */}
            {showBackToTop && (
                // Should probably move this styling into the css.
                // Just title it ".back-to-top"...
                <button 
                    className="back-to-top"
                    onClick={scrollToTop}>
                    <span>⮝ Back to Top</span>
                </button>
            )}

            {/* Dropdown navigation */}
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

                {tableNames.filter(
                    name => !name.includes("Essences")).map((name) => (
                        <option key={name} value={name}>
                            {name}
                        </option>
                    )
                )}
            </select>

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
                            layer.background || "red"

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
    );
}

export default ValueChart;
