/*
 * Zenith's Trading Tool - An external website created for Celestial Caverns
 * Copyright (C) 2026 - Ben Rzasa
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the 'Software'), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE 
 * SOFTWARE.
*/

import React, { useContext } from "react";
import { IconContext} from "../App";
import { MiscContext } from "../context/MiscContext";

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
    const { getImageSource } = useContext(IconContext);

    return (
        <tr>
            {/* Ore name cell */}
            <td
                className={`name-column ${getOreClassName(ore.name)}`}
                style={{fontSize: "20px", textWrap: "nowrap"}}
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
                    style={{marginRight: "7px"}}
                />
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
