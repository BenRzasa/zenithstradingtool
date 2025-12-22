import React from "react";

const CustomMultiplierInput = ({ currentMode, customMultiplier, setCustomMultiplier }) => {
    if (currentMode !== 7) return null;

    return (
        <div
            className="box"
            style={{margin: "10px auto"}}
        >
            <label htmlFor="custom-multiplier" style={{ marginRight: "10px" }}>
                Custom Multiplier (xAV):
            </label>
            <input
                className="quantity-input"
                type="number"
                id="custom-multiplier"
                min="1"
                step="1"
                value={customMultiplier}
                onChange={(e) => {
                    // Set empty on backspace
                    if (e.target.value === "") {
                        setCustomMultiplier("");
                        return;
                    }
                    // Otherwise enforce min of 1
                    const value = Math.max(1, parseInt(e.target.value) || 1);
                    setCustomMultiplier(value);
                }}
            />
        </div>
    );
};

export default CustomMultiplierInput;
