/* ZTT | Trading tool component
    Trading tool to assist users
    Contains the following features:
    - Search filter by ore/layer
    - Mass quantity setting
    - To Trade & To Receive tables
    - Subtracting and adding the required ores to the user's inventory
    - Value mode switcher
    - Table clearing
    - Keyboard navigation
*/

import React, { useState, useContext, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { CSVContext } from "../context/CSVContext";
import { TradeContext } from "../context/TradeContext";
import { johnValsDict } from "../components/JohnVals";
import { nanValsDict } from "../components/NANVals";
// import { oreIcons } from "../lib/oreIcons";
import TradeTable from "../components/TradeTable";

import "../styles/TradeTool.css";
import "../styles/AllGradients.css";

function TradeTool() {
  /* Fetches the following pieces from the saved trade context:
    - Full trade data
    - John/NAN mode
    - Quantities set per ore
    - Discount
    And sets other fields to null/default
  */
  // State hooks - Manage trade data and CSV inventory context
  const { tradeData, setTradeData } = useContext(TradeContext);
  const { csvData, setCSVData } = useContext(CSVContext);

  // Component state - Track all UI and trade-related state
  const [isJohnValues, setIsJohnValues] = useState(tradeData.isJohnValues);
  const [selectedOres, setSelectedOres] = useState(tradeData.selectedOres);
  const [quantities, setQuantities] = useState(tradeData.quantities);
  const [receivedOres, setReceivedOres] = useState(tradeData.receivedOres);
  const [receivedQuantities, setReceivedQuantities] = useState(tradeData.receivedQuantities);

  // Search and UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [receiveSearchTerm, setReceiveSearchTerm] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [receiveSelectedIndex, setReceiveSelectedIndex] = useState(-1);
  const [globalQuantity, setGlobalQuantity] = useState(1);
  const [globalReceiveQuantity, setGlobalReceiveQuantity] = useState(0);

  // Refs for DOM access
  const searchInputRef = useRef(null); // Reference to search input for focus management
  const resultsRef = useRef(null); // Reference to search results container for scrolling

  /*
   * Prepare complete ore list with layer information
   * Combines ore data from either John or NAN values with their layer information
   * Returns array of ore objects with layer property added
  */
  const allOresWithLayers = Object.entries(
    isJohnValues ? johnValsDict : nanValsDict
  ).flatMap(([layerName, ores]) =>
    ores.map((ore) => ({
      ...ore,
      layer: layerName, // Add layer info to each ore
    }))
  );

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

  // Current filtered results for both search inputs
  const filteredOres = filterOres(searchTerm);
  const filteredReceiveOres = filterOres(receiveSearchTerm);

  // Add ore to either trade or receive table
  const handleAddOre = (oreObj, isReceive = false) => {
    // Determine which state to update based on isReceive flag
    const targetArray = isReceive ? receivedOres : selectedOres;
    const setTargetArray = isReceive ? setReceivedOres : setSelectedOres;
    const setTargetQuantities = isReceive
      ? setReceivedQuantities
      : setQuantities;
    // Only add if ore isn't already in the table
    if (!targetArray.some((ore) => ore.name === oreObj.name)) {
      setTargetArray((prev) => [...prev, oreObj]);
      setTargetQuantities((prev) => ({
        ...prev,
        [oreObj.name]: isReceive ? 0 : 1, // Default to 0 for receive, 1 for trade
      }));
    }
    // Reset search state after adding
    if (isReceive) {
      setReceiveSearchTerm("");
      setReceiveSelectedIndex(-1);
    } else {
      setSearchTerm("");
      setSelectedIndex(-1);
      // Return focus to search input for trade table
      searchInputRef.current?.focus();
    }
  };

  // Handle keyboard navigation in search results
  const handleKeyDown = (e, isReceive = false) => {
    // Get current search state based on which input is active
    const currentTerm = isReceive ? receiveSearchTerm : searchTerm;
    const currentOres = isReceive ? filteredReceiveOres : filteredOres;
    const setIndex = isReceive ? setReceiveSelectedIndex : setSelectedIndex;
    // Ignore if no search term or results
    if (!currentTerm || !currentOres.length) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        // Move selection down, wrapping to top if at bottom
        setIndex((prev) => (prev < currentOres.length - 1 ? prev + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        // Move selection up, wrapping to bottom if at top
        setIndex((prev) => (prev > 0 ? prev - 1 : currentOres.length - 1));
        break;
      case "Enter":
        e.preventDefault();
        // Add currently highlighted ore
        const index = isReceive ? receiveSelectedIndex : selectedIndex;
        if (index >= 0 && index < currentOres.length) {
          handleAddOre(currentOres[index], isReceive);
        }
        break;
      case "Escape":
        // Clear current search
        if (isReceive) {
          setReceiveSearchTerm("");
        } else {
          setSearchTerm("");
        }
        break;
      default:
        break;
    }
  };

  // Handle quantity change for an ore
  const handleQuantityChange = (oreName, value, isReceive = false) => {
    // Determine which quantity state to update
    const setQuantitiesFn = isReceive ? setReceivedQuantities : setQuantities;
    // Minimum value depends on which table (0 for receive, 1 for trade)
    const minValue = isReceive ? 0 : 1;
    setQuantitiesFn((prev) => ({
      ...prev,
      [oreName]:
        value === ""
          ? "" // Allow empty string for UX (user can backspace completely)
          : Math.max(
              minValue,
              parseInt(value) || minValue // Fallback to minValue if NaN
            ),
    }));
  };

  // Calculate AV for a single ore
  const calculateAV = (oreName) => {
    // First try to find the ore in the current value dictionary
    const oreData = allOresWithLayers.find(ore => ore.name === oreName);
    if (!oreData) return "0.0";
    // Get quantity from either trade or receive quantities
    const quantity = quantities[oreName] ?? receivedQuantities[oreName] ?? 0;
    return (quantity / oreData.baseValue).toFixed(1);
  };

  // Updated the calculateTotals function to not apply discount
  const calculateTotals = (ores, quantities) => {
    const valueDict = isJohnValues ? johnValsDict : nanValsDict;
    // Sum up total ore count
    const totalOres = ores.reduce(
      (sum, ore) => sum + (quantities[ore.name] || 0),
      0
    );
    // Calculate total AV value (quantity divided by base value)
    const totalAV = ores.reduce((sum, ore) => {
      const qty = quantities[ore.name] || 0;
      // Find the ore in the current value dictionary
      const oreData = Object.values(valueDict)
        .flat()
        .find(o => o.name === ore.name);
      const value = oreData?.baseValue || 1;
      return sum + qty / value;
    }, 0);
    // Return rounded values (without discount)
    return {
      totalOres,
      totalAV: Math.round(totalAV).toFixed(0),
    };
  };

  // Apply global quantity to all ores in a table
  const applyGlobalQuantity = (quantity, isReceive = false) => {
    // Determine which state to update
    const setQuantitiesFn = isReceive ? setReceivedQuantities : setQuantities;
    const ores = isReceive ? receivedOres : selectedOres;
    // Minimum value depends on table type
    const minValue = isReceive ? 0 : 1;
    // Create new quantities object with all ores set to the global quantity
    const newQuantities = ores.reduce(
      (acc, ore) => ({
        ...acc,
        [ore.name]: Math.max(minValue, quantity),
      }),
      {}
    );
    setQuantitiesFn(newQuantities);
  };


  // Remove an ore from the trade table
  const handleRemoveOre = (oreObj) => {
    // Filter out the ore from selected ores
    setSelectedOres((prev) => prev.filter((ore) => ore.name !== oreObj.name));
    // Remove its quantity entry
    setQuantities((prev) => {
      const newQuantities = { ...prev };
      delete newQuantities[oreObj.name];
      return newQuantities;
    });
  };


  // Clear all ores from the trade table
  const clearTable = () => {
    setSelectedOres([]);
    setQuantities({});
    setReceivedOres([]);
    setReceivedQuantities({});
  };


  // Process trade - both to Trade and Receive tables
  const processTrade = () => {
    const confirmed = window.confirm(
      "Confirm trade?\nThis will:\n1) Remove traded ores from inventory\n2) Add received ores to inventory"
    );
    if (!confirmed) return;
    const updatedCSV = { ...csvData }; // Create a shallow copy first
    // Remove traded ores from inventory
    selectedOres.forEach((ore) => {
      const oreName = ore.name;
      const currentAmount = updatedCSV[oreName] || 0;
      const tradeAmount = quantities[oreName] || 0;
      updatedCSV[oreName] = Math.max(0, currentAmount - tradeAmount);
    });
    // Add received ores to inventory
    receivedOres.forEach((ore) => {
      const oreName = ore.name;
      const receiveAmount = receivedQuantities[oreName] || 0;
      if (receiveAmount > 0) {
        const receivedOreName = ore.name;
        updatedCSV[receivedOreName] = (updatedCSV[receivedOreName] || 0) + receiveAmount;
      }
    });
    // Update state
    setCSVData(updatedCSV);
    clearTable();
    requestAnimationFrame(() => searchInputRef.current?.focus());
  };


  // Check if inventory has enough of an ore for trade
  const hasEnoughOre = (oreObj) => {
    return csvData?.[oreObj.name] >= (quantities[oreObj.name] || 0);
  };


  // Get available quantity of an ore from inventory
  const getAvailableAmount = (oreObj) => csvData?.[oreObj.name] || 0;


  // Get list of ores with insufficient inventory
  const missingOres = selectedOres
  .filter((ore) => !hasEnoughOre(ore))
  .map((ore) => ({
    ...ore,
    missing: Math.max(
      0,
      (quantities[ore.name] || 0) - (csvData[ore.name] || 0)
    ),
  }));


  // Check if all ores are available
  const allOresAvailable =
    selectedOres.length > 0 && selectedOres.every((ore) => hasEnoughOre(ore));

  // Effect to persist trade data to context
  useEffect(() => {
    setTradeData({ selectedOres, quantities,
                   receivedOres, receivedQuantities,
                   isJohnValues });
  }, [selectedOres, quantities,
      receivedOres, receivedQuantities,
      isJohnValues, setTradeData]);

  // Effect to reset search selection when term changes
  useEffect(() => {
    setSelectedIndex(-1);
  }, [searchTerm]);

  // Effect to focus search input on initial render
  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  // Effect to scroll selected search result into view
  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current?.children[selectedIndex]) {
      resultsRef.current.children[selectedIndex].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [selectedIndex]);

  // Recalculate
  useEffect(() => {
    // This will force a recalculation of all AV values
    setQuantities(prev => ({...prev}));
  }, [isJohnValues]);

  // Main trade tool interface
  return (
    <div className="trade-tool-container">
      <h1>Welcome to the Trade Tool!</h1>
      <h1>Usage:</h1>
      <l>
        <ul>
          1. Start typing an ore or layer name in the search box on the left.
        </ul>
        <ul>
          2. Either click on the ore or hit enter to add it to the list. You can
          also use arrow keys to navigate up and down the list!
        </ul>
        <ul>
          3. Enter the quantity of each ore you wish to trade in the text boxes
          on the right side.
        </ul>
        <ul>
          4. To add a discount to large orders, type the percent in the
          "Discount %" box.
        </ul>
      </l>
      <h1>
        ➜ Current Values:{" "}
        <span className="placeholder">
          {isJohnValues ? "John's Values" : "NAN's Values"}
        </span>
      </h1>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/valuechart">Value Chart</Link>
          </li>
          <li>
            <Link to="/csvloader">CSV Loader</Link>
          </li>
          <li>
            <Link to="/misc">Miscellaneous</Link>
          </li>
        </ul>
      </nav>
      <div className="t-button-container1">
        <div className="box-button">
          <button
            onClick={() => {
              setIsJohnValues(true);
              setQuantities(prev => ({...prev}));
            }}
            className={isJohnValues ? "color-template-rhylazil" : ""}
          >
            <span>John Values</span>
          </button>
        </div>
        <div className="box-button">
          <button
            onClick={() => {
              setIsJohnValues(false);
              setQuantities(prev => ({...prev}));
            }}
            className={!isJohnValues ? "color-template-diamond" : ""}
          >
            <span>NAN Values</span>
          </button>
        </div>
        <div className="box-button" onClick={clearTable}>
          <button>
            <span className="button">Clear Tables</span>
          </button>
        </div>
        <div className="box-button" onClick={processTrade}>
          <button>
            <span className="button">Process Trade</span>
          </button>
        </div>
      </div>

      {/* Input Controls Row */}
      <div className="input-controls-row">
        <div className="search-container">
          <h2>Add Ores to Trade ⤵</h2>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search ores or layers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e)}
            className="search-input"
          />
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

        <div className="search-container">
          <h2>Add Ores to Receive ⤵</h2>
          <input
            type="text"
            placeholder="Search ores or layers..."
            value={receiveSearchTerm}
            onChange={(e) => setReceiveSearchTerm(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, true)}
            className="search-input"
          />
          {receiveSearchTerm && (
            <ul className="search-results">
              {filteredReceiveOres.map((ore, index) => (
                <li
                  key={`receive-${ore.name}-${index}`}
                  onClick={() => handleAddOre(ore, true)}
                  className={`search-result-item ${
                    index === receiveSelectedIndex ? "selected" : ""
                  }`}
                >
                  {ore.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Tables Container */}
      <div className="t-tables-container">
        <TradeTable
          title="Ores to Trade"
          ores={selectedOres}
          quantities={quantities}
          globalQuantity={globalQuantity}
          onQuantityChange={handleQuantityChange}
          onGlobalQuantityChange={(value) => {
            setGlobalQuantity(value);
            applyGlobalQuantity(value);
          }}
          onRemoveOre={handleRemoveOre}
          showInventory={true}
          hasEnoughOre={hasEnoughOre}
          getAvailableAmount={getAvailableAmount}
          calculateAV={calculateAV}
          totals={calculateTotals(selectedOres, quantities)}
          inventoryStatus={{
            allOresAvailable,
            hasMissingOres: missingOres.length > 0,
            missingOres: missingOres
          }}
        />

        <TradeTable
          title="Ores to Receive"
          ores={receivedOres}
          quantities={receivedQuantities}
          globalQuantity={globalReceiveQuantity}
          onQuantityChange={handleQuantityChange}
          onGlobalQuantityChange={(value) => {
            setGlobalReceiveQuantity(value);
            applyGlobalQuantity(value, true);
          }}
          calculateAV={calculateAV}
          onRemoveOre={(oreObj) => {
            setReceivedOres(receivedOres.filter(ore => ore.name !== oreObj.name));
            const newQuantities = { ...receivedQuantities };
            delete newQuantities[oreObj.name];
            setReceivedQuantities(newQuantities);
          }}
          isReceiveTable={true}
          totals={calculateTotals(receivedOres, receivedQuantities, true)}
        />
      </div>
    </div>
  );
}

export default TradeTool;
