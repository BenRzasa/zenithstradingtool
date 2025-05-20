import React, { useContext, useEffect, useState } from 'react';

import { MiscContext } from '../context/MiscContext';
import { OreNames } from '../data/OreNames';

import '../styles/CSVLoader.css';
import '../styles/CSVEditor.css';


function CSVEditor({ onClose }) {

  const {
    csvData
  } = useContext(MiscContext);

  const [tempCSV, setTempCSV] = useState([]);

  // Initialize tempCSV when component mounts or csvData changes
  useEffect(() => {
    const initialCSV = OreNames.map(ore => csvData[ore] || 0);
    setTempCSV(initialCSV);
    // Show CSV with names by default
    const csvWithNames = OreNames.map((oreName, index) => 
      `${oreName}:${initialCSV[index] || 0}`
    );
    document.getElementById("csvEditBox").value = csvWithNames.join(",");
  }, [csvData]);

  // Show the CSV data and ore names and put it in the editor box
  const showCSVOnly = () => {
    // Create an array of values in the same order as OreNames
    // Join with commas and put in textarea
    document.getElementById("csvEditBox").value = tempCSV.join(",");
  };

  // Show the CSV data and ore names as labels and put it in the editor box
  const showCSVAndNames = (csvValues = tempCSV) => {
    const csvWithNames = OreNames.map((oreName, index) => 
      `${oreName}:${csvValues[index] || 0}`
    );
    document.getElementById("csvEditBox").value = csvWithNames.join(",");
  };

  const saveModifiedCSV = () => {
    const editedValue = document.getElementById("csvEditBox").value;
    let newCSV = [];
    if (editedValue.includes(':')) {
      // Handle name:value format
      const entries = editedValue.split(',');
      newCSV = OreNames.map(oreName => {
        const entry = entries.find(e => e.startsWith(oreName + ':'));
        return entry ? parseInt(entry.split(':')[1]) || 0 : 0;
      });
    } else {
      // Handle numbers-only format
      newCSV = editedValue.split(',').map(num => parseInt(num) || 0);
    }
    setTempCSV(newCSV);
    showCSVAndNames(newCSV); // Update the display with the new values
  };

  return (
    <div className="editor-popup">
      <div className="editor-header">
      <h1>CSV Editor</h1>
      <button className="close-button" onClick={onClose}>
        ×
      </button>
      </div>
        <div className="csv-output">
          {/* CSV output Box */}
          <textarea
            id="csvEditBox"
            placeholder="CSV Goes here..."
          />
          <div className="editor-buttons">
          <div className="box-button">
            <button onClick={() =>
              {showCSVAndNames();}}
            >CSV & Names
            </button>
          </div>
          <div className="box-button">
            <button onClick={() =>
              {showCSVOnly();}}
            >Export CSV
            </button>
          </div>
          <div className="box-button">
            <button onClick={() =>
              {saveModifiedCSV();}}
            >Save
            </button>
          </div>
        </div>
        </div>
    </div>
  );
};

export default CSVEditor;