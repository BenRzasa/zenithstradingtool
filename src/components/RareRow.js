import React, { useContext } from "react";
import { OreIcons } from "../data/OreIcons";
import { MiscContext } from "../context/MiscContext";

import "../styles/AllGradients.css";
import "../styles/LayerTable.css";
import "../styles/ValueChart.css";

/*
  Import like:
  <ValueModeSelector
    currentMode={currentMode}
    setCurrentMode={setCurrentMode}
  />
*/

// Extracting row rendering into a separate component for reusability
const RareRow = ({
  item,
  count,
  lastUpdated,
  incrementValue,
  decrementValue,
  handleCountChange,
  getOreClassName,
  calculateNumV,
  formatDate,
}) => {
  const { getValueForMode } = useContext(MiscContext);

  return (
    <tr>
      {/* Ore name cell */}
      <td
        className={`name-column ${getOreClassName(item.name)}`}
        data-text={item.name}
      >
        {OreIcons[item.name.replace(/ /g, "_")] ? (
          <img
            src={OreIcons[item.name.replace(/ /g, "_")]}
            alt={`${item.name} icon`}
            className="ore-icon"
            loading="lazy"
            onError={(e) => {
              console.error(`Missing icon for: ${item.name}`);
              e.target.style.display = "none";
            }}
          />
        ) : (
          <span>🖼️</span>
        )}
        {item.name}
      </td>

      {/* Quantity cell */}
      <td className="count-cell">
        <div className="count-controls">
          <button
            className="count-btn decrement"
            tabindex="-1"
            onClick={() => decrementValue(item.name)}
            aria-label={`Decrement ${item.name}`}
          >
            -
          </button>
          <div className="count-input-wrapper">
            <input
              id={`count-input-${item.name}`}
              type="number"
              value={count === 0 ? "" : count}
              min="0"
              onChange={(e) => handleCountChange(item.name, e.target.value)}
              onBlur={(e) => {
                if (e.target.value === "") {
                  handleCountChange(item.name, 0);
                }
              }}
              aria-label={`Edit ${item.name} count`}
            />
          </div>
          <button
            className="count-btn increment"
            tabindex="-1"
            onClick={() => incrementValue(item.name)}
            aria-label={`Increment ${item.name}`}
          >
            +
          </button>
        </div>
      </td>

      {/* NVs cell */}
      <td>{calculateNumV(getValueForMode(item), count)}</td>

      {/* Last found cell */}
      <td>{formatDate(lastUpdated)}</td>
    </tr>
  );
};

export default RareRow;
