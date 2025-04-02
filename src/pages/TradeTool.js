
/* ZTT | Trading tool component
    Trading tool to assist users 
    Contains the following features:
    - Search filter by ore/layer
    - Mass quantity setting
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
import { oreIcons } from "../lib/oreIcons";

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
  const { tradeData, setTradeData } = useContext(TradeContext);
  const [isJohnValues, setIsJohnValues] = useState(tradeData.isJohnValues);
  const [selectedOres, setSelectedOres] = useState(tradeData.selectedOres);
  const [quantities, setQuantities] = useState(tradeData.quantities);
  const [discount, setDiscount] = useState(tradeData.discount);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [globalQuantity, setGlobalQuantity] = useState(1);
  // Set the search input and results to null
  const searchInputRef = useRef(null);
  const resultsRef = useRef(null);
  // Fetch the CSV Data from the context
  const { csvData } = useContext(CSVContext);

  // useEffect to sync changes back to context
  useEffect(() => {
    setTradeData({
      selectedOres,
      quantities,
      discount,
      isJohnValues,
    });
  }, [selectedOres, quantities, discount, isJohnValues, setTradeData]);

  // Reset selected index when search term changes
  useEffect(() => {
    setSelectedIndex(-1);
  }, [searchTerm]);

  // Focus the input when component mounts
  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  // Scroll down the list when the keyboard navigates to the end of iti
  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const resultsList = resultsRef.current;
      const selectedItem = resultsList.children[selectedIndex];

      if (selectedItem) {
        // Scroll the item into view if needed
        selectedItem.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  }, [selectedIndex]);

  // Get all ores with their layer information
  const allOresWithLayers = Object.entries(
    isJohnValues ? johnValsDict : nanValsDict
  ).flatMap(([layerName, ores]) =>
    ores.map((ore) => ({
      ...ore,
      layer: layerName, // Add layer name to each ore
    }))
  );

  // Filter ores based on search term (name or layer)
  const filteredOres = allOresWithLayers.filter((ore) => {
    const oreLower = ore.name.toLowerCase();
    const layerLower = ore.layer.toLowerCase();
    const searchLower = searchTerm.toLowerCase();

    return (
      oreLower.includes(searchLower) ||
      layerLower.includes(searchLower) ||
      ore.layer
        .split("/")
        .some((part) => part.trim().toLowerCase().includes(searchLower))
    );
  });

  // Add a specific ore to the table map
  const handleAddOre = (oreObj) => {
    if (!selectedOres.some((ore) => ore.name === oreObj.name)) {
      setSelectedOres([...selectedOres, oreObj]);
      setQuantities({ ...quantities, [oreObj.name]: 1 }); // Default to 1
    }
    setSearchTerm("");
    setSelectedIndex(-1);
    searchInputRef.current?.focus();
  };

  // Handle removing a specific ore
  const handleRemoveOre = (oreObj) => {
    setSelectedOres(selectedOres.filter((ore) => ore.name !== oreObj.name));
    const newQuantities = { ...quantities };
    delete newQuantities[oreObj.name];
    setQuantities(newQuantities);
  };

  // Handle ore quantity changes in trade table
  const handleQuantityChange = (oreName, value) => {
    setQuantities({
      ...quantities,
      [oreName]: value === "" ? "" : Math.max(1, parseInt(value) || 1),
    });
  };

  // Handle keyboard navigation in ore results menu
  const handleKeyDown = (e) => {
    if (!searchTerm || filteredOres.length === 0) return;
    switch (e.key) {
      // Move down
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredOres.length - 1 ? prev + 1 : 0
        );
        break;
      // Move up
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredOres.length - 1
        );
        break;
      // Add the ore
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredOres.length) {
          handleAddOre(filteredOres[selectedIndex]);
        }
        break;
      default:
        break;
    }
  };

  // Calculate AV for an ore
  const calculateAV = (oreName) => {
    const oreData = allOresWithLayers.find((ore) => ore.name === oreName);
    // return oreData ? Math.round((quantities[oreName] / oreData.baseValue).toFixed(2)) : 0;
    return oreData ? (quantities[oreName] / oreData.baseValue).toFixed(1) : 0;
  };

  // Calculate totals
  const totalOres = selectedOres.reduce((sum, oreObj) => {
    // Access quantity using oreObj.name as key
    return sum + (quantities[oreObj.name] || 0);
  }, 0);

  const allAV = selectedOres.reduce((sum, oreObj) => {
    // Use oreObj.baseValue directly since we have the full object
    const quantity = quantities[oreObj.name] || 0;
    const valuePerAV = oreObj.baseValue || 1; // Fallback to 1 if undefined
    return sum + quantity / valuePerAV;
  }, 0);

  // Round the final AV total and format as string
  const totalAV = Math.round(allAV).toFixed(0);

  // Handle discount change
  const handleDiscountChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setDiscount(Math.min(100, Math.max(0, value))); // Clamp between 0-100
  };

  // Get the discounted AV value after getting from the input
  const discountedAV = totalAV * (1 - discount / 100);

  // Check if the user has enough ore
  const hasEnoughOre = (oreObj) => {
    if (!csvData || typeof csvData !== "object") return false;
    const requiredAmount = quantities[oreObj.name] || 0;
    const inventoryAmount = csvData[oreObj.name] || 0;
    return inventoryAmount >= requiredAmount;
  };
  // Get the available amount of ores the user has from storage
  const getAvailableAmount = (oreObj) => {
    if (!csvData || typeof csvData !== "object") return 0;
    return csvData[oreObj.name] || 0;
  };

  // Calculate which and how many ores are missing
  const getMissingOres = () => {
    if (!csvData || typeof csvData !== "object") return [];

    return selectedOres
      .filter((oreObj) => !hasEnoughOre(oreObj))
      .map((oreObj) => ({
        ...oreObj,
        missing: Math.max(
          0,
          (quantities[oreObj.name] || 0) - (csvData[oreObj.name] || 0)
        ),
      }));
  };

  // Check if all ores in the table are available
  const allOresAvailable =
    selectedOres.length > 0 &&
    selectedOres.every((oreObj) => {
      return hasEnoughOre(oreObj, quantities[oreObj.name]);
    });

  // Calculate missing ores
  const missingOres = getMissingOres();
  const hasMissingOres = missingOres.length > 0;

  // User can apply a single quantity to all ores in the table
  const applyGlobalQuantity = (quantity) => {
    const newQuantities = { ...quantities };
    selectedOres.forEach((ore) => {
      newQuantities[ore.name] = quantity;
    });
    setQuantities(newQuantities);
  };

  // Clear the entire table
  const clearTable = () => {
    setSelectedOres([]);
    setQuantities({});
  };

  const removeOresFromInv = (selectedOres) => {
    window.alert("Are you sure you want to remove these ores from your data?");
  }

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
      <div className="t-button-container">
        <div className="box-button">
          <button
            onClick={() => setIsJohnValues(true)}
            className={isJohnValues ? "color-template-rhylazil" : ""}
          >
            <span>John Values</span>
          </button>
        </div>
        <div className="box-button">
          <button
            onClick={() => setIsJohnValues(false)}
            className={!isJohnValues ? "color-template-diamond" : ""}
          >
            <span>NAN Values</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="trade-main-content">
        {/* Left Column - Discount and Search */}
        <div className="trade-controls-column">
          <div className="discount-container">
            <h2>Discount %</h2>
            <input
              type="number"
              min="0"
              max="100"
              step="1"
              value={discount}
              onChange={handleDiscountChange}
              className="discount-input"
              placeholder="Enter discount percentage"
            />
          </div>

          <div className="search-container">
            <h2>Add Ores to Trade ⤵</h2>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search ores or layers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              className="search-input"
            />
            {searchTerm && (
              <div className="search-results-container">
                <ul className="search-results" ref={resultsRef}>
                  {filteredOres.map((ore, index) => (
                    <li
                      key={`${ore.name}-${index}`}
                      onClick={() => handleAddOre(ore)} // Pass the full ore object
                      className={`search-result-item ${
                        index === selectedIndex ? "selected" : ""
                      }`}
                    >
                      {ore.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Table */}
        <div className="trade-table-section">
          <div className="totals-and-clear-container">
            <div className="trade-totals">
              <p>
                ➜ Total AV: <span>{totalAV}</span>
              </p>
              <p>
                ➜ Discounted AV ({discount}%):{" "}
                <span>{Math.round(discountedAV)}</span>
              </p>
              <p>
                ➜ Total # Ores: <span>{totalOres}</span>
              </p>
            </div>
            {allOresAvailable ? (
              <div className="global-checkmark">
                ✓ All ores available in inventory
              </div>
            ) : (
              hasMissingOres && (
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
            <div className="clear-button-container">
              <div className="box-button" onClick={clearTable}>
                <button>
                  <span className="button">Clear Table</span>
                </button>
              </div>
            </div>
            <div className="clear-button-container">
              <div className="box-button" onClick={removeOresFromInv}>
                <button>
                  <span className="button">Remove Ores from Inventory</span>
                </button>
              </div>
            </div>
          </div>
          <table className="trade-table">
            <thead>
              <tr>
                <th>Ore Name</th>
                <th>
                  <div className="quantity-cell-container">
                    <span># to Trade</span>
                    <input
                      type="number"
                      min="1"
                      value={globalQuantity}
                      onChange={(e) => {
                        const value = Math.max(
                          1,
                          parseInt(e.target.value) || 1
                        );
                        setGlobalQuantity(value);
                        applyGlobalQuantity(value);
                      }}
                      className="quantity-input"
                    />
                  </div>
                </th>
                <th>AV</th>
              </tr>
            </thead>
            <tbody>
              {selectedOres.map((oreObj) => {
                // Get the className from the ore object (works for both John's and NAN's values)
                const oreClassName = oreObj.className || "";

                return (
                  <tr key={oreObj.name} className={oreClassName}>
                    <td
                      className={`ore-name-cell ${oreClassName}`}
                      data-text={oreObj.name}
                    >
                      <button
                        className="delete-ore-button"
                        onClick={() => handleRemoveOre(oreObj)}
                      >
                        ✖
                      </button>
                      <img
                        src={oreIcons[oreObj.name.replace(/ /g, '_')]}
                        alt={`${oreObj.name} icon`}
                        className="t-ore-icon"
                        loading="lazy"
                        onError={(e) => {
                          console.error(`Missing icon for: ${oreObj.name}`);
                          e.target.style.display = 'none';
                        }}
                      />
                      {oreObj.name}
                    </td>
                    <td>
                      <div className="quantity-cell-container">
                        <div
                          className={`inventory-check ${
                            hasEnoughOre(oreObj) ? "has-enough" : "not-enough"
                          }`}
                        >
                          {hasEnoughOre(oreObj) ? "✓" : "✖"}
                        </div>
                        <div className="inventory-count">
                          {getAvailableAmount(oreObj)}/
                          {quantities[oreObj.name] || 0}
                        </div>
                        <input
                          type="number"
                          value={quantities[oreObj.name] ?? ""}
                          onChange={(e) =>
                            handleQuantityChange(oreObj.name, e.target.value)
                          }
                          className="quantity-input"
                          min="1"
                        />
                      </div>
                    </td>
                    <td>{calculateAV(oreObj.name)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TradeTool;
