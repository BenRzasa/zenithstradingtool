import React, { useContext, useRef, useState } from "react";
import { MiscContext } from "../context/MiscContext";
import { PinListContext } from "../context/PinListContext";

import { OreIcons } from "../data/OreIcons";
import missingIcon from "../images/ore-icons/Missing_Texture.webp";

import "../styles/CustomPinList.css";
import "../styles/TradeTool.css";

const CustomPinList = ({ isOpen, onClose }) => {
  const { oreValsDict, getValueForMode, getOreClassName, getCurrentCSV } =
  useContext(MiscContext);
  const {
    pinListState,
    addToPinList,
    removeFromPinList,
    updatePinQuantity,
    clearPinList,
    isPinSelected,
    togglePinSelection,
    handlePinSearchTermChange,
    handlePinSearchFocusChange,
    handlePinSearchIndexChange,
    addMultipleOresToPinList,
    filterOres,
    useAVMode,
    setUseAVMode
  } = useContext(PinListContext);

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

  // Calculate AV for pinned ore
  const calculatePinAV = (oreName) => {
    const oreData = allOresWithLayers.find((ore) => ore.name === oreName);
    if (!oreData) return "0.0";
    const quantity = quantities[oreName] ?? 0;
    const value = getValueForMode(oreData);
    return (quantity / value).toFixed(1);
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
      <div className="pinlist-header">
        <h2>Custom Pin List</h2>
        <button onClick={onClose} className="close-button">
          ×
        </button>
      </div>
      {/* Search box */}
      <div className="search-container">
        <label htmlFor="pinlist-search-input">
          <input
            id="pinlist-search-input"
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
            className="search-input"
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
      </div>

      {/* Actions*/}
      <div className="pinlist-actions">
        <div className="box-button" style={{ width: "fit-content" }}>
          <button onClick={clearPinList}>Clear</button>
        </div>
        {/* Totals */}
        {pinListState.pinnedOres.length > 0 && (
          <div className="pinlist-totals">
            <p>
              💲Total AV:{" "}
              <span className="placeholder">
                {pinTotals.totalAV.toFixed(1)}
              </span>
            </p>
            <p>
              ⛏️Total # Ores:{" "}
              <span className="placeholder">{pinTotals.totalOres}</span>
            </p>
          </div>
        )}
        {pinListState.pinnedOres.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div className="box-button" style={{ width: "fit-content" }}>
            <button onClick={copyPinnedFilterToClipboard}>
              <i className="fa-solid fa-clipboard"></i> Copy Filter
            </button>
          </div>
          <div className="box-button" style={{ width: "fit-content" }}>
            <button 
                onClick={() => setUseAVMode(!useAVMode)}
                className={useAVMode ? "color-template-ambrosine" : "color-template-cindrasil"}
            >
              {useAVMode ? "AV Mode" : "Quantity Mode"}
            </button>
          </div>
      </div>
        )}
      </div>
      {/* Pinned ores table */}
      <div className="pinlist-content">
        {pinListState.pinnedOres.length > 0 ? (
          <table
            className="trade-table pinlist-table"
            style={{
              whiteSpace: "nowrap",
              marginLeft: "-15px",
              marginTop: "15px",
              marginRight: "-500px",
              transform: "scale(1)",
              transformOrigin: "top left",
              width: "fit-content",
            }}
          >
            <thead>
              <tr>
                <th>Ore</th>
                <th># | AV | Progress</th>
              </tr>
            </thead>
            <tbody>
              {pinListState.pinnedOres
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((ore) => (
                  <tr
                    key={ore.name}
                    className={isPinSelected(ore.name) ? "selected-row" : ""}
                    onClick={() => togglePinSelection(ore.name)}
                  >
                    <td
                      className={`tr-name-cell ${getOreClassName(ore.name)}`}
                      data-text={ore.name}
                      style={{
                        paddingRight: "10px",
                        whiteSpace: "preserve wrap",
                      }}
                    >
                      <button
                        className="delete-ore-button"
                        tabIndex="-1"
                        aria-label="Remove ore from pin list"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromPinList(ore.name);
                        }}
                      >
                        ✖
                      </button>
                      {OreIcons[ore.name.replace(/ /g, "_")] ? (
                        <img
                          src={OreIcons[ore.name.replace(/ /g, "_")]}
                          alt={`${ore.name} icon`}
                          className="t-ore-icon"
                          onError={(e) => {
                            console.error(`Missing icon for: ${ore.name}`);
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                          // Missing icon
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
                      <div
                        className="quantity-cell-container"
                        style={{
                          whiteSpace: "preserve wrap",
                          flexDirection: "row",
                          justifyContent: "center",
                          width: "fit-content",
                        }}
                      >
                        <div style={{ flexDirection: "column" }}>
                          <div
                            className="inventory-count"
                            style={{ marginLeft: "5px" }}
                          >
                            {getAvailableAmount(ore)}/
                            {quantities[ore.name] ?? 0}
                            {!useAVMode ? ` | ${calculatePinAV(ore.name)} AV` : ""}
                          </div>
                          {/* Progress Bar */}
                          <div className="progress-bar-container">
                            <div
                              className={`progress-bar ${ hasEnoughOre(ore) ? "complete" : "incomplete"}`}
                              style={{
                                width: `${getProgressPercentage(ore)}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                        <label
                          htmlFor={`pin-quantity-${ore.name}`}
                          className="quantity-label"
                        >
                          <input
                            id={`pin-quantity-${ore.name}`}
                            aria-label="Ore quantity input"
                            type="number"
                            step={useAVMode ? "any" : "1"}
                            value={quantities[ore.name] ?? ""}
                            onChange={(e) =>
                              updatePinQuantity(ore, e.target.value)
                            }
                            className="quantity-input"
                            min="1"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </label>
                      </div>
                    </td>
                    <td></td>
                  </tr>
                ))}
            </tbody>
          </table>
        ) : (
            <p className="pinlist-empty">No ores pinned yet</p>
          )}
      </div>
    </div>
  );
};

export default CustomPinList;
