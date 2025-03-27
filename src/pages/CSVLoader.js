import React, { useContext } from "react";
import { OreNames } from "../components/OreNames";
import "../styles/CSVLoader.css";
import { Link } from "react-router-dom";
import { CSVContext } from "../context/CSVContext"; // Import the context

function CSVLoader() {
  const { csvData, setCSVData } = useContext(CSVContext); // Access the context

  const updateOreAmounts = () => {
    const csvInput = document.getElementById("csvInput").value;
    if (!csvInput) return;
  
    const newAmounts = csvInput.split(",").map(Number);
    
    // Create an object with ore names as keys
    const updatedData = OreNames.reduce((acc, ore, index) => {
      acc[ore] = newAmounts[index] !== undefined && !isNaN(newAmounts[index])
        ? newAmounts[index]
        : 0;
      return acc;
    }, {});
  
    setCSVData(updatedData);
  };

  return (
    <div>
    {/* Nav Bar - remains fixed at top */}
    <nav className="nav">
      <ul>
        <li>
          <Link to="/">Back to Home Page</Link>
        </li>
        <li>
          <Link to="/valuechart">Value Chart</Link>
        </li>
        <li>
          <Link to="/tradetool">Trade Tool</Link>
        </li>
      </ul>
    </nav>
    <div className="main-container">
      <h1>CSV Loader Usage:</h1>
      <l>
        <ul>1. Copy & Paste your CSV string from Settings ➜ Other (in TCC) in the box below.</ul>
        <ul>2. Click "Update Amounts" button to load your CSV data into the website.</ul>
        <ul>3. Navigate to the Value Chart by clicking on the link in the top right corner.</ul>
      </l>
      {/* Main content area with flex layout */}
      <div className="main-content">
        {/* Ore List Table - now part of flex layout */}
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