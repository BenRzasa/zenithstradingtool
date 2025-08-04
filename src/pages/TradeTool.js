
import React, { useState, useContext, useRef, useEffect, useMemo } from "react";
import NavBar from "../components/NavBar";
import { MiscContext } from "../context/MiscContext";
import { TradeContext } from "../context/TradeContext";
import { OreIcons } from "../data/OreIcons";
import missingIcon from "../images/ore-icons/Missing_Texture.webp";

import patic from "../images/misc/patic.png"
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
    getCurrentCSV,
    getValueForMode,
    oreValsDict
  } = useContext(MiscContext);

  const csvData = getCurrentCSV();

  // Extract data from trade context
  const { quantities, discount, selectedOres } = tradeState;

  // Local UI states
  const [batchMode, setBatchMode] = useState('quantity'); // 'quantity' or 'av'
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false)

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
      initialState[layer] = true;
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
      selectedOres: [],
      batchQuantity: 0
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
    const value = getValueForMode(oreData);
    return (quantity / value).toFixed(1);
  };

  /* Calculate totals */
  const calculateTotals = () => {
    return Object.entries(quantities).reduce((acc, [oreName, qty]) => {
      const oreData = allOresWithLayers.find(o => o?.name === oreName);
      if (!oreData) return acc;
      const value = getValueForMode(oreData);
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

  const filterOres = (term, source = allOresWithLayers) => {
    if (!term.trim()) return [];

    const searchParts = term.toLowerCase().split('/').map(part => part.trim());

    return source.filter((ore) => {
      return searchParts.some(part =>
        ore.name.toLowerCase().includes(part)
      );
    });
  };

  const filteredOres = filterOres(searchTerm);

  // Add ore to trade table
  const handleAddOre = (oreObj) => {
    if (!tradeState.selectedOres.some((ore) => ore.name === oreObj.name)) {
      setTradeState(prev => ({
        ...prev,
        quantities: {
          ...prev.quantities,
          [oreObj.name]: 1,
        }
      }));
    }

    setSearchFocused(true);
    searchInputRef.current?.focus();
  };

  const handleAddMultipleOres = (searchTerm) => {
    const searchParts = searchTerm.toLowerCase().split('/').map(part => part.trim());

    // Find all ores that match any part of the search
    const oresToAdd = allOresWithLayers.filter(ore => 
      searchParts.some(part =>
        ore.name.toLowerCase().includes(part)
      )
    );

    // Add all matching ores
    setTradeState(prev => {
      const newQuantities = { ...prev.quantities };
      oresToAdd.forEach(ore => {
        if (!newQuantities[ore.name]) {
          newQuantities[ore.name] = 1;
        }
      });
      return {
        ...prev,
        quantities: newQuantities
      };
    });

    setSearchTerm("");
    searchInputRef.current?.focus();
    setSearchFocused(true);
    updateTradeOres(allOresWithLayers);
  };

  const handleKeyDown = (e) => {
    if (!searchTerm) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        const nextIndex = selectedIndex < filteredOres.length - 1 ? selectedIndex + 1 : 0;
        setSelectedIndex(nextIndex);
        scrollToResult(nextIndex);
        break;

      case "ArrowUp":
        e.preventDefault();
        const prevIndex = selectedIndex > 0 ? selectedIndex - 1 : filteredOres.length - 1;
        setSelectedIndex(prevIndex);
        scrollToResult(prevIndex);
        break;

      case "Enter":
        e.preventDefault();
        if (searchTerm.includes('/')) {
          handleAddMultipleOres(searchTerm);
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

  const [copiedFilter, setCopiedFilter] = useState(null);

  const generateSearchFilter = () => {
    let searchFilterString =
      tradeState.tradeOres.map(ore => ore.name).join("/")
      navigator.clipboard.writeText(searchFilterString).then(() => {
        setCopiedFilter(searchFilterString);

        setTimeout(() => setCopiedFilter(null), 2000);
      });
  }

  return (
    <div>
      <NavBar />
      <div className="trade-tool-layout">
        {/* Left side - controls */}
        <div className="trade-controls-panel">
        <div className="box-button" style={{zIndex:"10000"}}>
          <button
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

            <div className="box-button" onClick={clearTable}>
              <button>
                <span className="button">Clear Table</span>
              </button>
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
                <button
                  className="add-all-button" style={{marginLeft: "0px", marginTop:"10px", padding:"10px", fontSize:"14px"}}
                  onClick={(e) => {
                    e.stopPropagation();
                    const newQuantities = { ...tradeState.quantities };
                    tradeState.selectedOres.forEach(oreName => {
                      const oreData = allOresWithLayers.find(ore => ore.name === oreName);
                      if (!oreData) return;
                      const availableAmount = getAvailableAmount(oreData);
                      if (availableAmount > 0) {
                        newQuantities[oreName] = availableAmount;
                      }
                    });

                    setTradeState(prev => ({
                      ...prev,
                      quantities: newQuantities
                    }));

                    updateTradeOres(allOresWithLayers);
                  }}
                  disabled={tradeState.selectedOres.length === 0}
                  title="Add all available quantities for selected ores"
                >
                + Max Quantity of Selected
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
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="search-input"
              />
            </label>
            {(searchFocused && searchTerm) && (
              <ul className="search-results" ref={resultsRef}>
                {filteredOres.map((ore, index) => (
                  <li
                    key={`${ore.name}-${index}`}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleAddOre(ore);
                    }}
                    className={`search-result-item ${
                      index === selectedIndex ? "selected" : ""
                    }`}
                  >
                    {ore.name}
                  </li>
                ))}
              </ul>
            )}
            {searchTerm === 'patic' && (
              <img
                src={patic}
                alt="patic"
                style={{
                  position:"absolute",
                  opacity:"0.1"
                }}
               />
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
              {totals.totalAV > 0.00 && (
              <button
                className="copy-filter-btn"
                onClick={generateSearchFilter}
                title="Generate and copy search filter"
                style={{
                  marginTop:"20px",
                  marginLeft:"-5px",
                  marginBottom:"30px",
                  justifyContent:"left",
                  transform:"scale(0.85)"
                }}
              >
                Generate Search Filter
              </button>
              )}
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
                          tabIndex="-1"
                          aria-label="Clear ore from trade"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveOre(ore);
                          }}
                        >
                          ✖
                        </button>
                      {OreIcons[ore.name.replace(/ /g, '_')] ? (
                        <img
                          src={OreIcons[ore.name.replace(/ /g, '_')]}
                          alt={`${ore.name} icon`}
                          className="t-ore-icon"
                          onError={(e) => {
                            console.error(`Missing icon for: ${ore.name}`);
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : ( // Missing icon
                        <span>
                          <img
                            src={missingIcon}
                            alt={"Missing icon"}
                            className="t-ore-icon"
                          ></img>
                        </span>
                      )}
                        {ore.name}
                      </td>
                      <td>
                        <div className="quantity-cell-container">
                          <button
                            className="add-all-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const availableAmount = getAvailableAmount(ore);
                              if (availableAmount > 0) {
                                handleQuantityChange(ore.name, availableAmount);
                              }
                            }}
                            title={`Add all available ${ore.name} to trade`}
                          >
                          + All
                          </button>
                          <div className="inventory-count">
                            {getAvailableAmount(ore)}/
                            {quantities[ore.name] || 0}
                          </div>
                          <label htmlFor={`quantity-${ore.name}`} className="quantity-label">
                            <input
                              id={`quantity-${ore.name}`}
                              aria-label="Ore quantity input"
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
              className="collapse-button"
              tabIndex="-1"
              onClick={() => {
                const allCollapsed = {};
                Object.keys(oreValsDict).forEach(layer => {
                  allCollapsed[layer] = true;
                });
                setCollapsedLayers(allCollapsed);
              }}
            >
              Collapse All
            </button>
            <button
              className="expand-button"
              tabIndex="-1"
              onClick={() => {
                const allExpanded = {};
                Object.keys(oreValsDict).forEach(layer => {
                  allExpanded[layer] = false;
                });
                setCollapsedLayers(allExpanded);
              }}
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
                            tabIndex="-1"
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
                            tabIndex="-1"
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
                          aria-label="Clear ore from trade"
                          tabIndex="-1"
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
                          <button
                            className="add-all-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const availableAmount = getAvailableAmount(ore);
                              if (availableAmount > 0) {
                                handleQuantityChange(ore.name, availableAmount);
                              }
                            }}
                            title={`Add all available ${ore.name} to trade`}
                          >+ All</button>
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