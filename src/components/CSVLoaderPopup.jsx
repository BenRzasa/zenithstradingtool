import React, { useContext, useState, useRef, useEffect, useMemo } from "react";
import { MiscValueFunctions } from "./MiscValueFunctions";
import { MiscContext } from "../context/MiscContext";
import CSVEditor from "./CSVEditor";

import "../styles/CSVLoader.css";

function CSVLoaderPopup({ onClose, isOpen }) {
    const {
        oreValsDict,
        oreNames,
        previousAmounts, 
        lastUpdated,
        updateCSVData,
        currentMode,
        setCurrentMode,
        capCompletion,
        customMultiplier,
        valueMode,
        getValueForMode,
        getCurrentCSV,
        clearCSVData,
    } = useContext(MiscContext);

    const ORE_NAMES = useMemo(() => {
        return Object.freeze([...oreNames]);
    }, [oreNames]);

    const allValues = MiscValueFunctions({
        csvData: getCurrentCSV(),
        valueMode,
        currentMode,
        customMultiplier,
        setCurrentMode,
        getValueForMode,
        oreValsDict,
        capCompletion,
    });

    const { grandTotal, avgCompletion, totalOres } = allValues;

    const csvData = getCurrentCSV();

    // Initialize completionChange & total ores from localStorage or default to 0
    const [completionChange, setCompletionChange] = useState(() => {
        const savedChange = localStorage.getItem("completionChange");
        const parsed = parseFloat(savedChange);
        return !isNaN(parsed) ? parsed : 0;
    });

    const [totalOresChange, setTotalOresChange] = useState(() => {
        const savedChange = localStorage.getItem("totalOresChange");
        const parsed = parseFloat(savedChange);
        return !isNaN(parsed) ? parsed : 0;
    });

    // Store previous completion & ores num in ref
    const prevCompletionRef = useRef(0);
    const prevTotalOresRef = useRef(0);

    // Track if this is the initial load
    const isInitialLoadRef = useRef(true);
    const hasValidDataRef = useRef(false);


    // Initialize refs from localStorage on component mount
    useEffect(() => {
        const savedPrevCompletion = localStorage.getItem("prevCompletion");
        const savedPrevTotalOres = localStorage.getItem("prevTotalOres");

        const prevCompletion = savedPrevCompletion ? parseFloat(savedPrevCompletion) : 0;
        const prevTotalOres = savedPrevTotalOres ? parseFloat(savedPrevTotalOres) : 0;

        // Only set if we have valid numbers
        if (!isNaN(prevCompletion)) {
            prevCompletionRef.current = prevCompletion;
        }
        if (!isNaN(prevTotalOres)) {
            prevTotalOresRef.current = prevTotalOres;
        }

        hasValidDataRef.current = true;
    }, []);

    // Update completion change & total ores # only when we have valid data
    useEffect(() => {
        if (isInitialLoadRef.current || !hasValidDataRef.current) {
            isInitialLoadRef.current = false;
            return;
        }

        if (typeof avgCompletion === "number" && !isNaN(avgCompletion) && 
            typeof totalOres === "number" && !isNaN(totalOres)) {

            const currentComp = capCompletion
                ? Math.min(100, avgCompletion)
                : avgCompletion;
            const previousComp = capCompletion
                ? Math.min(100, prevCompletionRef.current)
                : prevCompletionRef.current;

            const currentTotalOres = totalOres;
            const previousTotalOres = prevTotalOresRef.current;

            if (typeof previousComp === "number" && !isNaN(previousComp) &&
                typeof previousTotalOres === "number" && !isNaN(previousTotalOres)) {

                const compChange = currentComp - previousComp;
                setCompletionChange(compChange);

                const totalOresChange = currentTotalOres - previousTotalOres;
                setTotalOresChange(totalOresChange);

                // Store current values as previous for next calculation
                prevCompletionRef.current = currentComp;
                prevTotalOresRef.current = currentTotalOres;

                localStorage.setItem("completionChange", compChange.toString());
                localStorage.setItem("prevCompletion", currentComp.toString());
                localStorage.setItem("totalOresChange", totalOresChange.toString());
                localStorage.setItem("prevTotalOres", currentTotalOres.toString());
            }
        }
    }, [avgCompletion, totalOres, capCompletion]); 

    const [sortConfig, setSortConfig] = useState({
        key: "change",
        direction: "desc",
    });

    const [showCSVEditor, setShowCSVEditor] = useState(false);

    // Function to handle header clicks and toggle sorting
    const handleSort = (columnKey) => {
        let direction = "asc";
        // If clicking the same column, toggle the direction
        if (sortConfig.key === columnKey) {
            direction = sortConfig.direction === "asc" ? "desc" : "asc";
        }
        setSortConfig({ key: columnKey, direction });
    };

    // Get sort indicator for a column
    const displaySortArrow = (columnKey) => {
        if (sortConfig.key !== columnKey) return null;
        return sortConfig.direction === "asc" ? " ▲" : " ▼";
    };

    // Memoized sorted ores
    const sortedOres = React.useMemo(() => {
        const sortableOres = [...ORE_NAMES];

        sortableOres.sort((a, b) => {
            // Handle change column cases - requires some nitpicking to format nicely
            if (sortConfig.key === "change") {
                const changeA = (csvData[a] || 0) - (previousAmounts[a] || 0);
                const changeB = (csvData[b] || 0) - (previousAmounts[b] || 0);
                // Handle zeros first (they should always be last)
                if (changeA === 0 && changeB === 0) return 0;
                if (changeA === 0) return 1;
                if (changeB === 0) return -1;
                if (sortConfig.direction === "asc") {
                    // ASCENDING: Negative increasing then Positive increasing
                    if (changeA < 0 && changeB < 0) return changeA - changeB;
                    if (changeA < 0 && changeB > 0) return -1;
                    if (changeA > 0 && changeB < 0) return 1;
                    if (changeA > 0 && changeB > 0) return changeA - changeB;
                } else {
                    // DESCENDING: Positive decreasing then Negative decreasing
                    if (changeA > 0 && changeB > 0) return changeB - changeA;
                    if (changeA > 0 && changeB < 0) return -1;
                    if (changeA < 0 && changeB > 0) return 1;
                    if (changeA < 0 && changeB < 0) return changeB - changeA;
                }
                return 0;
            }

            // Get values to compare based on sort column
            let aValue, bValue;

            switch (sortConfig.key) {
                case "amount":
                    aValue = csvData[a] || 0;
                    bValue = csvData[b] || 0;
                    break;
                default: // 'ore'
                    aValue = a;
                    bValue = b;
                    break;
            }

            // Compare values
            if (aValue < bValue) {
                return sortConfig.direction === "asc" ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === "asc" ? 1 : -1;
            }
            return 0;
        });
        return sortableOres;
    }, [csvData, previousAmounts, sortConfig]);

    const updateOreAmounts = () => {
        const csvInput = document.getElementById("csv-input").value;
        if (!csvInput) return;
        // Store current completion as previous before updating
        prevCompletionRef.current = avgCompletion;
        const newAmounts = csvInput.split(",").map(Number);
        const updatedData = {};
        // Use the original OreNames order WITHOUT re-sorting
        ORE_NAMES.forEach((ore, index) => {
            updatedData[ore] =
                newAmounts[index] !== undefined && !isNaN(newAmounts[index])
                    ? newAmounts[index]
                    : 0;
        });
        updateCSVData(updatedData);
        // Force sort by change
        setSortConfig({
            key: "change",
            direction: "desc",
        });
    };

    // Calculate total value change from last update
    const calculateValueChanges = () => {
        let multiplier = 0;

        switch (currentMode) {
            case 1:
                multiplier = 1;
                break;
            case 2:
                multiplier = 10;
                break;
            case 3:
                multiplier = 100;
                break;
            case 4:
                multiplier = 500;
                break;
            case 5:
                multiplier = 1000;
                break;
            case 6:
                multiplier = 50;
                break;
            case 7:
                multiplier = customMultiplier;
                break;
            default:
                multiplier = 1;
                break;
        }

        let totalGained = 0;
        let totalLost = 0;
        const changedOres = [];

        ORE_NAMES.forEach((ore) => {
            if (ore.includes("Essence")) return;
            const currentAmount = csvData[ore] || 0;
            const previousAmount = previousAmounts[ore] || 0;
            const quantityChange = currentAmount - previousAmount;
            if (quantityChange !== 0) {
                let baseValue = 1;
                oreValsDict.some((layer) => {
                    const oreData = layer.layerOres.find((item) => item.name === ore);
                    if (oreData) {
                        baseValue = getValueForMode(oreData);
                        return true;
                    }
                    return false;
                });

                const valueChange = quantityChange / (baseValue * multiplier);
                if (valueChange > 0) {
                    totalGained += valueChange;
                } else {
                    totalLost += Math.abs(valueChange);
                }

                changedOres.push({
                    ore,
                    quantityChange,
                    valueChange,
                });
            }
        });

        return {
            totalGained,
            totalLost,
            netChange: totalGained - totalLost,
            changedOres,
        };
    };

    // Get the mode string using the function from MiscValueFunctions
    const modeStr = allValues.getCurrentModeStr();


    // Export the CSV data and put it in the input box
    const exportCSV = () => {
        const csvValues = ORE_NAMES.map((ore) => csvData[ore] || 0);
        document.getElementById("csv-input").value = csvValues.join(",");
    };
    if (!isOpen) return null;
    return (
        <div className="popup-overlay">
            <div className="popup" id="csv" style={{zIndex: "15000"}}>
                <h2>CSV Loader</h2>
                <button 
                    className="close-button" 
                    style={{zIndex:"16000"}}
                    onClick={onClose}>
                    ✖
                </button>

                <h3>Usage Instructions</h3>
                <p>
                    ⛏ Copy and paste your CSV string from Settings ➜ Other (in TCC) in the box below.
                </p>
                <p>
                    ⛏ Click "Update" button to load your CSV data into the website.
                </p>
                <h2 className="accent">
                    ⛏ Last Updated:{" "}
                    {lastUpdated ? lastUpdated.toLocaleString() : "Never"}
                </h2>

                <div className="row-container-center">
                    <button
                        className="color-template-havicron"
                        onClick={() => {
                            updateOreAmounts();
                            setSortConfig({
                                key: "change",
                                direction: "desc",
                            });
                        }}
                    >
                        <span>Update</span>
                    </button>
                    <button onClick={exportCSV}>
                        <span>Export CSV</span>
                    </button>
                    <button
                        onClick={() => setShowCSVEditor(!showCSVEditor)}
                        className={showCSVEditor ? "color-template-protireal" : ""}
                    >
                        <span>Edit CSV</span>
                    </button>
                    <button
                        className="color-template-obliviril"
                        onClick={() => {
                            if (
                                window.confirm(
                                    "Are you sure you want to clear ALL CSV data? This will delete your current CSV data, previous amounts, and update history. This action cannot be undone."
                                )
                            ) {
                                clearCSVData();
                            }
                        }}
                    >
                        <span>Clear CSV Data</span>
                    </button>

                    {showCSVEditor && (
                        <CSVEditor onClose={() => setShowCSVEditor(false)} />
                    )}

                    {/* Total value updates from last csv update */}
                    {Object.keys(previousAmounts).length >= 0 && (
                        <div className="box-row">
                            <div className="value-change-cards">
                                <div className="value-card gained">
                                    <span>Value Gained:</span>
                                    <span>
                                        {" "}
                                        +{calculateValueChanges().totalGained.toFixed(2)}
                                    </span>{" "}
                                    {modeStr}
                                </div>
                                <div className="value-card lost">
                                    <span>Value Lost:</span>
                                    <span>
                                        {" "}
                                        -{calculateValueChanges().totalLost.toFixed(2)}
                                    </span>{" "}
                                    {modeStr}
                                </div>
                                <div
                                    className={`value-card net ${
calculateValueChanges().netChange >= 0
? "positive"
: "negative"
}`}
                                >
                                    <span>Net Change:</span>
                                    <span>
                                        {calculateValueChanges().netChange >= 0 ? " +" : " "}
                                        {calculateValueChanges().netChange.toFixed(2)}
                                    </span>{" "}
                                    {modeStr}
                                </div>
                            </div>

                            <div className="box">
                                <h3>Changed Ores:</h3>
                                <div className="search-results" style={{width: "100%"}}>
                                        {calculateValueChanges()
                                            .changedOres.sort((a, b) => b.valueChange - a.valueChange)
                                            .map(({ ore, valueChange }) => (
                                                <div className="search-result-item" style={{marginLeft:"5px"}} key={ore}>
                                                    {ore}:{" "}
                                                    <span
                                                        className={
                                                            valueChange > 0
                                                                ? "positive-change"
                                                                : "negative-change"
                                                        }
                                                    >
                                                        {(valueChange > 0 ? " +" : " ") +
                                                            valueChange.toFixed(2)}{" "}
                                                        {modeStr}
                                                    </span>
                                                </div>
                                            ))}
                                </div>
                            </div>
                            {/* Summary details since last update */}
                            <div className="box">
                                <h3>
                                    ⛏ {modeStr} %{" "}
                                    {completionChange === 0
                                        ? "Change: "
                                        : completionChange > 0
                                            ? "Gained: +"
                                            : "Lost: "}
                                    <span
                                        className={
                                            completionChange === 0
                                                ? ""
                                                : completionChange > 0
                                                    ? "positive-change"
                                                    : "negative-change"
                                        }
                                    >
                                        {completionChange.toFixed(3)}%
                                    </span>
                                </h3>
                                <h3>
                                    ⛏ Current {modeStr} %:{" "}
                                    <span className="accent">
                                        {avgCompletion.toFixed(3)}%
                                    </span>
                                </h3>
                                <h3>
                                    ⛏ Grand Total {modeStr}:{" "}
                                    <span className="accent">{grandTotal.toFixed(2)}</span>
                                </h3>
                                <h3>
                                    ⛏ Total Ores:
                                    <span className="accent">
                                        {" "}
                                        {totalOres.toLocaleString()}
                                    </span>
                                </h3>
                                <h3>
                                    ⛏ Total Ores {" "}
                                    {totalOresChange === 0
                                        ? "Gained: No Change"
                                        : totalOresChange > 0
                                            ? "Gained: "
                                            : "Lost: "}
                                    <span
                                        className={
                                            totalOresChange === 0
                                                ? ""
                                                : totalOresChange > 0
                                                    ? "positive-change"
                                                    : "negative-change"
                                        }
                                    >
                                        {totalOresChange > 0 ? "+" : ""}
                                        {totalOresChange === 0 ? "" : totalOresChange.toLocaleString()}
                                    </span>
                                </h3>
                            </div>
                        </div>
                    )}
                    <div className="row-container" 
                        style={{
                            width: "100%", 
                            justifyContent: "space-evenly", 
                            alignItems: "center"
                        }}>
                        <div className="csv-output">
                            <textarea 
                                id="csv-input"
                                placeholder="Enter comma-separated numbers..."
                            />
                        </div>
                        <div className="table-wrapper" style={{
                            height: "400px", 
                            width: "350px", 
                            overflowY: "scroll",
                        }}>
                            <table style={{textAlign: "left"}}>
                                <thead>
                                    <tr>
                                        <th id="csv-th"
                                            onClick={() => handleSort("ore")}
                                        >
                                            Ore{displaySortArrow("ore")}
                                        </th>
                                        <th id="csv-th"
                                            onClick={() => handleSort("amount")}
                                        >
                                            Amount{displaySortArrow("amount")}
                                        </th>
                                        <th id="csv-th"
                                            onClick={() => handleSort("change")}
                                        >
                                            Change{displaySortArrow("change")}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedOres.map((ore) => {
                                        const currentAmount = csvData[ore] || 0;
                                        const previousAmount = previousAmounts[ore] || 0;
                                        const change = currentAmount - previousAmount;
                                        return (
                                            <tr key={ore}>
                                                <td>{ore}</td>
                                                <td>{currentAmount}</td>
                                                <td
                                                    className={
                                                        change > 0
                                                            ? "positive-change"
                                                            : change < 0
                                                                ? "negative-change"
                                                                : ""
                                                    }
                                                >
                                                    {change !== 0
                                                        ? change > 0
                                                            ? `+${change}`
                                                            : change
                                                        : ""}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CSVLoaderPopup;
