import React, { useContext } from 'react';

import { MiscContext } from '../context/MiscContext';
import { OreNames } from '../data/OreNames';

import '../styles/CSVLoader.css';
import '../styles/CSVEditor.css';


function CSVEditor() {

  const {
    csvData
  } = useContext(MiscContext);

  // Show the CSV data and ore names and put it in the editor box
  const showCSVOnly = () => {
    document.getElementById("csvEditBox").value = "";
    // Create an array of values in the same order as OreNames
    const csvValues = OreNames.map(ore => csvData[ore] || 0);
    // Join with commas and put in textarea
    document.getElementById("csvEditBox").value = csvValues.join(",");
  };

  // Show the CSV data and ore names and put it in the editor box
  const showCSVAndNames = () => {
    // Create an array of values in the same order as OreNames
    const csvValues = OreNames.map(ore =>
      `${OreNames[ore]}:${csvData[ore] || 0}`);
    // Join with commas and put in textarea
    document.getElementById("csvEditBox").value = csvValues.join(",");
  };

  return (
    <div className="editor-popup">
      <h1>CSV Editor</h1>
        <div className="csv-output">
          {/* CSV output Box */}
          <textarea
            id="csvEditBox"
            placeholder="CSV Goes here..."
          />
          <div className="box-button">
            <button onClick={() =>
              {showCSVAndNames();}}
            >Generate CSV & Names
            </button>
          </div>
          <div className="box-button">
            <button onClick={() =>
              {showCSVOnly();}}
            >Placeholder for Saving
            </button>
          </div>
        </div>
    </div>
  );
};

export default CSVEditor;