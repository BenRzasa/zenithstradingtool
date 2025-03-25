import React, { useContext } from "react";
import { OreNames } from "../components/OreNames";
import "../styles/CSVLoader.css";
import { Link } from "react-router-dom";
import { CSVContext } from "../context/CSVContext"; // Import the context

function CSVLoader() {
  const { csvData, setCSVData } = useContext(CSVContext); // Access the context

  const updateOreAmounts = () => {
    const csvInput = document.getElementById("csvInput").value;
    const newAmounts = csvInput.split(",").map(Number);

    // Create a new object to map ore names to their corresponding inventory values
    const updatedData = OreNames.reduce((acc, ore, index) => {
      acc[ore] = newAmounts[index] !== undefined && !isNaN(newAmounts[index])
        ? newAmounts[index]
        : 0;
      return acc;
    }, {});

    // Update the CSV data state
    setCSVData(updatedData);
  };

  return (
    <div className="main-container">
      <h1>Copy & Paste your CSV string from Settings ➜ Other in the box below.</h1>
      
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

      {/* Main content area with flex layout */}
      <div className="main-content">
        {/* Ore List Table - now part of flex layout */}
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

        {/* CSV Input Section - now part of flex layout */}
        <div className="csv-input">
          <h2>Enter CSV Values</h2>
          <textarea
            id="csvInput"
            placeholder="Enter comma-separated numbers..."
          />
          <button onClick={updateOreAmounts} className="color-template-torn-fabric">
            Update Amounts
          </button>
        </div>
      </div>
    </div>
  );
}

export default CSVLoader;