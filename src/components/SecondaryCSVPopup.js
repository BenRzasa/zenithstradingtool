
import React, { useState, useContext } from 'react';
import { MiscContext } from '../context/MiscContext';
import { OreNames } from '../data/OreNames';

import '../styles/SecondaryCSVPopup.css';

function SecondaryCSVPopup({ onClose }) {
  const { setSecondaryCSVData } = useContext(MiscContext);
  const [csvInput, setCSVInput] = useState('');

  const handleSave = () => {
    if (!csvInput) return;
    const newAmounts = csvInput.split(",").map(Number);
    const updatedData = {};
    OreNames.sort((a, b) => a.localeCompare(b)).forEach((ore, index) => {
      updatedData[ore] = newAmounts[index] !== undefined && !isNaN(newAmounts[index])
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
          <div
            className="box-button"
            style={{
              width: '40px',
              height: '40px',
            }}
          >
          <button
            onClick={onClose}
            style={{
              background: "red",
              display: "flex",
              fontSize: "25px",
              color: "white",
              justifyContent: "center",
              alignItems: "center"
            }}
          >✖</button>
          </div>
        </div>
        <div className="c-csv-output">
          <textarea
            value={csvInput}
            onChange={(e) => setCSVInput(e.target.value)}
            placeholder="Paste your secondary CSV string here..."
          />
        </div>
        <div className="button-container">
          <div className="box-button">
            <button
              onClick={handleSave}
            >
              Save
            </button>
          </div>
          <div className="box-button">
            <button
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SecondaryCSVPopup;