
/* ZTT | Trading tool component (Refactored 5/2/25)
   Simplified trading tool with:
   - All ores displayed in layer groups
   - Single column for quantity inputs
   - Real-time AV calculation
   - Value mode selection
   - Discount application
   - two-column layout
   Removed features:
   - Receive functionality
   - Search filtering
   - Inventory management
*/

import React, { useState, useContext, useRef, useEffect, useMemo } from "react";
import NavBar from "../components/NavBar";
import { MiscContext } from "../context/MiscContext";
import { TradeContext } from "../context/TradeContext";
import { OreIcons } from "../data/OreIcons";
import "../styles/TradeTool.css";
import "../styles/AllGradients.css";
import "../styles/LayerTable.css";

function TradeTool() {
  /* Context hooks */
  const {
    tradeState,
    setTradeState,
    updateTradeOres,
    clearTradeSummary
  } = useContext(TradeContext);

  const {
    csvData,
    valueMode,
    setValueMode,
    getValueForMode,
    oreValsDict
  } = useContext(MiscContext);

  // Extract data from trade context
  const { quantities, discount, selectedOres } = tradeState;

  // Local UI states
  const [batchMode, setBatchMode] = useState('quantity'); // 'quantity' or 'av'
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
   const [showDropdown, setShowDropdown] = useState(false);

  // Refs for DOM access
  const searchInputRef = useRef(null);
  const resultsRef = useRef(null);

  // Mode toggle button
  const toggleBatchMode = () => {
    setBatchMode(prev => prev === 'quantity' ? 'av' : 'quantity');
  };

  // Initialize state with all layers collapsed
  const [collapsedLayers, setCollapsedLayers] = useState(() => {
    const initialState = {};
    Object.keys(oreValsDict).forEach(layer => {
      initialState[layer] = true; // true means collapsed
    });
    return initialState;
  });

  // Toggle layer collapse
  const toggleLayerCollapse = (layerName) => {
    setCollapsedLayers(prev => ({
      ...prev,
      [layerName]: !prev[layerName]
    }));
  };

  /* Prepare complete ore list with layer information */
  const allOresWithLayers = Object.entries(oreValsDict)
    .flatMap(([layerName, ores]) =>
      ores.map((ore) => ({
        ...ore,
        layer: layerName,
      }))
    );

  /* Group ores by layer for organized display */
  const oresByLayer = Object.entries(oreValsDict).map(([layerName, ores]) => ({
    layer: layerName,
    ores: ores.map(ore => ({
      ...ore,
      layer: layerName,
    }))
  }));

  // Memoize the ores data
  const memoizedOres = useMemo(() => allOresWithLayers, [allOresWithLayers]);

  // Track previous quantities to detect actual changes
  const prevQuantitiesRef = useRef(tradeState.quantities);

  useEffect(() => {
    if (memoizedOres) {
      const prevKeys = Object.keys(prevQuantitiesRef.current);
      const currentKeys = Object.keys(tradeState.quantities);
      // Only update if keys changed (ore added/removed) or quantities meaningfully changed
      if (prevKeys.length !== currentKeys.length ||
          !prevKeys.every(k => currentKeys.includes(k)) ||
          !currentKeys.every(k => prevKeys.includes(k))) {
        updateTradeOres(memoizedOres);
      }
      prevQuantitiesRef.current = tradeState.quantities;
    }
  }, [tradeState.quantities, memoizedOres, updateTradeOres]);

  /* Toggle ore selection */
  const toggleOreSelection = (oreName) => {
    setTradeState(prev => ({
      ...prev,
      selectedOres: prev.selectedOres.includes(oreName)
        ? prev.selectedOres.filter(name => name !== oreName)
        : [...prev.selectedOres, oreName]
    }));
  };

  /* Apply batch quantity to selected ores */
  const applyBatchQuantity = () => {
    if (tradeState.selectedOres.length === 0) return;

    const newQuantities = { ...tradeState.quantities };

    tradeState.selectedOres.forEach(oreName => {
      const oreData = allOresWithLayers.find(ore => ore.name === oreName);
      if (!oreData) return;

      if (batchMode === 'quantity') {
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

    setTradeState(prev => ({
      ...prev,
      quantities: newQuantities,
      selectedOres: [], // Clear selection after applying
      batchQuantity: 0  // Reset batch quantity
    }));

    // Update trade summary
    updateTradeOres(allOresWithLayers);
  };

  /* Clear selected ores */
  const clearSelection = () => {
    setTradeState(prev => ({
      ...prev,
      selectedOres: [],
      batchQuantity: 0
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
    .filter(ore => quantities[ore.name] > 0)
    .filter(ore => !hasEnoughOre(ore))
    .map(ore => ({
      ...ore,
      missing: Math.max(
        0,
        (quantities[ore.name] || 0) - (csvData[ore.name] || 0)
  )}));

  /* Check if all ores are available */
  const allOresAvailable = Object.keys(quantities).length > 0 && 
    !missingOres.length;

  /* Calculate AV for a single ore */
  const calculateAV = (oreName) => {
    const oreData = allOresWithLayers.find(ore => ore.name === oreName);
    if (!oreData) return "0.0";
    const quantity = quantities[oreName] ?? 0;
    return (quantity / getValueForMode(oreData)).toFixed(1);
  };

  /* Calculate totals */
  const calculateTotals = () => {
    return Object.entries(quantities).reduce((acc, [oreName, qty]) => {
      const oreData = allOresWithLayers.find(o => o?.name === oreName);
      if (!oreData) return acc;
      const value = oreData[valueMode + 'Val'];
      const quantity = Number(qty) || 0;
      return {
        totalOres: acc.totalOres + quantity,
        totalAV: acc.totalAV + (quantity / value),
        discountedAV: acc.discountedAV + (quantity / value * (1 - discount / 100))
      };
    }, { totalOres: 0, totalAV: 0, discountedAV: 0 });
  };

  const totals = calculateTotals();

  /* Handle quantity change */
  const handleQuantityChange = (oreName, value) => {
    const numericValue = value === "" ? "" : Math.max(0, Number(value) || 0);
    const newQuantities = {
      ...tradeState.quantities,
      [oreName]: numericValue
    };

    setTradeState(prev => ({
      ...prev,
      quantities: newQuantities
    }));
  };


  /* Handle discount change */
  const handleDiscountChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setTradeState(prev => ({
      ...prev,
      discount: Math.min(100, Math.max(0, value))
    }));
  };

  /* Clear all quantities */
  const clearTable = () => {
    setTradeState(prev => ({
      ...prev,
      quantities: {},
      selectedOres: [],
      batchQuantity: 0
    }));
    clearTradeSummary();
  };

  /* Remove an ore from the trade table */
  const handleRemoveOre = (oreObj) => {
    setTradeState(prev => {
      const newQuantities = { ...prev.quantities };
      delete newQuantities[oreObj.name];
      // Also remove from selected ores if it was selected
      const newSelectedOres = prev.selectedOres.filter(name => name !== oreObj.name);
      return {
        ...prev,
        quantities: newQuantities,
        selectedOres: newSelectedOres
      };
    });
    updateTradeOres(allOresWithLayers);
  };

  /* Generate CSS class name for ore gradient */
  const getOreClassName = (oreName) => {
    return `color-template-${oreName.toLowerCase().replace(/ /g, '-')}`;
  };

  // Filter ores based on search term
  const filterOres = (term, source = allOresWithLayers) => {
    // Early return if empty search
    if (!term.trim()) return [];
    const termLower = term.toLowerCase();
    return source.filter((ore) => {
      // Check if ore name matches
      const oreMatch = ore.name.toLowerCase().includes(termLower);
      // Check if layer name matches (including partial matches for layered ores)
      const layerMatch =
        ore.layer.toLowerCase().includes(termLower) ||
        ore.layer
          .split("/")
          .some((part) => part.trim().toLowerCase().includes(termLower));
      return oreMatch || layerMatch;
    });
  };

  // Current filtered results for search input
  const filteredOres = filterOres(searchTerm);

  // Add ore to trade table
  const handleAddOre = (oreObj) => {
    // Only add if ore isn't already in the table
    if (!tradeState.selectedOres.some((ore) => ore.name === oreObj.name)) {
      setTradeState(prev => ({
        ...prev,
        quantities: {
          ...prev.quantities,
          [oreObj.name]: 1, // Default to 1 for trade
        }
      }));
    }
    // Reset search state after adding
    setSearchTerm("");
    setSelectedIndex(-1);
    searchInputRef.current?.focus();
  };

  // Handle keyboard navigation in search results
  const handleKeyDown = (e) => {
    // Ignore if no search term or results
    if (!searchTerm || !filteredOres.length) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        // Move selection down, wrapping to top if at bottom
        setSelectedIndex((prev) => (prev < filteredOres.length - 1 ? prev + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        // Move selection up, wrapping to bottom if at top
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredOres.length - 1));
        break;
      case "Enter":
        e.preventDefault();
        // Add currently highlighted ore
        if (selectedIndex >= 0 && selectedIndex < filteredOres.length) {
          handleAddOre(filteredOres[selectedIndex]);
        }
        break;
      case "Escape":
        // Clear current search
        setSearchTerm("");
        break;
      default:
        break;
    }
    // Update trade summary
    updateTradeOres(allOresWithLayers);
  };

  const [copiedFilter, setCopiedFilter] = useState(null);

  const generateSearchFilter = () => {
    let searchFilterString =
      tradeState.tradeOres.map(ore => ore.name).join("/")
      navigator.clipboard.writeText(searchFilterString).then(() => {
        setCopiedFilter(searchFilterString);
        // Clear the filter after 2 seconds
        setTimeout(() => setCopiedFilter(null), 2000);
      });
  }

  return (
    <div>
      <NavBar />
      <div className="trade-tool-layout">
        {/* Left side - controls */}
        <div className="trade-controls-panel">
        <div className="trade-usage">
          <button
            className="usage-button"
            onClick={() => setShowDropdown(!showDropdown)}
            >Click For Usage Instructions
          </button>
          {showDropdown && (
            <div className="usage-dropdown">
              <ul>
                <li>⛏ Click the header for each layer to open the dropdown.</li>
                <li>⛏ Click ores to select multiple, then set their quantities below.</li>
                <li>⛏ To remove an individual ore, click the red X button beside the ore, in either the "Current Trade" table or the layer table to the right.</li>
                <li>⛏ Type ore or layer names in the search bar, and hit enter or click to add them to the current trade. You can use the arrow keys to navigate up and down the results.</li>
                <li>⛏ Type in the quantity for each ore you'd like to trade.</li>
                <li>⛏ To add a discount to large orders, type the percent in the "Discount %" box.</li>
                <li>⛏ The Batch Quantity box (below the value buttons) can set either the AV of all selected ores, or the quantity. Click the green button to switch between them.</li>
                <li>⛏ Click "Apply Quantity" to set the selected ores (highlighted blue) to the specified quantity.</li>
                <li>⛏ Click "Clear Table" to reset the trade table.</li>
              </ul>
            </div>
          )}
        </div>

          {/* Value mode selector */}
          <div className="t-button-container">

            <div className="box-button">
              <button
                onClick={() => setValueMode("zenith")}
                className={valueMode === "zenith" ? "color-template-torn-fabric" : ""}
              >
                <span>Zenith Vals</span>
              </button>
            </div>

            <div className="box-button">
              <button
                onClick={() => setValueMode('nan')}
                className={valueMode === 'nan' ? "color-template-diamond" : ""}
              >
                <span>NAN Vals</span>
              </button>
            </div>
            {/*
            <div className="box-button">
              <button
                onClick={() => setValueMode('john')}
                className={valueMode === 'john' ? "color-template-pout" : ""}
              >
                <span>John Vals</span>
              </button>
            </div>
            */}
            <div className="box-button">
              <button
                onClick={() => setValueMode('custom')}
                className={valueMode === 'custom' ? "color-template-havicron" : ""}
              >
                <span>Custom</span>
              </button>
            </div>
            <div className="box-button" onClick={clearTable}>
              <button>
                <span className="button">Clear Table</span>
              </button>
            </div>
          </div>

          {/* Batch quantity controls */}
          <div className="batch-controls">
            <div className="batch-quantity-container">
              <div className="batch-mode-selector">
                <span>Selected: {tradeState.selectedOres.length} ores</span>
                <button
                  onClick={toggleBatchMode}
                  className="batch-apply-button"
                >
                  {batchMode === 'quantity' ? 'Switch to AV Mode' : 'Switch to Quantity Mode'}
                </button>
              </div>
              <div className="batch-input-container">
                <label htmlFor="batch-quantity">
                  {batchMode === 'quantity' ? 'Quantity:' : '# AV:'}
                  <input
                    id="batch-quantity"
                    name="batch-quantity"
                    type="number"
                    min="0"
                    value={tradeState.batchQuantity === 0 ? "" : tradeState.batchQuantity}
                    onChange={(e) => setTradeState(prev => ({
                      ...prev,
                      batchQuantity: Math.max(0, parseInt(e.target.value) || 0)
                    }))}
                    className="quantity-input"
                    onClick={(e) => e.stopPropagation()}
                  />
                </label>
              </div>
              <div className="batch-action-buttons">
                <button
                  onClick={applyBatchQuantity}
                  disabled={tradeState.selectedOres.length === 0}
                  className="batch-apply-button"
                >
                  Apply {batchMode === 'quantity' ? 'Quantity' : 'AV'}
                </button>
                <button
                  onClick={clearSelection}
                  disabled={tradeState.selectedOres.length === 0}
                  className="batch-clear-button"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          </div>

          {/* Search input */}
          <div className="search-container">
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
                onKeyDown={(e) => handleKeyDown(e)}
                className="search-input"
              />
            </label>
            {searchTerm && (
              <ul className="search-results" ref={resultsRef}>
                {filteredOres.map((ore, index) => (
                  <li
                    key={`${ore.name}-${index}`}
                    onClick={() => handleAddOre(ore)}
                    className={`search-result-item ${
                      index === selectedIndex ? "selected" : ""
                    }`}
                  >
                    {ore.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Discount input */}
          <div className="discount-container">
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
              className="discount-input"
              placeholder="Discount %"
            />
          </label>
          </div>



          {/* Inventory status */}
          {allOresAvailable ? (
            <div className="global-checkmark">
              ✓ All ores available in inventory
            </div>
          ) : (
            missingOres.length > 0 && (
              <div className="missing-ores-warning">
                <div className="warning-header">✖ Missing:</div>
                <div className="missing-ores-list">
                  {missingOres.map((oreObj, index) => (
                    <div key={index} className="missing-ore-item">
                      {oreObj.name}: {oreObj.missing}
                    </div>
                  ))}
                </div>
              </div>
            )
          )}

          {/* Trade Summary Table */}
          <div className="trade-summary">
            <h2>&nbsp;&nbsp;Current Trade</h2>
            {/* Totals and inventory status */}
            <div className="trade-totals">
              <p>💲Total AV: <span>{totals.totalAV.toFixed(1)}</span></p>
              {discount > 0 && (
                <p>💲Discounted AV ({discount}%): <span>{Math.round(totals.totalAV * (1 - discount / 100)).toFixed(0)}</span></p>
              )}
              <p>⛏️Total # Ores: <span>{totals.totalOres}</span></p>
              <button
                className="copy-filter-btn"
                onClick={generateSearchFilter}
                title="Generate and copy search filter"
                style={{
                  marginTop:"25px",
                  marginLeft:"20px",
                  justifyContent:"left",
                }}
              >
                Generate Search Filter
              </button>
              {copiedFilter && (
                <div 
                  className="copy-confirmation"
                  style={{
                    marginLeft:"35px",
                  }}
                >✓ Copied to clipboard!</div>
              )}
            </div>
            {tradeState.tradeOres.length > 0 ? (
              <table className="trade-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>[ # ]</th>
                    <th>AV</th>
                  </tr>
                </thead>
                <tbody>
                  {tradeState.tradeOres.sort((a, b) => a.name.localeCompare(b.name)).map(ore => (
                      <tr
                        key={ore.name}
                        className={isOreSelected(ore.name) ? "selected-row" : ""}
                        onClick={() => toggleOreSelection(ore.name)}
                      >
                      <td 
                        className={`tr-name-cell ${getOreClassName(ore.name)}`} 
                        data-text={ore.name}
                        style={{paddingRight:"10px"}}
                      >
                        <button
                          className="delete-ore-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveOre(ore);
                          }}
                        >
                          ✖
                        </button>
                        <img
                          src={OreIcons[ore.name.replace(/ /g, '_')]}
                          alt={`${ore.name} icon`}
                          className="t-ore-icon"
                        />
                        {ore.name}
                      </td>
                      <td>
                        <div className="quantity-cell-container">
                          <div className={`inventory-check ${hasEnoughOre(ore) ? "has-enough" : "not-enough"}`}>
                              {hasEnoughOre(ore) ? "✓" : "✖"}
                          </div>
                          <div className="inventory-count">
                            {getAvailableAmount(ore)}/
                            {quantities[ore.name] || 0}
                          </div>
                          <label htmlFor={`quantity-${ore.name}`} className="quantity-label">
                            <input
                              id={`quantity-${ore.name}`}
                              type="number"
                              value={quantities[ore.name] ?? ""}
                              onChange={(e) => handleQuantityChange(ore.name, e.target.value)}
                              className="quantity-input"
                              min="1"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </label>
                        </div>
                      </td>
                      <td>
                        {calculateAV(ore.name)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>&nbsp;&nbsp;&nbsp;No ores added to trade yet</p>
            )}
          </div>
        </div>
          {/* Main table */}
          <div className="ore-table-panel">
          <div className="layer-controls">
            <button
              onClick={() => {
                const allCollapsed = {};
                Object.keys(oreValsDict).forEach(layer => {
                  allCollapsed[layer] = true;
                });
                setCollapsedLayers(allCollapsed);
              }}
              className="collapse-button"
            >
              Collapse All
            </button>
            <button
              onClick={() => {
                const allExpanded = {};
                Object.keys(oreValsDict).forEach(layer => {
                  allExpanded[layer] = false;
                });
                setCollapsedLayers(allExpanded);
              }}
              className="expand-button"
            >
              Expand All
            </button>
          </div>
          <table className="trade-table">
            <thead>
              <tr>
                <th>Ore Name</th>
                <th>Quantity</th>
                <th>AV</th>
              </tr>
            </thead>
            <tbody>
              {oresByLayer.map(({ layer, ores }) => (
                <React.Fragment key={layer}>
                  {/* Collapsible layer header */}
                  <tr
                    className="layer-header"
                    onClick={() => toggleLayerCollapse(layer)}
                  >
                    <td colSpan="3">
                      {layer.substring(0, layer.indexOf('\n'))}
                      <span className="collapse-icon">
                        {collapsedLayers[layer] ? '▶' : '▼'}
                      </span>
                    </td>
                  </tr>

                  {/* Layer content - conditionally rendered */}
                  {!collapsedLayers[layer] && (
                  <>
                    {/* Select All row */}
                      <tr className="layer-actions-row">
                        <td colSpan="3">
                          <button
                            className="select-all-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setTradeState(prev => {
                                const newSelected = [...prev.selectedOres];
                                ores.forEach(ore => {
                                  if (!newSelected.includes(ore.name)) {
                                    newSelected.push(ore.name);
                                  }
                                });
                                return {
                                  ...prev,
                                  selectedOres: newSelected
                                };
                              });
                            }}
                          >
                            Select All in {layer.substring(0, layer.indexOf('\n'))}
                          </button>
                          <button
                            className="deselect-all-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setTradeState(prev => ({
                                ...prev,
                                selectedOres: prev.selectedOres.filter(name =>
                                  !ores.some(ore => ore.name === name)
                              )}));
                            }}
                          >
                            Deselect All
                          </button>
                        </td>
                      </tr>
                  {ores.map(ore => (
                    <tr
                      key={ore.name}
                      className={isOreSelected(ore.name) ? "selected-row" : ""}
                      onClick={() => toggleOreSelection(ore.name)}
                    >
                      <td className={`tr-name-cell ${getOreClassName(ore.name)}`} data-text={ore.name}>
                        <button
                          className="delete-ore-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveOre(ore);
                          }}
                        >
                          ✖
                        </button>
                        <img
                          src={OreIcons[ore.name.replace(/ /g, '_')]}
                          alt={`${ore.name} icon`}
                          className="t-ore-icon"
                        />
                        {ore.name}
                      </td>
                      <td>
                        <div className="quantity-cell-container">
                          <div className={`inventory-check ${hasEnoughOre(ore) ? "has-enough" : "not-enough"}`}>
                              {hasEnoughOre(ore) ? "✓" : "✖"}
                          </div>
                          <div className="inventory-count">
                            {getAvailableAmount(ore)}/
                            {quantities[ore.name] || 0}
                          </div>
                          <label htmlFor={`quantity-${ore.name}`} className="quantity-label">
                            <input
                              id={`quantity-${ore.name}`}
                              type="number"
                              value={quantities[ore.name] ?? ""}
                              onChange={(e) => handleQuantityChange(ore.name, e.target.value)}
                              className="quantity-input"
                              min="1"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </label>
                        </div>
                      </td>
                      <td>
                        {calculateAV(ore.name)}
                      </td>
                    </tr>
                  ))}
                </>
                )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      </div>
  );
}

export default TradeTool;