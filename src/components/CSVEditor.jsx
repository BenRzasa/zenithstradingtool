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

import React, { useContext, useEffect, useState } from "react";

import { MiscContext } from "../context/MiscContext";

function CSVEditor({ onClose }) {
    const { 
        oreNames,
        getCurrentCSV 
    } = useContext(MiscContext);


    const csvData = getCurrentCSV();
    const [tempCSV, setTempCSV] = useState([]);

    // Initialize tempCSV when component mounts or csvData changes
    useEffect(() => {
        const initialCSV = oreNames.map((ore) => csvData[ore] || 0);
        setTempCSV(initialCSV);

        const csvWithNames = oreNames.map(
            (oreName, index) => `${oreName}:${initialCSV[index] || 0}`
        );
        document.getElementById("csv-edit-box").value = csvWithNames.join(",\n");
    }, [csvData]);

    // Show the CSV data and ore names and put it in the editor box
    const showCSVOnly = () => {
        document.getElementById("csv-edit-box").value = tempCSV.join(",");
    };

    // Show the CSV data and ore names as labels and put it in the editor box
    const showCSVAndNames = (csvValues = tempCSV) => {
        const csvWithNames = oreNames.map(
            (oreName, index) => `${oreName}:${csvValues[index] || 0}`
        );
        document.getElementById("csv-edit-box").value = csvWithNames.join(",\n");
    };

    // Save the CSV depending on whether it's name:value or value only
    const saveModifiedCSV = () => {
        const editedValue = document.getElementById("csv-edit-box").value;
        let newCSV = [];
        if (editedValue.includes(":")) {
            // Handle name:value format
            const entries = editedValue.split(",\n");
            newCSV = oreNames.map((oreName) => {
                const entry = entries.find((e) => e.startsWith(oreName + ":"));
                return entry ? parseInt(entry.split(":")[1]) || 0 : 0;
            });
        } else {
            // Handle numbers-only format
            newCSV = editedValue.split(",\n").map((num) => parseInt(num) || 0);
        }
        setTempCSV(newCSV);
        showCSVAndNames(newCSV);
    };

    return (
        <div className="box">
            <div className="row-container">
                <h1>CSV Editor</h1>
                <button
                    className="close-button"
                    onClick={onClose}
                >
                    ✖
                </button>
            </div>
            <div className="csv-output">
                {/* CSV output Box */}
                <textarea id="csv-edit-box" style={{width: "200%"}} placeholder="CSV string goes here..." />
                <div className="button-container">
                    <button
                        onClick={() => {
                            showCSVAndNames();
                        }}
                    >
                        CSV & Names
                    </button>
                    <button
                        onClick={() => {
                            showCSVOnly();
                        }}
                    >
                        Export CSV
                    </button>
                    <button
                        onClick={() => {
                            saveModifiedCSV();
                        }}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CSVEditor;
