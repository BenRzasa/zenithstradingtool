import React, { useState, useContext } from "react";
import { MiscContext } from "../context/MiscContext";
import { getOreNames } from "../data/OreNames";


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
        <div className="popup-overlay">
            <div className="popup">
                    <h3>Enter Secondary CSV</h3>
                    <button
                        onClick={onClose}
                        className="close-button"
                    >✖
                    </button>
                <div className="csv-output">
                    <textarea
                        value={csvInput}
                        onChange={(e) => setCSVInput(e.target.value)}
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
