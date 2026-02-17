import React, { useContext, useRef, useState } from "react";
import { MiscContext } from "../context/MiscContext";
import { PinListContext } from "../context/PinListContext";
import { IconContext } from "../App";

import missingIcon from "../images/misc/Missing_Texture.png";

import "../styles/CustomPinList.css";

const CustomPinList = ({ isOpen, onClose }) => {
    const { oreValsDict, getValueForMode, getOreClassName, getCurrentCSV } =
    useContext(MiscContext);
    const {
        pinListState,
        addToPinList,
        removeFromPinList,
        updatePinQuantity,
        clearPinList,
        handlePinSearchTermChange,
        handlePinSearchFocusChange,
        handlePinSearchIndexChange,
        addMultipleOresToPinList,
        filterOres,
        // useAVMode,
        // setUseAVMode
    } = useContext(PinListContext);

    const { getImageSource } = useContext(IconContext);

    // Get user's inventory data
    const csvData = getCurrentCSV();

    // Refs for DOM access
    const searchInputRef = useRef(null);
    const resultsRef = useRef(null);

    // Prepare complete ore list
    const allOresWithLayers = Object.values(oreValsDict)
    .filter((layer) => !layer.layerName?.includes("Essences"))
    .flatMap(
        (layer) =>
            layer.layerOres?.map((ore) => ({
                ...ore,
                layer: layer.layerName,
            })) || []
    );

    const { searchTerm, searchFocused, selectedSearchIndex, quantities } =
        pinListState;
    const filteredOres = filterOres(searchTerm, allOresWithLayers);

    // Get available amount from inventory for pinned ore
    const getAvailableAmount = (oreObj) => csvData?.[oreObj.name] || 0;

    // Check if user has enough of the pinned ore
    const hasEnoughOre = (oreObj) => {
        return getAvailableAmount(oreObj) >= (quantities[oreObj.name] || 0);
    };

    // Calculate progress percentage for progress bar
    const getProgressPercentage = (oreObj) => {
        const available = getAvailableAmount(oreObj);
        const required = quantities[oreObj.name] || 0;
        if (required === 0) return 0;
        return Math.min(100, (available / required) * 100);
    };

    // Handle keyboard navigation in search
    const handleKeyDown = (e) => {
        if (!searchTerm) return;

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                const nextIndex =
                    selectedSearchIndex < filteredOres.length - 1
                        ? selectedSearchIndex + 1
                        : 0;
                handlePinSearchIndexChange(nextIndex);
                scrollToResult(nextIndex);
                break;

            case "ArrowUp":
                e.preventDefault();
                const prevIndex =
                    selectedSearchIndex > 0
                        ? selectedSearchIndex - 1
                        : filteredOres.length - 1;
                handlePinSearchIndexChange(prevIndex);
                scrollToResult(prevIndex);
                break;

            case "Enter":
                e.preventDefault();
                if (searchTerm.includes("/")) {
                    addMultipleOresToPinList(searchTerm, allOresWithLayers);
                } else if (
                    selectedSearchIndex >= 0 &&
                        selectedSearchIndex < filteredOres.length
                ) {
                    addToPinList(filteredOres[selectedSearchIndex]);
                }
                break;

            case "Escape":
                handlePinSearchTermChange("");
                break;
            default:
                break;
        }
    };

    const scrollToResult = (index) => {
        const resultsContainer = resultsRef.current;
        if (!resultsContainer) return;

        const selectedItem = resultsContainer.children[index];
        if (!selectedItem) return;

        const containerHeight = resultsContainer.clientHeight;
        const itemOffsetTop = selectedItem.offsetTop;
        const itemHeight = selectedItem.clientHeight;

        const scrollTop = resultsContainer.scrollTop;
        const itemTop = itemOffsetTop - scrollTop;
        const itemBottom = itemTop + itemHeight;

        if (itemBottom > containerHeight) {
            resultsContainer.scrollTop = itemOffsetTop - containerHeight + itemHeight;
        } else if (itemTop < 0) {
            resultsContainer.scrollTop = itemOffsetTop;
        }
    };

    // Calculate totals for pinned ores
    const calculatePinTotals = () => {
        return Object.entries(quantities).reduce(
            (acc, [oreName, qty]) => {
                const oreData = allOresWithLayers.find((o) => o?.name === oreName);
                if (!oreData) return acc;
                const value = getValueForMode(oreData);
                const quantity = Number(qty) || 0;
                return {
                    totalOres: acc.totalOres + quantity,
                    totalAV: acc.totalAV + quantity / value,
                };
            },
            { totalOres: 0, totalAV: 0 }
        );
    };

    // Function to generate shortest unique substrings for pinned ores
    const generatePinnedOresFilter = () => {
        if (pinListState.pinnedOres.length === 0) return "";

        // Get all ores (pinned + all available) for comparison
        const allOres = [...allOresWithLayers];
        const pinnedOres = pinListState.pinnedOres;

        const substrings = {};

        // Generate unique substrings for each pinned ore
        pinnedOres.forEach((pinnedOre) => {
            const name = pinnedOre.name.toLowerCase();
            let foundSubstring = "";

            // Try increasingly longer substrings from different positions
            outer: for (let length = 1; length <= name.length; length++) {
                // Try all possible starting positions for this length
                for (let start = 0; start <= name.length - length; start++) {
                    const currentSubstring = name.slice(start, start + length);

                    // Check if this substring is unique across all ores
                    let isUnique = true;
                    for (let j = 0; j < allOres.length; j++) {
                        const otherOre = allOres[j];
                        if (
                            otherOre.name !== pinnedOre.name &&
                                otherOre.name.toLowerCase().includes(currentSubstring)
                        ) {
                            isUnique = false;
                            break;
                        }
                    }

                    if (isUnique) {
                        foundSubstring = currentSubstring;
                        break outer;
                    }
                }
            }

            substrings[pinnedOre.name] = foundSubstring || name;
        });

        // Remove redundant substrings - if multiple ores share the same substring, only keep one
        const uniqueSubstrings = new Set();
        const finalSubstrings = [];

        pinnedOres.forEach((ore) => {
            const substring = substrings[ore.name];
            if (!uniqueSubstrings.has(substring)) {
                uniqueSubstrings.add(substring);
                finalSubstrings.push(substring);
            }
        });

        // Create the search filter string
        const searchString = finalSubstrings.join("/");

        return `${searchString}`;
    };

    // Function to copy to clipboard
    const copyPinnedFilterToClipboard = () => {
        const filterString = generatePinnedOresFilter();
        if (!filterString) {
            return;
        }

        navigator.clipboard.writeText(filterString);
    };

    const pinTotals = calculatePinTotals();

    return (
        <div className={`pinlist-container ${isOpen ? "open" : ""}`}>
            {pinListState.pinnedOres.length > 0 && (
                <button className="copy-filter-btn"
                    onClick={copyPinnedFilterToClipboard}
                    style={{top: "0.5em", left: "0.5em"}}
                >
                    <i className="fa-solid fa-clipboard"></i>
                </button>
            )}
            <div className="row-container">
                <h3>
                    &nbsp;&nbsp; <i class="fas fa-thumbtack"></i>
                    &nbsp;Custom Pin List</h3>
                <button onClick={onClose} className="close-button">
                    ×
                </button>
            </div>
            <label htmlFor="search-input" style={{tabIndex: "0"}}>
                <input
                    className="text-input"
                    id="search-input"
                    name="search"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="none"
                    spellCheck="false"
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search ores..."
                    value={searchTerm}
                    onChange={(e) => handlePinSearchTermChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => handlePinSearchFocusChange(true)}
                    onBlur={() => handlePinSearchFocusChange(false)}
                    autoFocus
                />
            </label>
            {searchFocused && searchTerm && (
                <ul className="search-results" ref={resultsRef}>
                    {filteredOres.map((ore, index) => (
                        <li
                            key={`${ore.name}-${index}`}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                addToPinList(ore);
                            }}
                            className={`search-result-item ${ index === selectedSearchIndex ? "selected" : ""}`}
                        >
                            {ore.name}
                        </li>
                    ))}
                </ul>
            )}

            {pinListState.pinnedOres.length > 0 && (
                <div className="box" style={{width: "100%", fontSize: "1.1rem"}}>
                    <button 
                        className="reset-button"
                        onClick={clearPinList} 
                        style={{
                            width: "fit-content", 
                            height: "fit-content",
                            padding: "0.5em auto"
                        }}>Clear</button>
                        <br></br>Total AV:{" "}
                        <span className="accent">
                            {pinTotals.totalAV.toFixed(1)}
                        </span>
                        <br></br>Total Ores:{" "}
                        <span className="accent">
                            {pinTotals.totalOres}
                        </span>
                </div>
            )}
            {/* Pinned ores table */}
            <div className="table-wrapper" style={{width: "350px", maxHeight: "500px", overflowY: "scroll"}}>
                {pinListState.pinnedOres.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Ore</th>
                                <th># | Progress</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pinListState.pinnedOres
                                .sort((a, b) => a.name.localeCompare(b.name))
                                .map((ore) => (
                                    <tr key={ore.name}>
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
                                        <td>
                                            <div className="col-container" 
                                                style={{
                                                    justifyContent: "left",
                                                    alignItems: "start",
                                                    gap: "2px",
                                                    padding: "2px auto"
                                                }}>
                                                <div className="row-container" 
                                                    style={{
                                                        width: "100%", 
                                                        justifyContent: "space-between",
                                                        gap: "2px",
                                                        padding: "2px auto"
                                                    }}>
                                                    <button
                                                        className="delete-button"
                                                        tabIndex="-1"
                                                        aria-label="Remove ore from pin list"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            removeFromPinList(ore.name);
                                                        }}
                                                    >
                                                        ✖
                                                    </button>
                                                    <label>
                                                        <input
                                                            id={`pin-quantity-${ore.name}`}
                                                            aria-label="Ore quantity input"
                                                            type="number"
                                                            step="1"
                                                            value={quantities[ore.name] ?? ""}
                                                            onChange={(e) =>
                                                                updatePinQuantity(ore, e.target.value)
                                                            }
                                                            className="quantity-input"
                                                            min="1"
                                                            onClick={(e) => e.stopPropagation()}
                                                        />
                                                    </label>                
                                                    {hasEnoughOre(ore) &&
                                                        (<div className="comp-check" id="pin">✓</div>)
                                                    }
                                                </div>
                                                <div className="progress-wrapper">
                                                    <div className="progress-bar">
                                                        <span className="progress-bar-fill" style={{width: `${getProgressPercentage(ore)}%`}}></span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                ) : (
                        <h3>No ores pinned yet</h3>
                    )}
            </div>
        </div>
    );
};

export default CustomPinList;
