import React, { useContext, useState } from "react";
import { MiscContext } from "../context/MiscContext";
import { IconContext } from "../App";
import missingIcon from "../images/misc/Missing_Texture.png";

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

    const { getImageSource } = useContext(IconContext);

    const csvData = getCurrentCSV();
    const formatter = Intl.NumberFormat('en', { notation: 'compact', maximumSignificantDigits: 3 });
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
        if (!Number.isFinite(num)) return formatter.format(0);

        if (mode === 1) return formatter.format(num);

        const scaleFactor =
            mode === 2 ? 10
            : mode === 3 ? 100
            : mode === 4 ? 500
            : mode === 5 ? 1000
            : mode === 6 ? 50
            : mode === 7 ? (useSeparateRareMode && isRaresTable ? rareCustomMultiplier : customMultiplier)
            : 1;

        const scaledValue = num * scaleFactor;
        return formatter.format(scaledValue);
    };

    const getAverageCompletion = () => {
        const totalCompletion = data.reduce((sum, ore) => {
            const inventory = csvData[ore.name] || 0;
            const orePerUnit = calculateDisplayValue(ore);
            const completion = orePerUnit > 0
                ? capCompletion ? Math.min(1, inventory / orePerUnit) : inventory / orePerUnit
                : 0;
            return sum + completion;
        }, 0);
        return ((totalCompletion / data.length) * 100).toFixed(2);
    };

    const getTotalValue = () => {
        const total = data.reduce((sum, ore) => {
            const inventory = csvData[ore.name] || 0;
            const orePerUnit = calculateDisplayValue(ore);
            return orePerUnit > 0 ? sum + inventory / orePerUnit : sum;
        }, 0);
        return `${parseFloat(total.toFixed(1))} ${modeStr}`;
    };

    const getHighestValue = () => {
        const highestore = data.reduce(
            (max, ore) => {
                const inventory = csvData[ore.name] || 0;
                const orePerUnit = calculateDisplayValue(ore);
                const numV = orePerUnit > 0 ? inventory / orePerUnit : 0;
                return numV > max.value ? { name: ore.name, value: numV } : max;
            },
            { name: "", value: 0 }
        );
        return `${highestore.name} (${highestore.value.toFixed(2)} ${modeStr})`;
    };

    const handleInventoryChange = (oreName, newValue) => {
        const numericValue = Math.max(0, isNaN(newValue) ? 0 : Number(newValue));
        updateCSVData((prev) => ({
            ...prev,
            [oreName]: numericValue,
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
            const filterores = matchingFilter.split(": ")[1];
            navigator.clipboard.writeText(filterores.trim()).then(() => {
                setCopiedFilter(filterores);
                setTimeout(() => setCopiedFilter(null), 2000);
            });
        }
    };

    return (
        <div className="table-wrapper">
            <div className="layer-gradient" style={{ background: gradient }}>
                {getAverageCompletion() === "100.00" && (
                    <div className="comp-check">✓</div>
                )}
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
                        {!title.includes("Rares") && !title.includes("True Rares") && <th>1 AV</th>}
                        {(title.includes("Rares") || title.includes("True Rares")) && <th>AV</th>}
                        <th>{currentMode === 7 ? `${modeStr}` : `1 ${modeStr}`}</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((ore, index) => {
                        const isEssences = title.includes("Essences");
                        const isRares = title.includes("Rares\nMore");
                        const isTrueRares = title.includes("True Rares");
                        const inventory = csvData[ore.name] || 0;
                        const baseValue = getValueForMode(ore);
                        const percentage = calculatePercentage(ore, inventory);
                        const roundedNumV = formatter.format(inventory / calculateDisplayValue(ore));

                        return (
                            <tr key={index}>
                                <td
                                    className={`name-column ${getOreClassName(ore.name)}`}
                                    data-text={ore.name}
                                >
                                    <img
                                        src={getImageSource(ore.name)}
                                        loading="lazy"
                                        alt={`${ore.name} icon`}
                                        className="ore-icon"
                                        onError={(e) => {
                                            console.warn(`Missing icon for: ${ore.name}`);
                                            e.target.src = missingIcon;
                                        }}
                                    />
                                    {ore.name}
                                </td>
                                {!isEssences && (
                                    <td className={
                                        percentage <= 100.0
                                            ? `percent-${Math.floor(percentage / 10) * 10}`
                                            : "percent-over100"
                                    }>
                                        {percentage}%
                                    </td>
                                )}
                                <td className="v-inventory-cell">
                                    <div className="inventory-wrapper">
                                        <span className="value-display" aria-hidden="true">
                                            {inventory.toLocaleString()}
                                        </span>
                                        <input
                                            id={`inventory-${ore.name.replace(/\W+/g, "-")}`}
                                            name={`inventory-${index}`}
                                            type="text"
                                            min="0"
                                            step="1"
                                            value={inventory}
                                            aria-label={`Edit ${ore.name} quantity`}
                                            className="v-inventory-input"
                                            onChange={(e) => {
                                                if (e.target.value === "") return;
                                                const numericValue = Math.max(0, parseInt(e.target.value) || 0);
                                                handleInventoryChange(ore.name, numericValue);
                                            }}
                                            onFocus={(e) => {
                                                e.target.select();
                                                e.target.dataset.prevValue = e.target.value;
                                            }}
                                            onBlur={(e) => {
                                                const newValue = e.target.value === "" ? 0 : Math.max(0, parseInt(e.target.value) || 0);
                                                if (newValue !== parseInt(e.target.dataset.prevValue || 0)) {
                                                    handleInventoryChange(ore.name, newValue);
                                                }
                                                if (e.target.value === "") e.target.value = "0";
                                            }}
                                            onKeyDown={(e) => {
                                                if (["Backspace", "Delete"].includes(e.key)) {
                                                    if (e.target.value.length === 1) e.target.value = "";
                                                }
                                                if (e.key === "Enter") e.target.blur();
                                            }}
                                        />
                                    </div>
                                </td>
                                {!isEssences && (
                                    <>
                                        <td>{roundedNumV}</td>
                                        {!(isRares || isTrueRares) && <td>{formatter.format(baseValue)}</td>}
                                        {isTrueRares && <td>{1 / baseValue}</td>}
                                        {isRares && <td>{(1 / baseValue).toFixed(2)}</td>}
                                        <td>{(useSeparateRareMode && isRaresTable) ? formatValue(baseValue, rareValueMode) : formatValue(baseValue, currentMode)}</td>
                                    </>
                                )}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <div className="table-footer">
                <p>⛏ {modeStr} Completion: <span className="accent">{title.includes("Essence") ? "N/A" : `${getAverageCompletion()}%`}</span></p>
                <p>⛏ Total Value: <span className="accent">{title.includes("Essence") ? "N/A" : getTotalValue()}</span></p>
                <p>⛏ Highest Value Ore: <span className="accent">{title.includes("Essence") ? "N/A" : getHighestValue()}</span></p>
            </div>
        </div>
    );
};

export default LayerTable;
