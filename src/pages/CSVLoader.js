/* ZTT | CSV Loader Page
  - Allows the user to update their data and view
  the name and quantity of each ore in their inventory.
  - Parses a CSV string, comma-separated, to ore names in
  alphabetical order. Stored in local storage to ensure persistency
  across sessions
*/

import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { OreNames } from "../components/OreNames";
import { CSVContext } from "../context/CSVContext";

import "../styles/CSVLoader.css";

function CSVLoader() {
  // Fetch the current data and the set function from context
  const {
    csvData,
    setCSVData
  } = useContext(CSVContext);

  // Update the amounts unless there is no data in the box
  const updateOreAmounts = () => {
    // Check for existing CSV Input already
    const csvInput = document.getElementById("csvInput").value;
    if (!csvInput) return;
    // Split the string (comma delimited) and map the amounts as numbers
    const newAmounts = csvInput.split(",").map(Number);
    // Create an updated object with ore names as keys
    const updatedData = OreNames.reduce((acc, ore, index) => {
      acc[ore] = newAmounts[index] !== undefined && !isNaN(newAmounts[index])
        ? newAmounts[index]
        : 0;
      return acc;
    }, {});
    // Once the data is updated, set it using the CSV context
    setCSVData(updatedData);
  };

  return (
    <div>
    {/* Nav Bar - remains fixed at top */}
    <nav className="nav">
      <ul>
        <li><Link to="/">Back to Home Page</Link></li>
        <li><Link to="/valuechart">Value Chart</Link></li>
        <li><Link to="/tradetool">Trade Tool</Link></li>
        <li><Link to="/misc">Miscellaneous</Link></li>
      </ul>
    </nav>
    <div className="main-container">
      {/* Usage instructions for the user */}
      <h1>CSV Loader Usage:</h1>
      <l>
        <ul>1. Copy & Paste your CSV string from Settings ➜ Other (in TCC) in the box below.</ul>
        <ul>2. Click "Update Amounts" button to load your CSV data into the website.</ul>
        <ul>3. Navigate to the Value Chart by clicking on the link in the top right corner.</ul>
      </l>
      {/* Main content area with flex layout */}
      <div className="main-content">
        {/* Ore list table - now part of flex layout */}
        <div className="ore-table-parent">
          <div className="ore-list">
            <table>
              <thead>
                <tr>
                  <th>Ore</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {/* Map all ores from OreNames, with the corresponding 
                    amount from the user's inventory CSV string */}
                {OreNames.map((ore, index) => (
                  <tr key={ore}>
                    <td>{ore}</td>
                    <td>{csvData[ore]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CSV Input Section */}
        <div className="box-button">
            <button onClick={updateOreAmounts}>
              <span>Update Amounts</span>
            </button>
        </div>
        <div className="csv-input">
          {/* CSV Input Box */}
          <textarea
            id="csvInput"
            placeholder="Enter comma-separated numbers..."
          />
        </div>
      </div>
    </div>
    </div>
  );
}

export default CSVLoader;