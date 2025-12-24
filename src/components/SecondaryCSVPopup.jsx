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
