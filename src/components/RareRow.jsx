import React, { useContext } from "react";
import { OreIcons } from "../data/OreIcons";
import { MiscContext } from "../context/MiscContext";

import "../styles/AllGradients.css";
import "../styles/LayerTable.css";
import "../styles/ValueChart.css";

/*
  Import similar to:
  <ValueModeSelector
    currentMode={currentMode}
    setCurrentMode={setCurrentMode}
  />
*/

const RareRow = ({
    ore,
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
                className={`name-column ${getOreClassName(ore.name)}`}
                style={{fontSize: "20px"}}
                data-text={ore.name}
            >
                {OreIcons[ore.name.replace(/ /g, "_")] ? (
                    <img
                        src={OreIcons[ore.name.replace(/ /g, "_")]}
                        alt={`${ore.name} icon`}
                        className="ore-icon"
                        loading="lazy"
                        onError={(e) => {
                            console.error(`Missing icon for: ${ore.name}`);
                            e.target.style.display = "none";
                        }}
                        style={{marginRight: "5px"}}
                    />
                ) : (
                        <span>🖼️</span>
                    )}
                {ore.name}
            </td>

            {/* Quantity cell */}
            <td className="quantity-cell" style={{width: "fit-content", height: "fit-content"}}>
                <button
                    className="count-btn decrement"
                    tabIndex="-1"
                    onClick={() => decrementValue(ore.name)}
                    aria-label={`Decrement ${ore.name}`}
                >
                    -
                </button>
                <input
                    className="quantity-input"
                    style={{width: "8em", height: "2em", fontSize: "20px", textAlign: "center", padding: "2px auto"}}
                    id={`count-input-${ore.name}`}
                    type="number"
                    value={count === 0 ? "" : count}
                    min="0"
                    onChange={(e) => handleCountChange(ore.name, e.target.value)}
                    onBlur={(e) => {
                        if (e.target.value === "") {
                            handleCountChange(ore.name, 0);
                        }
                    }}
                    aria-label={`Edit ${ore.name} count`}
                />
                <button
                    className="count-btn increment"
                    tabIndex="-1"
                    onClick={() => incrementValue(ore.name)}
                    aria-label={`Increment ${ore.name}`}
                >
                    +
                </button>
            </td>

            {/* NVs cell */}
            <td>{calculateNumV(getValueForMode(ore), count)}</td>

            {/* Last found cell */}
            <td style={{color: "var(--accent-color)"}}>{formatDate(lastUpdated)}</td>
        </tr>
    );
};

export default RareRow;
