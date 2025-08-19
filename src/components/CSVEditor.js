/* ZTT | CSV String Editor
  Allows the user to:
  - Display their current CSV string with the names of the ores
  - Edit the numbers and save the new values into a temporary CSV
  - Export the temporary CSV for copying and usage in their ZTT
*/

import React, { useContext, useEffect, useState } from 'react';

import { MiscContext } from '../context/MiscContext';
import { OreNames } from '../data/OreNames';

import '../styles/CSVLoader.css';
import '../styles/CSVEditor.css';


function CSVEditor({ onClose }) { // onClose component to allow closing the popup

  const {
    getCurrentCSV
  } = useContext(MiscContext);

  const csvData = getCurrentCSV();
  const [tempCSV, setTempCSV] = useState([]);

  // Initialize tempCSV when component mounts or csvData changes
  useEffect(() => {
    const initialCSV = OreNames.map(ore => csvData[ore] || 0);
    setTempCSV(initialCSV);

    const csvWithNames = OreNames.map((oreName, index) => 
      `${oreName}:${initialCSV[index] || 0}`
    );
    document.getElementById("csvEditBox").value = csvWithNames.join(",\n");
  }, [csvData]);

  // Show the CSV data and ore names and put it in the editor box
  const showCSVOnly = () => {
    document.getElementById("csvEditBox").value = tempCSV.join(",");
  };

  // Show the CSV data and ore names as labels and put it in the editor box
  const showCSVAndNames = (csvValues = tempCSV) => {
    const csvWithNames = OreNames.map((oreName, index) => 
      `${oreName}:${csvValues[index] || 0}`
    );
    document.getElementById("csvEditBox").value = csvWithNames.join(",\n");
  };

  // Save the CSV depending on whether it's name:value or value only
  const saveModifiedCSV = () => {
    const editedValue = document.getElementById("csvEditBox").value;
    let newCSV = [];
    if (editedValue.includes(':')) {
      // Handle name:value format
      const entries = editedValue.split(',\n');
      newCSV = OreNames.map(oreName => {
        const entry = entries.find(e => e.startsWith(oreName + ':'));
        return entry ? parseInt(entry.split(':')[1]) || 0 : 0;
      });
    } else {
      // Handle numbers-only format
      newCSV = editedValue.split(',\n').map(num => parseInt(num) || 0);
    }
    setTempCSV(newCSV);
    showCSVAndNames(newCSV); // Update the display with the new values
  };

  return (
    <div className="editor-popup">
      <div className="editor-header">
      <h1 style={{marginLeft: "15px"}}>CSV Editor</h1>
      <div
        className="box-button"
        style={{
          width:"50px",
          height:"50px",
          background:"red"
        }}
      >
        <button
          onClick={onClose}
          style={{
            width:"50px",
            height:"50px",
            background:"red",
            display:"flex",
            fontSize:"3em",
            color:"white",
            justifyContent:"center",
            alignItems:"center"
          }}
        >
          ×
        </button>
      </div>
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