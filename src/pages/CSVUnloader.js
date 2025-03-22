import React, { useContext } from "react";
import { OreNames } from "../components/OreNames";
import "../styles/CSVUnloader.css";
import { Link } from "react-router-dom";
import { CSVContext } from "../context/CSVContext"; // Import the context

function CSVUnloader() {
  const { csvData, setCSVData } = useContext(CSVContext); // Access the context

  const updateOreAmounts = () => {
    const csvInput = document.getElementById("csvInput").value;
    const newAmounts = csvInput.split(",").map(Number);

    setCSVData((prevAmounts) =>
      prevAmounts.map((_, index) =>
        newAmounts[index] !== undefined && !isNaN(newAmounts[index])
          ? newAmounts[index]
          : 0
      )
    );
  };

  return (
    <div>
      <h1>Copy & Paste your CSV string from Settings→Other in the box below.</h1>
      {/* Nav Bar */}
      <nav className="nav-bar">
        <ul>
          <li>
            <Link to="/">Back to Home Page</Link>
          </li>
          <li>
            <Link to="/tradetool">Trade Tool</Link>
          </li>
          <li>
            <Link to="/valuechart">Value Chart</Link>
          </li>
        </ul>
      </nav>

      {/* Ore List Table */}
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
                <td>{csvData[index]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CSV Input Section */}
      <div className="csv-input">
        <h2>Enter CSV Values</h2>
        <textarea
          id="csvInput"
          placeholder="Enter comma-separated numbers..."
        />
        <button onClick={updateOreAmounts}>Update Amounts</button>
      </div>
    </div>
  );
}

export default CSVUnloader;