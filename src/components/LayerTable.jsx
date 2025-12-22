import React, { useContext, useState } from "react";

import { MiscContext } from "../context/MiscContext";


import { OreIcons } from "../data/OreIcons";
import missingIcon from "../images/ore-icons/Missing_Texture.png";

import "../styles/AllGradients.css";
import "../styles/ValueChart.css";
import "../styles/LayerTable.css";

const LayerTable = ({
    data,
    title,
    currentMode,
    customMultiplier,
    gradient,
    searchFilters,
    modeStr,
    calculateDisplayValue,
    useSeparateRareMode,
    rareCustomMultiplier,
}) => {
    const {
        getCurrentCSV,
        getOreClassName,
        updateCSVData,
        getValueForMode,
        capCompletion,
        oreValsDict,
        rareValueMode
    } = useContext(MiscContext);

    const csvData = getCurrentCSV();

    const [copiedFilter, setCopiedFilter] = useState(null);

    // null check for oreValsDict
    if (!oreValsDict) {
        return (
            <div className="table-wrapper">
                <h2>{title}</h2>
                <p>Loading data...</p>
            </div>
        );
    }

    // Determine if this table shows rares
    const isRaresTable = title.includes("Rares\nMore") || title.includes("True Rares");

    // Function to calculate the percentage with bounds
    const calculatePercentage = (ore, inventory) => {
        const orePerUnit = calculateDisplayValue(ore);
        return orePerUnit > 0
            ? capCompletion
                ? Math.min(100, (inventory / orePerUnit) * 100).toFixed(2)
                : ((inventory / orePerUnit) * 100).toFixed(2)
            : 0;
    };

    const formatValue = (value, mode = currentMode) => {
        const num = Number(value);
        if (!Number.isFinite(num)) return 0;

        // For /AV (mode 1) - return raw number exactly as provided
        if (mode === 1) return num;

        // Calculate scaled value
        const scaleFactor =
            mode === 2
                ? 10 // UV
                : mode === 3
                    ? 100 // NV
                    : mode === 4
                        ? 500 // TV
                        : mode === 5
                            ? 1000 // SV
                            : mode === 6
                                ? 50 // RV
                                : mode === 7
                                    ? (useSeparateRareMode && isRaresTable ? rareCustomMultiplier : customMultiplier) // Custom
                                    : 1; // Default to 1

        const scaledValue = num * scaleFactor;

        // Strict truncation function (no rounding)
        const truncate = (n, decimals) => {
            const factor = 10 ** decimals;
            return Math.trunc(n * factor) / factor;
        };

        // Return the numeric value based on mode
        switch (currentMode) {
            case 1:
                return truncate(scaledValue, 3);
            case 2:
                return truncate(scaledValue, 2);
            case 3:
                return truncate(scaledValue, 2);
            case 6:
                return truncate(scaledValue, 2);
            case 7:
                return truncate(scaledValue, 3);
            default:
                return truncate(scaledValue, 3);
        }
    };

    const formatDisplayValue = (value, mode) => {
        if (value === "N/A" || title.includes("Essence")) return "N/A";
        const num = formatValue(value, mode);
        
        if (title.includes("True Rares") || title.includes("Common Than")) {
            return Math.ceil(num.toFixed(3));
        }

        // Format with suffix for display purposes (M or K)
        if (Math.abs(num) >= 1000000) {
            return (num / 1000000).toFixed(3).replace(/\.?0+$/, "") + "M";
        }

        if (Math.abs(num) >= 1000) {
            return (num / 1000).toFixed(3).replace(/\.?0+$/, "") + "K";
        }


        return num.toFixed(3).replace(/\.?0+$/, "");
    };

    // Calculate completion percentage
    const getAverageCompletion = () => {
        const totalCompletion = data.reduce((sum, item) => {
            const inventory = csvData[item.name] || 0;
            const orePerUnit = calculateDisplayValue(item);
            const completion =
                orePerUnit > 0
                    ? capCompletion
                        ? Math.min(1, inventory / orePerUnit)
                        : inventory / orePerUnit
                    : 0;
            return sum + completion;
        }, 0);
        return ((totalCompletion / data.length) * 100).toFixed(2);
    };

    // Calculate total values
    const getTotalValue = () => {
        const total = data.reduce((sum, item) => {
            const inventory = csvData[item.name] || 0;
            const orePerUnit = calculateDisplayValue(item);
            return orePerUnit > 0 ? sum + inventory / orePerUnit : sum;
        }, 0);

        return `${parseFloat(total.toFixed(1))} ${modeStr}`;
    };

    // Find highest value ore
    const getHighestValue = () => {
        const highestItem = data.reduce(
            (max, item) => {
                const inventory = csvData[item.name] || 0;
                const orePerUnit = calculateDisplayValue(item);
                const numV = orePerUnit > 0 ? inventory / orePerUnit : 0;
                return numV > max.value ? { name: item.name, value: numV } : max;
            },
            { name: "", value: 0 }
        );

        return `${highestItem.name} (${highestItem.value.toFixed(2)} ${modeStr})`;
    };

    // Handle inventory changes
    const handleInventoryChange = (itemName, newValue) => {
        const numericValue = Math.max(0, isNaN(newValue) ? 0 : Number(newValue));
        updateCSVData((prev) => ({
            ...prev,
            [itemName]: numericValue,
        }));
    };

    const findMatchingFilter = (layerName) => {
        return searchFilters.find((filter) => {
            const filterName = filter.split(":")[0]?.trim();
            return filterName && layerName.includes(filterName);
        });
    };

    const copyLayerFilter = () => {
        const matchingFilter = findMatchingFilter(title);
        if (matchingFilter) {
            const filterItems = matchingFilter.split(": ")[1];
            navigator.clipboard.writeText(filterItems.trim()).then(() => {
                setCopiedFilter(filterItems);
                setTimeout(() => setCopiedFilter(null), 2000);
            });
        }
    };

    return (
        <div className="table-wrapper">
            <div className="layer-gradient"
                style={{ background: gradient }}
            >
                {getAverageCompletion() === "100.00" &&
                    (<div className="comp-check">✓</div>)
                }
                <pre>
                    <div className="row-container">
                    <button
                        className="copy-filter-btn"
                        onClick={copyLayerFilter}
                        title="Copy search filter for this layer"
                    >
                        <i className="fa fa-clipboard"></i>
                    </button>
                    {copiedFilter && (
                        <div className="copy-confirmation">✓ Copied!</div>
                    )}
                    </div>
                    <h2 className="table-header" data-text={title}>
                        {title}
                    </h2>
                </pre>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Ore Name</th>
                        <th>{modeStr}%</th>
                        <th>#</th>
                        <th>{modeStr}s</th>
                        {!title.includes("Rares") && !title.includes("True Rares") && (
                            <th>1 AV</th>
                        )}
                        {(title.includes("Rares") || title.includes("True Rares")) && (
                            <th>AV</th>
                        )}
                        <th>{
                            currentMode === 7 ? `${modeStr}`
                                : `1 ${modeStr}`}</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => {
                        const isEssences = title.includes("Essences");
                        const isRares = title.includes("Rares\nMore");
                        const isTrueRares = title.includes("True Rares");
                        const inventory = csvData[item.name] || 0;
                        const baseValue = getValueForMode(item);
                        const percentage = calculatePercentage(item, inventory);
                        const unroundedNumV = inventory / calculateDisplayValue(item);
                        const roundedNumV =
                            currentMode === 1
                                ? unroundedNumV.toFixed(0)
                                : currentMode === 2
                                    ? unroundedNumV.toFixed(1)
                                    : currentMode === 3
                                        ? unroundedNumV.toFixed(2)
                                        : currentMode === 4
                                            ? unroundedNumV.toFixed(3)
                                            : currentMode === 5
                                                ? unroundedNumV.toFixed(3)
                                                : currentMode === 6
                                                    ? unroundedNumV.toFixed(2)
                                                    : currentMode === 7
                                                        ? unroundedNumV.toFixed(2)
                                                        : "0";

                        return (
                            <tr key={index}>
                                <td
                                    className={`name-column ${getOreClassName(item.name)}`}
                                    data-text={item.name}
                                >
                                    {OreIcons[item.name.replace(/ /g, "_")] ? (
                                        <img
                                            src={OreIcons[item.name.replace(/ /g, "_")]}
                                            alt={`${item.name} icon`}
                                            className="ore-icon"
                                            onError={(e) => {
                                                console.error(`Missing icon for: ${item.name}`);
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
                                    {item.name}
                                </td>
                                {/* Percentage column */}
                                {!isEssences && (
                                    <td
                                        className={
                                            percentage <= 100.0
                                                ? `percent-${Math.floor(percentage / 10) * 10}`
                                                : "percent-over100"
                                        }
                                    >
                                        {percentage}%
                                    </td>
                                )}
                                {/* Inventory column - editable */}
                                <td className="v-inventory-cell">
                                    <div className="inventory-wrapper">
                                        <span className="value-display" aria-hidden="true">
                                            {inventory.toLocaleString()}
                                        </span>
                                        <input
                                            id={`inventory-${item.name.replace(/\W+/g, "-")}`}
                                            name={`inventory-${index}`}
                                            type="text"
                                            min="0"
                                            step="1"
                                            value={inventory}
                                            aria-label={`Edit ${item.name} quantity`}
                                            className="v-inventory-input"
                                            onChange={(e) => {
                                                if (e.target.value === "") return;
                                                const numericValue = Math.max(
                                                    0,
                                                    parseInt(e.target.value) || 0
                                                );
                                                handleInventoryChange(item.name, numericValue);
                                            }}
                                            onFocus={(e) => {
                                                e.target.select();
                                                e.target.dataset.prevValue = e.target.value;
                                            }}
                                            onBlur={(e) => {
                                                const newValue =
                                                    e.target.value === ""
                                                        ? 0
                                                        : Math.max(0, parseInt(e.target.value) || 0);
                                                if (
                                                    newValue !== parseInt(e.target.dataset.prevValue || 0)
                                                ) {
                                                    handleInventoryChange(item.name, newValue);
                                                }
                                                if (e.target.value === "") e.target.value = "0";
                                            }}
                                            onKeyDown={(e) => {
                                                if (["Backspace", "Delete"].includes(e.key)) {
                                                    if (e.target.value.length === 1) {
                                                        e.target.value = "";
                                                    }
                                                }
                                                if (e.key === "Enter") e.target.blur();
                                            }}
                                        />
                                    </div>
                                </td>
                                {!isEssences && (
                                    <>
                                        <td>{roundedNumV}</td>
                                        {!(isRares || isTrueRares) && (
                                            <td>
                                                {formatDisplayValue(baseValue, 1)}
                                            </td>
                                        )}
                                        {isTrueRares && <td>{1 / baseValue}</td>}
                                        {isRares && <td>{(1 / baseValue).toFixed(2)}</td>}
                                        <td>{(useSeparateRareMode && isRaresTable) ? formatDisplayValue(baseValue, rareValueMode) : formatDisplayValue(baseValue, currentMode)}</td>
                                    </>
                                )}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <div className="table-footer">
                <p>
                    ⛏ {modeStr} Completion:{" "}
                    <span className="accent">
                        {title.includes("Essence") ? "N/A" : `${getAverageCompletion()}%`}
                    </span>
                </p>
                <p>
                    ⛏ Total Value:{" "}
                    <span className="accent">
                        {title.includes("Essence") ? "N/A" : getTotalValue()}
                    </span>
                </p>
                <p>
                    ⛏ Highest Value Ore:{" "}
                    <span className="accent">
                        {title.includes("Essence") ? "N/A" : getHighestValue()}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default LayerTable;
