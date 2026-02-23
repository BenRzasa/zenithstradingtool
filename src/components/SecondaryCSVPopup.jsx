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

import React, { useState, useContext, useMemo } from "react";
import { MiscContext } from "../context/MiscContext";


function SecondaryCSVPopup({ onClose }) {
    const { oreNames, setSecondaryCSVData } = useContext(MiscContext);
    const [csvInput, setCSVInput] = useState("");

     const ORE_NAMES = useMemo(() => {
            return Object.freeze([...oreNames]);
    }, [oreNames]);

    const handleSave = () => {
        const csvInput = document.getElementById("csv-input").value;
        if (!csvInput) return;
        // Store current completion as previous before updating
        const newAmounts = csvInput.split(",").map(Number);
        const updatedData = {};
        ORE_NAMES.forEach((ore, index) => {
            updatedData[ore] =
                newAmounts[index] !== undefined && !isNaN(newAmounts[index])
                    ? newAmounts[index]
                    : 0;
        });
        setSecondaryCSVData(updatedData);
        onClose();
    };

    return (
        <div className="popup-overlay">
            <div className="popup">
                    <h3>Enter Secondary CSV</h3>
                    <button
                        onClick={onClose}
                        className="close-button"
                    >✖
                    </button>
                <div className="csv-output" style={{width: "90%"}}>
                    <textarea
                        id="csv-input"
                        style={{width: "100%"}}
                        placeholder="Paste your secondary CSV string here..."
                    />
                </div>
                <div className="button-container" id="csv">
                    <button onClick={handleSave}>Save</button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default SecondaryCSVPopup;
