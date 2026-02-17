import React, { useState, useContext, useRef, useEffect, useMemo } from "react";
import { MiscContext } from "../context/MiscContext";
import { TradeContext } from "../context/TradeContext";
import { IconContext } from "../App";
import missingIcon from "../images/misc/Missing_Texture.png";

import patic from "../images/misc/patic.png";
import "../styles/LayerTable.css";
import "../styles/ValueChart.css";

function TradeTool() {
    /* Context hooks */
    const { tradeState, setTradeState, updateTradeOres, clearTradeSummary } =
    useContext(TradeContext);

    const { getCurrentCSV, getValueForMode, oreValsDict } =
    useContext(MiscContext);

    const { getImageSource } = useContext(IconContext);

    const csvData = getCurrentCSV();

    // Extract data from trade context
    const { quantities, discount, selectedOres } = tradeState;

    // Local UI states
    const [batchMode, setBatchMode] = useState("quantity"); // 'quantity' or 'av'
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [searchFocused, setSearchFocused] = useState(false);
    const [allSelected, setAllSelected] = useState(false);
    const [showUsage, setShowUsage] = useState(false);

    // Refs for DOM access
    const searchInputRef = useRef(null);
    const resultsRef = useRef(null);

    // Mode toggle button
    const toggleBatchMode = () => {
        setBatchMode((prev) => (prev === "quantity" ? "av" : "quantity"));
    };

    // Initialize state with all layers collapsed
    const [collapsedLayers, setCollapsedLayers] = useState(() => {
        const initialState = {};
        Object.values(oreValsDict).forEach((layerObj) => {
            initialState[layerObj.layerName] = true;
        });
        return initialState;
    });

    // Toggle layer collapse
    const toggleLayerCollapse = (layerName) => {
        setCollapsedLayers((prev) => ({
            ...prev,
            [layerName]: !prev[layerName],
        }));
    };

    /* Prepare complete ore list with layer information */
    const allOresWithLayers = Object.values(oreValsDict)
    .filter((layer) => !layer.layerName.includes("Essences"))
    .flatMap((layer) =>
        layer.layerOres.map((ore) => ({
            ...ore,
            layer: layer.layerName,
        }))
    );

    /* Group ores by layer for organized display */
    const oresByLayer = Object.values(oreValsDict)
    .filter((layer) => !layer.layerName.includes("Essences"))
    .map((layer) => ({
        layer: layer.layerName,
        ores: layer.layerOres.map((ore) => ({
            ...ore,
            layer: layer.layerName,
        })),
        background: layer.background,
    }));

    const memoizedOres = useMemo(() => allOresWithLayers, [allOresWithLayers]);

    // Track previous quantities to detect actual changes
    const prevQuantitiesRef = useRef(tradeState.quantities);

    useEffect(() => {
        if (memoizedOres) {
            const prevKeys = Object.keys(prevQuantitiesRef.current);
            const currentKeys = Object.keys(tradeState.quantities);
            // Only update if keys changed (ore added/removed) or quantities meaningfully changed
            if (
                prevKeys.length !== currentKeys.length ||
                    !prevKeys.every((k) => currentKeys.includes(k)) ||
                    !currentKeys.every((k) => prevKeys.includes(k))
            ) {
                updateTradeOres(memoizedOres);
            }
            prevQuantitiesRef.current = tradeState.quantities;
        }
    }, [tradeState.quantities, memoizedOres, updateTradeOres]);

    /* Toggle ore selection */
    const toggleOreSelection = (oreName) => {
        setTradeState((prev) => ({
            ...prev,
            selectedOres: prev.selectedOres.includes(oreName)
                ? prev.selectedOres.filter((name) => name !== oreName)
                : [...prev.selectedOres, oreName],
        }));
    };

    /* Apply batch quantity to selected ores */
    const applyBatchQuantity = () => {
        if (tradeState.selectedOres.length === 0) return;

        const newQuantities = { ...tradeState.quantities };

        tradeState.selectedOres.forEach((oreName) => {
            const oreData = allOresWithLayers.find((ore) => ore.name === oreName);
            if (!oreData) return;

            if (batchMode === "quantity") {
                // Direct quantity mode
                newQuantities[oreName] = Math.max(1, tradeState.batchQuantity);
            } else {
                // AV mode - calculate quantity needed to reach target AV
                const targetAV = tradeState.batchQuantity;
                const oreValue = getValueForMode(oreData);
                const calculatedQuantity = Math.ceil(targetAV * oreValue);
                newQuantities[oreName] = Math.max(1, calculatedQuantity);
            }
        });

        setTradeState((prev) => ({
            ...prev,
            quantities: newQuantities,
            selectedOres: [],
            batchQuantity: 0,
        }));

        // Update trade summary
        updateTradeOres(allOresWithLayers);
    };

    /* Clear selected ores */
    const clearSelection = () => {
        setTradeState((prev) => ({
            ...prev,
            selectedOres: [],
            batchQuantity: 0,
        }));
    };

    /* Check if ore is selected */
    const isOreSelected = (oreName) => selectedOres.includes(oreName);

    /* Check inventory availability */
    const hasEnoughOre = (oreObj) => {
        return csvData?.[oreObj.name] >= (quantities[oreObj.name] || 0);
    };

    /* Get available amount from inventory */
    const getAvailableAmount = (oreObj) => csvData?.[oreObj.name] || 0;

    /* Get list of ores with insufficient inventory */
    const missingOres = allOresWithLayers
    .filter((ore) => quantities[ore.name] > 0)
    .filter((ore) => !hasEnoughOre(ore))
    .map((ore) => ({
        ...ore,
        missing: Math.max(
            0,
            (quantities[ore.name] || 0) - (csvData[ore.name] || 0)
        ),
    }));

    /* Check if all ores are available */
    const allOresAvailable =
        Object.keys(quantities).length > 0 && !missingOres.length;

    /* Calculate AV for a single ore */
    const calculateAV = (oreName) => {
        const oreData = allOresWithLayers.find((ore) => ore.name === oreName);
        if (!oreData) return "0.0";
        const quantity = quantities[oreName] ?? 0;
        const value = getValueForMode(oreData);
        return (quantity / value).toFixed(1);
    };

    /* Calculate totals */
    const calculateTotals = () => {
        return Object.entries(quantities).reduce(
            (acc, [oreName, qty]) => {
                const oreData = allOresWithLayers.find((o) => o?.name === oreName);
                if (!oreData) return acc;
                const value = getValueForMode(oreData);
                const quantity = Number(qty) || 0;
                return {
                    totalOres: acc.totalOres + quantity,
                    totalAV: acc.totalAV + quantity / value,
                    discountedAV:
                    acc.discountedAV + (quantity / value) * (1 - discount / 100),
                };
            },
            { totalOres: 0, totalAV: 0, discountedAV: 0 }
        );
    };

    const totals = calculateTotals();

    /* Handle quantity change */
    const handleQuantityChange = (oreName, value) => {
        const numericValue = value === "" ? "" : Math.max(0, Number(value) || 0);
        const newQuantities = {
            ...tradeState.quantities,
            [oreName]: numericValue,
        };

        setTradeState((prev) => ({
            ...prev,
            quantities: newQuantities,
        }));
    };

    /* Handle discount change */
    const handleDiscountChange = (e) => {
        const value = parseFloat(e.target.value) || 0;
        setTradeState((prev) => ({
            ...prev,
            discount: Math.min(100, Math.max(0, value)),
        }));
    };

    /* Clear all quantities */
    const clearTrade = () => {
        setTradeState((prev) => ({
            ...prev,
            quantities: {},
            selectedOres: [],
            batchQuantity: 0,
        }));
        clearTradeSummary();
    };

    /* Remove an ore from the trade table */
    const handleRemoveOre = (oreObj) => {
        setTradeState((prev) => {
            const newQuantities = { ...prev.quantities };
            delete newQuantities[oreObj.name];
            // Also remove from selected ores if it was selected
            const newSelectedOres = prev.selectedOres.filter(
                (name) => name !== oreObj.name
            );
            return {
                ...prev,
                quantities: newQuantities,
                selectedOres: newSelectedOres,
            };
        });
        updateTradeOres(allOresWithLayers);
    };

    /* Generate CSS class name for ore gradient */
    const getOreClassName = (oreName) => {
        return `color-template-${oreName.toLowerCase().replace(/ /g, "-")}`;
    };

    const filterOres = (term, source = allOresWithLayers) => {
        if (!term.trim()) return [];

        const searchParts = term
        .toLowerCase()
        .replace("l:", "").split("/")
        .map((part) => part.trim());

        return source.filter((ore, layer) => {
            return searchParts.some((part) => 
                ore.name.toLowerCase().includes(part) 
                    || ore.layer.toLowerCase().includes(part)
            )
        });
    };

    const filteredOres = filterOres(searchTerm);

    // Add ore to trade table
    const handleAddOre = (oreObj) => {
        if (!tradeState.selectedOres.some((ore) => ore.name === oreObj.name)) {
            setTradeState((prev) => ({
                ...prev,
                quantities: {
                    ...prev.quantities,
                    [oreObj.name]: 1,
                },
            }));
        }

        setSearchFocused(true);
        searchInputRef.current?.focus();
    };

    const handleAddMultipleOres = (searchTerm, layerOption) => {
        const searchParts = searchTerm
        .toLowerCase()
        .split("/")
        .map((part) => part.trim());

        // Find all ores that match any part of the search
        const oresToAdd = allOresWithLayers.filter((ore) =>
            searchParts.some((part) => 
                layerOption ? ore.layer.toLowerCase().includes(part) : ore.name.toLowerCase().includes(part)
            )
        );

        // Add all matching ores
        setTradeState((prev) => {
            const newQuantities = { ...prev.quantities };
            oresToAdd.forEach((ore) => {
                if (!newQuantities[ore.name]) {
                    newQuantities[ore.name] = 1;
                }
            });
            return {
                ...prev,
                quantities: newQuantities,
            };
        });

        setSearchTerm("");
        searchInputRef.current?.focus();
        setSearchFocused(true);
        updateTradeOres(allOresWithLayers);
    };

    const handleKeyDown = (e, oresByLayer) => {
        if (!searchTerm) return;

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                const nextIndex =
                    selectedIndex < filteredOres.length - 1 ? selectedIndex + 1 : 0;
                setSelectedIndex(nextIndex);
                scrollToResult(nextIndex);
                break;

            case "ArrowUp":
                e.preventDefault();
                const prevIndex =
                    selectedIndex > 0 ? selectedIndex - 1 : filteredOres.length - 1;
                setSelectedIndex(prevIndex);
                scrollToResult(prevIndex);
                break;

            case "Enter":
                e.preventDefault();
                const searchTermTrim = searchTerm.toLowerCase().replace("l:", "");
                const layerFound = searchTerm.includes("l:") && oresByLayer.some(layer => layer.layer.toLowerCase().includes(searchTermTrim));
                if (searchTerm.includes("/")) {
                    handleAddMultipleOres(searchTermTrim, false);
                } else if (layerFound) {
                    handleAddMultipleOres(searchTermTrim, true);
                } else if (selectedIndex >= 0 && selectedIndex < filteredOres.length) {
                    handleAddOre(filteredOres[selectedIndex]);
                }
                break;

            case "Escape":
                setSearchTerm("");
                break;
            default:
                break;
        }
        updateTradeOres(allOresWithLayers);
    };

    const scrollToResult = (index) => {
        const resultsContainer = resultsRef.current;
        if (!resultsContainer) return;

        const selectedore = resultsContainer.children[index];
        if (!selectedore) return;

        const containerHeight = resultsContainer.clientHeight - 100;
        const oreOffsetTop = selectedore.offsetTop - 150;
        const oreHeight = selectedore.clientHeight - 10;

        const scrollTop = resultsContainer.scrollTop;
        const oreTop = oreOffsetTop - scrollTop;
        const oreBottom = oreTop + oreHeight;

        if (oreBottom > containerHeight) {
            resultsContainer.scrollTop = oreOffsetTop - containerHeight + oreHeight;
        } else if (oreTop < 0) {
            resultsContainer.scrollTop = oreOffsetTop;
        }
    };

    const [copiedFilter, setCopiedFilter] = useState(null);

    const generateSearchFilter = () => {
        // Function to generate shortest unique substrings for trade ores
        const generateShortestSubstrings = (tradeOres, allOres) => {
            const substrings = {};

            tradeOres.forEach((tradeOre) => {
                const name = tradeOre.name.toLowerCase();
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
                                otherOre.name !== tradeOre.name &&
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

                substrings[tradeOre.name] = foundSubstring || name;
            });

            return substrings;
        };

        if (tradeState.tradeOres.length === 0) {
            alert("No ores in trade table to export!");
            return;
        }

        // Generate shortest unique substrings for all trade ores
        const substrings = generateShortestSubstrings(
            tradeState.tradeOres,
            allOresWithLayers
        );

        // Remove redundant substrings - if multiple ores share the same substring, only keep one
        const uniqueSubstrings = new Set();
        const finalSubstrings = [];

        tradeState.tradeOres.forEach((ore) => {
            const substring = substrings[ore.name];
            if (!uniqueSubstrings.has(substring)) {
                uniqueSubstrings.add(substring);
                finalSubstrings.push(substring);
            }
        });

        // Create the search filter string
        const searchFilterString = finalSubstrings.join("/");

        navigator.clipboard.writeText(searchFilterString).then(() => {
            setCopiedFilter(searchFilterString);
            setTimeout(() => setCopiedFilter(null), 2000);
        });
    };

    const selectAllCurrentOres = () => {
        if(!allSelected) {
            tradeState.tradeOres.forEach((ore) => {
                if(!tradeState.selectedOres.includes(ore.name)) {
                    toggleOreSelection(ore.name);
                }
            });
        } else {
            tradeState.tradeOres.forEach((ore) => {
                if(tradeState.selectedOres.includes(ore.name)) {
                    toggleOreSelection(ore.name);
                }
            });
        }
        setAllSelected(!allSelected);
    };

    return (
        <div className="page-wrapper" id="trade">
            <div className="row-container" id="trade-row">
                <div className="col-container">
                    <h1>Trade Tool</h1>
                    <button
                        onClick={() => setShowUsage(!showUsage)}
                    >{showUsage ? "Hide" : "Show"} Usage Instructions</button>
                </div>
                {showUsage && (
                    <div className="usage-instructions" style={{top: "8em", position: "fixed", zIndex:"25000"}}>
                        <p>
                            ⛏ Type ore or layer names <span className="accent">in the search bar</span>, and hit enter
                            or click to add them to the current trade. You can use the
                            arrow keys to navigate up and down the results.
                        </p>
                        <p>
                            ⛏ <span className="accent">Click ores to select multiple</span>, then set their quantities
                            below.
                        </p>
                        <p>
                            ⛏ To <span className="accent">remove an individual ore</span>, click the red X button beside
                            the ore, in either the "Current Trade" table or the layer
                            table to the right.
                        </p>
                        <p>
                            ⛏ <span className="accent">Type in the quantity</span> for each ore you'd like to trade. You can press "tab" to cycle between them quicker.
                        </p>
                        <p>
                            ⛏ To <span className="accent">add a discount</span> to large orders, type the percent in the
                            "Discount %" box.
                        </p>
                        <p>
                            ⛏ <span className="accent">The Batch Quantity box</span> can set
                            either the AV of all selected ores, or the quantity. Click
                            the green button to switch between them.
                        </p>
                        <p>
                            ⛏ Click <span className="accent">"Apply Quantity" to set</span> the selected ores
                            (highlighted blue) to the specified quantity.
                        </p>
                        <p>⛏ Click "Clear Trade" to <span className="accent">reset the trade table.</span></p>
                    </div>

                )}
                {/* Search input */}
                <div className="box">
                    <div className="col-container"
                        style={{
                            alignores: "start",
                            gap: "0.5em"
                        }}>
                        <h2>Search and Add Discount</h2>
                        <strong>Hint: Add "/" between and hit enter <br></br> to select multiple at once!</strong>
                        <strong>Hint 2: Add "l:" before typing a layer <br></br> and hit enter to add all its ores.</strong>
                        <label htmlFor="search-input">
                            <input
                                id="search-input"
                                name="search"
                                autoComplete="off"
                                autoCorrect="off"
                                autoCapitalize="none"
                                spellCheck="false"
                                ref={searchInputRef}
                                type="text"
                                placeholder="Search ores or layers..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, oresByLayer)}
                                onFocus={() => setSearchFocused(true)}
                                onBlur={() => setSearchFocused(false)}
                                className="text-input"
                            />
                        </label>
                        {searchFocused && searchTerm && (
                            <ul className="search-results" ref={resultsRef} tabIndex="0">
                                {filteredOres.map((ore, index) => (
                                    <li
                                        key={`${ore.name}-${index}`}
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            handleAddOre(ore);
                                        }}
                                        className={`search-result-ore ${index === selectedIndex ? "selected" : ""}`}
                                    >
                                        {ore.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                        {searchTerm === "patic" && (
                            <img
                                src={patic}
                                alt="patic"
                            />
                        )}

                        {/* Discount input */}
                        <label htmlFor="discount-input">
                            <input
                                id="discount-input"
                                name="discount"
                                type="number"
                                min="0"
                                max="100"
                                step="1"
                                value={discount === 0 ? "" : discount}
                                onChange={handleDiscountChange}
                                className="quantity-input"
                                placeholder="Discount %"
                            />
                        </label>
                    </div>
                </div>

                <div className="box">
                    {/* Batch quantity controls */}
                    <h2>Batch Selector</h2>
                    <div className="row-container">
                        <div 
                            className="col-container"
                            style={{
                                justifyContent: "left",
                                gap: "0.5em"
                            }}>
                            Selected:<strong> {tradeState.selectedOres.length > 1 
                                ? `${tradeState.selectedOres.length} Ores` 
                                : tradeState.selectedOres.length === 0 ? "No Ores"
                                    : "1 Ore"}</strong>
                            <label htmlFor="batch-quantity">
                                {batchMode === "quantity" ? "Quantity:" : "# AV:"}
                                <input
                                    id="batch-quantity"
                                    name="batch-quantity"
                                    type="number"
                                    min="0"
                                    step={batchMode === "quantity" ? "1" : "any"}
                                    value={
                                        tradeState.batchQuantity === 0
                                            ? ""
                                            : tradeState.batchQuantity
                                    }
                                    onChange={(e) =>
                                        setTradeState((prev) => ({
                                            ...prev,
                                            batchQuantity: `${
batchMode === "quantity"
? Math.max(0, parseInt(e.target.value) || 0)
: Math.max(0, e.target.value || 0)
}`,
                                        }))
                                    }
                                    className="quantity-input"
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </label>
                        </div>
                        <div className="col-container"
                            style={{
                                justifyContent: "left",
                                gap: "0.5em"
                            }}>
                            <button
                                className="apply-button-small"
                                style={{width:"fit-content"}}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const newQuantities = { ...tradeState.quantities };
                                    tradeState.selectedOres.forEach((oreName) => {
                                        const oreData = allOresWithLayers.find(
                                            (ore) => ore.name === oreName
                                        );
                                        if (!oreData) return;
                                        const availableAmount = getAvailableAmount(oreData);
                                        if (availableAmount > 0) {
                                            newQuantities[oreName] = availableAmount;
                                        }
                                    });

                                    setTradeState((prev) => ({
                                        ...prev,
                                        quantities: newQuantities,
                                    }));

                                    updateTradeOres(allOresWithLayers);
                                }}
                                disabled={tradeState.selectedOres.length === 0}
                                title="Add all available quantities for selected ores"
                            >
                                +Max of Selected
                            </button>
                            <button onClick={toggleBatchMode}
                                className={batchMode !== "quantity" ? "color-template-ambrosine" : ""}
                            >   {batchMode === "quantity"
                                    ? "Use AV Mode"
                                    : "Use Quantity Mode"}
                            </button>
                            <button
                                onClick={applyBatchQuantity}
                                disabled={tradeState.selectedOres.length === 0}
                            >
                                Apply {batchMode === "quantity" ? "Quantity" : "AV"}
                            </button>
                            <button
                                onClick={clearSelection}
                                disabled={tradeState.selectedOres.length === 0}
                                style={{backgroundColor: "var(--red)"}}
                            >
                                Clear Selection
                            </button>
                        </div>
                    </div>
                </div>

                {/* Trade summary table */}
                <div
                    className="box" 
                    id="trade"
                >
                    <div className="row-container" style={{justifyContent: "left"}}>
                        <h2>Current Trade</h2>
                        <div className="col-container">
                            <button
                                style={{
                                    padding: "0px", 
                                    position: "absolute", 
                                    width: "2em", 
                                    height: "2em", 
                                    fontSize: "15px",
                                    right: "0.9em",
                                    top: "3.5em"
                                }}
                                className="copy-filter-btn"
                                id="trade"
                                onClick={generateSearchFilter}
                                title="Generate and copy search filter"
                            >
                                <i class="fas fa-clipboard"></i>
                            </button>
                            {copiedFilter && (
                                <div className="copy-confirmation">
                                    ✓  Copied!
                                </div>
                            )}
                            {allOresAvailable && tradeState.tradeOres > 0 &&
                                (<div className="comp-check">✓</div>)
                            }
                            {allOresAvailable &&
                                (<div className="comp-check">✓</div>)
                            }
                        </div>
                    </div>
                    {/* Totals and inventory status */}
                    <p>
                        Total AV: <span className="accent">{totals.totalAV.toFixed(1)}</span>
                    </p>
                    {discount > 0 && (
                        <p>
                            Discounted AV ({discount}%):{" "}
                            <span className="accent">
                                {Math.round(totals.totalAV * (1 - discount / 100)).toFixed(1)}
                            </span>
                        </p>
                    )}
                    <p>
                        Total # Ores: <span className="accent">{totals.totalOres}</span>
                    </p>
                    <p>&nbsp;</p>
                    <button onClick={clearTrade} style={{backgroundColor: "var(--red)"}}>
                        <span>Clear Trade</span>
                    </button>
                    {totals.totalAV > 0.000 && (
                        <>
                            <button style={{backgroundColor: "var(--selected-color)"}}
                                onClick={selectAllCurrentOres}
                                title="Select all ores currently in table"
                            >
                                {allSelected ? "Deselect All" : "Select All"}
                            </button>
                        </>
                    )}

                    {allOresAvailable ? (
                        <div className="box" style={{backgroundColor: "var(--green)"}}>
                            ✓ All ores available in inventory
                        </div>
                    ) : (
                            missingOres.length > 0 && (
                                <div className="box" style={{backgroundColor: "var(--red)"}}>
                                    <h3>✖  Missing:</h3>
                                    <ul classname="search-results">
                                        {missingOres.map((oreObj, index) => (
                                            <li key={index} className="search-result-ore">
                                                {oreObj.name}: {oreObj.missing}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )
                        )}
                    {tradeState.tradeOres.length > 0 ? (
                        <div className="table-wrapper"
                            style={{
                                width:"100%",
                                marginTop: "1em",
                                left: "0px",
                                bottom: "0px",
                                padding: "0px",
                            }}
                        >
                            <table>
                                <tbody>
                                    {tradeState.tradeOres
                                        .sort((a, b) => a.name.localeCompare(b.name))
                                        .map((ore) => (
                                            <tr style={{cursor: "pointer"}}
                                                key={ore.name}
                                                className={
                                                    isOreSelected(ore.name) ? "selected" : ""
                                                }
                                                onClick={() => toggleOreSelection(ore.name)}
                                            >
                                                <td
                                                    className={`name-column ${getOreClassName(ore.name)}`}
                                                    data-text={ore.name}
                                                    style={{                                
                                                        textWrap: "nowrap",
                                                        whiteSpace: "nowrap",
                                                    }}
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
                                                    <div className="quantity-cell">
                                                        <button
                                                            className="delete-button"
                                                            tabIndex="-1"
                                                            aria-label="Clear ore from trade"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleRemoveOre(ore);
                                                            }}
                                                        >
                                                            ✖
                                                        </button>
                                                        <button
                                                            className="apply-button-small"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                const availableAmount = getAvailableAmount(ore);
                                                                if (availableAmount > 0) {
                                                                    handleQuantityChange(
                                                                        ore.name,
                                                                        availableAmount
                                                                    );
                                                                }
                                                            }}
                                                            title={`Add all available ${ore.name} to trade`}
                                                            tabIndex="-1"
                                                        >
                                                            +All
                                                        </button>
                                                        <label
                                                            htmlFor={`summary-quantity-${ore.name}`}
                                                        >
                                                            <input
                                                                id={`summary-quantity-${ore.name}`}
                                                                aria-label="Ore quantity input"
                                                                type="number"
                                                                value={quantities[ore.name] ?? ""}
                                                                onChange={(e) =>
                                                                    handleQuantityChange(ore.name, e.target.value)
                                                                }
                                                                className="quantity-input"
                                                                min="1"
                                                                onClick={(e) => e.stopPropagation()}
                                                            />
                                                        </label>
                                                    </div>
                                                </td>
                                                <td style={{
                                                    textAlign: "left",
                                                    paddingLeft: "5px",
                                                    maxWidth: "5em", 
                                                    textOverflow: "ellipsis", 
                                                    overflow: "hidden"
                                                }}>{calculateAV(ore.name)}</td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                            <div className="box">
                                <p>No ores added to trade yet</p>
                            </div>
                        )}
                </div>
            </div>

            {/* Main table
            <div 
                className="box"
            >
                <button
                    tabIndex="-1"
                    onClick={() => {
                        const allCollapsed = {};
                        Object.values(oreValsDict).forEach((layerObj) => {
                            allCollapsed[layerObj.layerName] = true;
                        });
                        setCollapsedLayers(allCollapsed);
                    }}
                >
                    Collapse All
                </button>
                <button
                    tabIndex="-1"
                    onClick={() => {
                        const allExpanded = {};
                        Object.values(oreValsDict).forEach((layerObj) => {
                            allExpanded[layerObj.layerName] = false;
                        });
                        setCollapsedLayers(allExpanded);
                    }}
                >
                    Expand All
                </button>
                <table style={{
                    width: "100%",
                }}>
                    <tbody>
                        {oresByLayer.map(({ layer, ores, background }) => (
                            <React.Fragment key={layer}
                                style={{
                                    width: "fit-content"
                                }}
                            >
                                <tr
                                    style={{ 
                                        background: background,
                                    }}
                                    onClick={() => toggleLayerCollapse(layer)}
                                >
                                    <td colSpan="3" style={{cursor: "pointer"}}>
                                        <h2 
                                            className="table-header"
                                            style={{
                                                paddingTop: "5px",
                                                paddingLeft: "5px",
                                                paddingRight: "5px",
                                                textAlign: "center",
                                            }}
                                        >{layer.substring(0, layer.indexOf("\n"))}
                                            {collapsedLayers[layer] ? " ▶" : " ▼"}</h2>
                                    </td>
                                </tr>

                                {!collapsedLayers[layer] && (
                                    <>
                                        <tr>
                                            <td>
                                                <button
                                                    style={{width:"fit-content"}}
                                                    tabIndex="-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setTradeState((prev) => {
                                                            const newSelected = [...prev.selectedOres];
                                                            ores.forEach((ore) => {
                                                                if (!newSelected.includes(ore.name)) {
                                                                    newSelected.push(ore.name);
                                                                }
                                                            });
                                                            return {
                                                                ...prev,
                                                                selectedOres: newSelected,
                                                            };
                                                        });
                                                    }}
                                                >
                                                    Select All
                                                </button>
                                                <button
                                                    style={{width:"fit-content"}}
                                                    tabIndex="-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setTradeState((prev) => ({
                                                            ...prev,
                                                            selectedOres: prev.selectedOres.filter(
                                                                (name) =>
                                                                    !ores.some((ore) => ore.name === name)
                                                            ),
                                                        }));
                                                    }}
                                                >
                                                    Deselect All
                                                </button>
                                            </td>
                                        </tr>
                                        {ores.map((ore) => (
                                            <tr style={{cursor: "pointer"}}
                                                key={ore.name}
                                                className={
                                                    isOreSelected(ore.name) ? "selected" : ""
                                                }
                                                onClick={() => toggleOreSelection(ore.name)}
                                            >
                                                <td
                                                    className={`name-column ${getOreClassName(
ore.name
)}`}
                                                    data-text={ore.name}
                                                >
                                                    <img
                                                        src={OreIcons[ore.name.replace(/ /g, "_")]}
                                                        alt={`${ore.name} icon`}
                                                        className="ore-icon"
                                                    />
                                                    {ore.name}
                                                </td>
                                                <td>
                                                    <div className="quantity-cell">
                                                        <button
                                                            className="delete-button"
                                                            aria-label="Clear ore from trade"
                                                            tabIndex="-1"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleRemoveOre(ore);
                                                            }}
                                                        >
                                                            ✖
                                                        </button>
                                                        <button
                                                            className="apply-button-small"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                const availableAmount =
                                                                getAvailableAmount(ore);
                                                                if (availableAmount > 0) {
                                                                    handleQuantityChange(
                                                                        ore.name,
                                                                        availableAmount
                                                                    );
                                                                }
                                                            }}
                                                            title={`Add all available ${ore.name} to trade`}
                                                            tabIndex="-1"
                                                        >
                                                            +All
                                                        </button>
                                                        <label
                                                            htmlFor={`quantity-${ore.name}`}
                                                        >
                                                            <input
                                                                id={`quantity-${ore.name}`}
                                                                type="number"
                                                                value={quantities[ore.name] ?? ""}
                                                                onChange={(e) =>
                                                                    handleQuantityChange(
                                                                        ore.name,
                                                                        e.target.value
                                                                    )
                                                                }
                                                                className="quantity-input"
                                                                min="1"
                                                                onClick={(e) => e.stopPropagation()}
                                                            />
                                                        </label>
                                                    </div>
                                                </td>
                                                <td style={{
                                                    justifycontent: "left",
                                                    paddingleft: "5px"
                                                }}>{calculateAV(ore.name)}</td>
                                            </tr>
                                        ))}
                                    </>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
            */}
        </div>
    );
}

export default TradeTool;
