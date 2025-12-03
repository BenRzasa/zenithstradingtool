import React, { useState, useContext } from "react";
import { MiscContext } from "../context/MiscContext";
import { getOreNames } from "../data/OreNames";

import "../styles/SecondaryCSVPopup.css";

function SecondaryCSVPopup({ onClose }) {
    const { setSecondaryCSVData } = useContext(MiscContext);
    const [csvInput, setCSVInput] = useState("");
    const OreNames = getOreNames();


    const handleSave = () => {
        if (!csvInput) return;
        const newAmounts = csvInput.split(",").map(Number);
        const updatedData = {};
        OreNames.sort((a, b) => a.localeCompare(b)).forEach((ore, index) => {
            updatedData[ore] =
                newAmounts[index] !== undefined && !isNaN(newAmounts[index])
                    ? newAmounts[index]
                    : 0;
        });
        setSecondaryCSVData(updatedData);
        onClose();
    };

    return (
        <div className="c-modal-overlay">
            <div className="c-editor-popup">
                <div className="c-editor-header">
                    <h3>Enter Secondary CSV</h3>
                    <button
                        onClick={onClose}
                        className="close-button"
                    >✖
                    </button>
                </div>
                <div className="c-csv-output">
                    <textarea
                        value={csvInput}
                        onChange={(e) => setCSVInput(e.target.value)}
                        placeholder="Paste your secondary CSV string here..."
                        style={{
                            backgroundColor: "var(--background-color)",
                            color: "var(--text-color)",
                            outline: "2px solid var(--switch-outline)",
                        }}
                    />
                </div>
                <div className="button-container">
                    <div className="box-button">
                        <button onClick={handleSave}>Save</button>
                    </div>
                    <div className="box-button">
                        <button onClick={onClose}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SecondaryCSVPopup;
