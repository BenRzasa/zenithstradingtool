import React, { useContext } from 'react';
import { MiscContext } from '../context/MiscContext';

const CustomMultiplierInput = () => {
  const {
    currentMode,
    customMultiplier,
    setCustomMultiplier
  } = useContext(MiscContext);

  if (currentMode !== 7) return null;

  return (
    <div
      className="custom-multiplier-input"
      style={{
        margin: "10px auto",
        padding: "10px",
        backgroundColor: "var(--background-color)",
        borderRadius: "10px",
        outline: "3px solid var(--table-outline)",
        maxWidth: "450px",
      }}
    >
      <label htmlFor="custom-multiplier" style={{ marginRight: "10px" }}>
        Custom Multiplier (xAV):
      </label>
      <input
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
        style={{
          padding: "8px",
          width: "70px",
          textAlign: "center",
          borderRadius: "4px",
          border: "1px solid var(--table-outline)",
        }}
      />
    </div>
  );
};

export default CustomMultiplierInput;
